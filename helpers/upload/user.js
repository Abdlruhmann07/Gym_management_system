// UPLOAD FILE
const multer = require('multer');
//TODO: CREATE MULTER STORAGE
const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/users');
    },
    filename: (req, file, cb) => {
        const extention = file.mimetype.split('/')[1];
        cb(null, `user-${req.user._id}-${Date.now()}.${extention}`)
    },
});
//TODO: CREATE MULTER FILTER
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true)
    } else {
        cb('error', false)
    }
}
//TODO: CREATE UPLOAD OBJECT
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
})
//TODO: EXPORT THE UPLOAD MIDDLEWARE
exports.uploadPhoto = upload.single('photo')
exports.getUploadpage = (req, res) => {
    res.render('upload')
}
exports.Upload = (req, res) => {
    const file = req.file
    if (file) {
        console.log(file)
        console.log(req.body)
        console.log(file.filename)
    }

}