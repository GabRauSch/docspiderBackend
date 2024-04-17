import { ErrorRequestHandler } from "express";
import { MulterError } from "multer";

export const errorHandler: ErrorRequestHandler = (err, req, res, next)=>{
    res.status(400);

    if(err instanceof MulterError){
        return res.json({error: err.code})
    }
    return res.json(err)
}