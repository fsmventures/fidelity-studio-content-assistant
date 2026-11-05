import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const transportLimit = 3 * 1024 * 1024;
export const sourceLimit = 50 * 1024 * 1024;
const maxPixels = 80_000_000;
const serverPixels = 50_000_000;
const scriptDir = dirname(fileURLToPath(import.meta.url));
export class PhotoError extends Error {}

function imageType(bytes) {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'jpeg';
  if (bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return 'png';
  if (bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  if (bytes.toString('ascii', 4, 8) !== 'ftyp') return null;
  const end = Math.min(bytes.length, bytes.readUInt32BE(0), 256);
  const brands = [bytes.toString('ascii', 8, 12)];
  for (let i = 16; i + 4 <= end; i += 4) brands.push(bytes.toString('ascii', i, i + 4));
  return brands.some(b => ['heic','heix','hevc','hevx','mif1'].includes(b)) && !brands.some(b => ['avif','avis'].includes(b)) ? 'heif' : null;
}

function animatedRaster(bytes, type) {
  if (type === 'webp') return bytes.toString('ascii', 12, 16) === 'VP8X' && (bytes[20] & 2) !== 0;
  if (type !== 'png') return false;
  // APNG's animation control must precede its image data. Some still-image decoders show only frame one.
  for (let offset = 8; offset + 12 <= bytes.length;) {
    const chunk = bytes.toString('ascii', offset + 4, offset + 8);
    if (chunk === 'acTL') return true;
    if (chunk === 'IDAT') return false;
    offset += bytes.readUInt32BE(offset) + 12;
  }
  return false;
}

// Resolve only from the selected Node runtime's installed modules, never from the user's working directory.
function rasterLibrary() {
  const binary = dirname(process.execPath);
  const require = createRequire(import.meta.url);
  for (const path of [join(binary, '..', 'node_modules', 'sharp'), join(binary, 'node_modules', 'sharp')]) {
    if (existsSync(join(path, 'package.json'))) {
      try { return require(path); } catch { return null; }
    }
  }
  return null;
}

function nativeHeif(bytes) {
  if (process.platform !== 'darwin') return null;
  const command = '/usr/bin/osascript';
  const args = ['-l','JavaScript',join(scriptDir, 'decode-heif-mac.js')];
  const result = spawnSync(command, args, { input: bytes, maxBuffer: 32 * 1024 * 1024, timeout: 45_000, windowsHide: true, stdio: ['pipe','pipe','ignore'] });
  if (result.status !== 0 || !result.stdout || imageType(result.stdout) !== 'png') return null;
  return result.stdout;
}

export async function prepareLocalPhoto(input) {
  if (!input.length || input.length > sourceLimit) throw new PhotoError('Select one photo up to 50 MiB.');
  const type = imageType(input);
  if (!type) throw new PhotoError('Select a still JPEG, PNG, WebP or supported HEIC/HEIF photograph.');
  if (animatedRaster(input, type)) throw new PhotoError('Select a single still photo.');
  const sharp = rasterLibrary();
  if (!sharp) {
    if (type !== 'heif' && input.length <= transportLimit) return input;
    throw new PhotoError('Use the desktop workspace Node runtime with Sharp for large photos or HEIC files. Otherwise use the Pages CMS media picker.');
  }
  const options = { failOn: 'error', limitInputPixels: maxPixels, sequentialRead: true };
  let intermediate, raw;
  try {
    let decoder = sharp(input, options);
    if (type === 'heif' && process.platform === 'darwin') {
      intermediate = nativeHeif(input);
      if (!intermediate) throw new PhotoError('Apple ImageIO could not decode this single still HEIC within the 80-megapixel limit.');
      decoder = sharp(intermediate, options);
    }
    const metadata = await decoder.metadata();
    if (!metadata.width || !metadata.height || metadata.width * metadata.height > maxPixels || (metadata.pages ?? 1) !== 1) throw new PhotoError('Select a single still photo up to 80 megapixels.');
    if (type !== 'heif' && input.length <= transportLimit && metadata.width * metadata.height <= serverPixels) return input;
    // Decode and orient once; retries operate on the bounded sRGB raster. Raw pixels carry no source metadata.
    const raster = await decoder.rotate().resize({ width: 2560, height: 2560, fit: 'inside', withoutEnlargement: true }).toColourspace('srgb').raw().toBuffer({ resolveWithObject: true });
    raw = raster.data;
    const { width, height, channels } = raster.info;
    for (const [edge, quality] of [[2560,90], [2560,82], [2048,84], [1600,80], [1280,76]]) {
      const output = await sharp(raw, { raw: { width, height, channels } }).resize({ width: edge, height: edge, fit: 'inside', withoutEnlargement: true }).webp({ quality, alphaQuality: 100 }).toBuffer();
      if (output.length <= transportLimit) return output;
      output.fill(0);
    }
    throw new PhotoError('The optimized photo still exceeds the transport limit. Use the Pages CMS media picker.');
  } catch (error) {
    if (error instanceof PhotoError) throw error;
    throw new PhotoError(type === 'heif' ? 'This HEIC could not be decoded as a supported still image. Use a JPEG export or the Pages CMS media picker.' : 'This photo could not be decoded within the 80-megapixel limit.');
  } finally { intermediate?.fill(0); raw?.fill(0); }
}
