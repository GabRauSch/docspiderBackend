import multer from 'multer';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path'

const storage = multer.diskStorage({
    destination: (req, file, callback)=>{
        let destinationFolder = 'public/documents';
        const mimeType = file.mimetype.split('/')[0];
        
        destinationFolder += `/${mimeType}`;

        fs.mkdirSync(destinationFolder, { recursive: true });
        callback(null, destinationFolder);
    },
    filename: (req, file, callback)=>{
        const randomString = crypto.randomBytes(20).toString('hex');
        const originalExtension = path.extname(file.originalname);
        const newFilename = randomString + originalExtension

        callback(null, newFilename)
    }
});
export const upload = multer({
    limits: {fieldSize: 20000000},
    storage
})
