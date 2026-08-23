const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createStorage = (folderName) => {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      const dir = path.join(__dirname, `../uploads/${folderName}`);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
  });
};

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|webp/;
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedExtensions.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG, and WEBP image formats are supported'));
  }
};

const uploadOriginal = multer({
  storage: createStorage('original'),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter,
});

const uploadRepairs = multer({
  storage: createStorage('repairs'),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: fileFilter,
});

module.exports = {
  uploadOriginal,
  uploadRepairs,
};
