import sharp from "sharp";
import path from "path";


export const resizeImageMiddleware = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const fileExt = req.file.mimetype.split("/")[1];
    const outputPath = `uploads/resized-${Date.now()}.${fileExt}`;

    await sharp(req.file.buffer) 
      .resize(Number(req.body.width) || 300, Number(req.body.height) || 300) 
      .toFile(outputPath);

    req.file.path = outputPath;
    req.file.filename = path.basename(outputPath);

    next();
  } catch (err) {
    next(err);
  }
};

