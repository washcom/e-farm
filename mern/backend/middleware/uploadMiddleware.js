import multer from "multer";
import path from "path";

//set Storage Engine

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cd(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cd(null, `${Date.now()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowdFileTypes = /jpeg|jpg|png/;
    const extname = allowdFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowdFileTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    }
    else {
        cb(new Error("Only JPEG, JPG, OR PNG files are allowed!"), false);
    }
}
//Multer Upload Config
const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },//10mb
    fileFilter: fileFilter,
});

export default upload;