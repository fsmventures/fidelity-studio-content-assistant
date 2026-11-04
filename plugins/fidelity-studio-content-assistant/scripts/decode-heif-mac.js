/* Apple JavaScript for Automation. Only stdin and stdout carry image bytes. */
ObjC.import('Foundation');
ObjC.import('ImageIO');
function run() {
  const bytes = $.NSFileHandle.fileHandleWithStandardInput.readDataToEndOfFile;
  if (bytes.length > 50 * 1024 * 1024) throw Error('Source exceeds limit');
  const source = $.CGImageSourceCreateWithData(bytes, null);
  if (!source || Number($.CGImageSourceGetCount(source)) !== 1) throw Error('Expected a single still image');
  const props = ObjC.deepUnwrap(ObjC.castRefToObject($.CGImageSourceCopyPropertiesAtIndex(source, 0, null)));
  if (!(props.PixelWidth > 0 && props.PixelHeight > 0 && props.PixelWidth * props.PixelHeight <= 80000000)) throw Error('Invalid source dimensions');
  const options = $({ kCGImageSourceCreateThumbnailFromImageAlways: true, kCGImageSourceCreateThumbnailWithTransform: true, kCGImageSourceThumbnailMaxPixelSize: Math.min(2560, Math.max(props.PixelWidth, props.PixelHeight)) });
  const thumbnail = $.CGImageSourceCreateThumbnailAtIndex(source, 0, options);
  const result = $.NSMutableData.data;
  const output = $.CGImageDestinationCreateWithData(result, $('public.png'), 1, null);
  $.CGImageDestinationAddImage(output, thumbnail, null);
  if (!$.CGImageDestinationFinalize(output)) throw Error('Cannot encode image');
  $.NSFileHandle.fileHandleWithStandardOutput.writeData(result);
}
