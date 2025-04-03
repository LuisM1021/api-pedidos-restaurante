const boom = require('@hapi/boom');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if(path.extname(file.originalname).toLowerCase() !== '.svg'){
        return cb(boom.unsupportedMediaType('Solo se permiten archivos SVG'), false);
    }
    cb(null, true);
}

const uploadImage = multer({ storage, fileFilter });

module.exports = uploadImage;