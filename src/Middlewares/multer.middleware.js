import multer from "multer";

const localStorage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, "./public/temp/");
    },

    filename: function (req, file, cb) {
        // to uniquely quote name
            // const uniqueSuffix = Date.now()+Math.round(Math.random() * 1E9); 
            // cb(null, file.fieldname + '_'+uniqueSuffix);

        // to name according uploaders' computer file name. 
        cb(null, file.originalname);
    },
});

export const multerUpload = multer({storage: localStorage});