import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("📂 Multer Destination reached for:", file.fieldname);
        const uploadPath = path.join(process.cwd(), "uploads", "essays");
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        console.log("📄 Multer Filename reached for:", file.originalname);
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    console.log("🔍 Multer Filtering file:", {
        fieldname: file.fieldname,
        originalname: file.originalname,
        mimetype: file.mimetype
    });

    // Allow everything temporarily for debugging
    cb(null, true);
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});


