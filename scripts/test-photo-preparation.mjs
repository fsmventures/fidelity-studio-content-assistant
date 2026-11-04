import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { prepareLocalPhoto, sourceLimit, transportLimit } from '../plugins/fidelity-studio-content-assistant/scripts/prepare-local-photo.mjs';
const require = createRequire(import.meta.url);
let sharp;
for (const root of [join(dirname(process.execPath),'..'), dirname(process.execPath)]) {
  try { sharp = require(join(root,'node_modules','sharp')); break; } catch { }
}
test('an already fitting PNG stays byte-identical during local transfer', async () => {
  const original = await readFile(new URL('../plugins/fidelity-studio-content-assistant/assets/fidelity-studio-icon.png',import.meta.url));
  assert.equal(await prepareLocalPhoto(original), original);
});
test('an oversized source and unsupported format are rejected before image processing', async () => {
  await assert.rejects(prepareLocalPhoto(Buffer.alloc(sourceLimit + 1)), /50 MiB/);
  await assert.rejects(prepareLocalPhoto(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"/>')), /still JPEG/);
});
test('large JPEG is oriented, bounded to 2560 pixels and stripped of EXIF before transfer', {skip:!sharp && 'requires bundled desktop Node raster runtime'}, async () => {
  const width = 3200, height = 2000;
  const noise = Buffer.alloc(width * height * 3); let seed = 1471;
  for (let i=0;i<noise.length;i++) { seed = (Math.imul(seed,1664525)+1013904223)>>>0; noise[i] = seed>>>24; }
  const original = await sharp(noise,{raw:{width,height,channels:3}}).withMetadata({orientation:6}).jpeg({quality:96}).toBuffer();
  assert.ok(original.length > transportLimit);
  const result = await prepareLocalPhoto(original), metadata = await sharp(result).metadata();
  assert.ok(result.length <= transportLimit); assert.equal(metadata.format,'webp'); assert.ok(metadata.width < metadata.height);
  assert.ok(metadata.height <= 2560); assert.ok(Math.abs(metadata.width/metadata.height - height/width)<.001);
  assert.equal(metadata.exif,undefined); assert.equal(metadata.orientation,undefined); assert.equal(metadata.icc,undefined);
});
test('a claimed oversized raster is rejected before it is decoded in full', {skip:!sharp && 'requires bundled desktop Node raster runtime'}, async () => {
  const jpeg = await sharp({create:{width:24,height:16,channels:3,background:'#443322'}}).jpeg().toBuffer();
  const sof = jpeg.indexOf(Buffer.from([255,192])); assert.ok(sof>0); jpeg.writeUInt16BE(30000,sof+5); jpeg.writeUInt16BE(30000,sof+7);
  await assert.rejects(prepareLocalPhoto(jpeg), /80.megapixel/i);
});

test('animated raster containers are rejected even when they fit the transfer envelope', async () => {
  const webp = Buffer.alloc(30);webp.write('RIFF',0);webp.write('WEBPVP8X',8);webp[20]=2;
  await assert.rejects(prepareLocalPhoto(webp), /single still/);
  const png = Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),Buffer.alloc(12)]);png.write('acTL',12);
  await assert.rejects(prepareLocalPhoto(png), /single still/);
});
