const path = require('path');
const multer = require('multer');

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    let fileName = file.originalname.replace(/\s+/g, ''); // Remove spaces from the file name
    cb(null, fileName);
  },
});

var upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpeg'
    ) {
      callback(null, true);
    } else {
      console.log('Invalid Format');
      callback(null, false);
    }
  },
});

module.exports = upload;
