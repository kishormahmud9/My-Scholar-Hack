import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath = "uploads/essays/";

        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    // DEBUG LOG
    console.log("Multer Filtering file:", {
        fieldname: file.fieldname,
        originalname: file.originalname,
        mimetype: file.mimetype
    });

    const allowedTypes = [
        "audio/mpeg",
        "audio/wav",
        "audio/ogg",
        "audio/mp3",
        "audio/x-mpeg",
        "audio/mpeg3",
        "audio/x-m4a",
        "audio/mp4",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "image/webp",
        "application/octet-stream",
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        console.error("REJECTED FILE TYPE:", file.mimetype);
        cb(new Error(`Invalid file type: ${file.mimetype}. Only audio, PDF, and images are allowed.`), false);
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
});
