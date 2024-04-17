import express, { ErrorRequestHandler, Request, Response } from 'express';
import { limiter } from './config/Limiter'
import path from 'path'
import { MulterError } from 'multer';
import PatternResponses from './utils/PatternResponses';
import DocumentModel from './models/Documents';
import Document from './routes/documents';
import { errorHandler } from './config/errorHandler';
import cors from 'cors';

if(process.env.ENV == 'HOMOLOG'){
    DocumentModel.sync()
}

const app = express();

app.use(cors())
app.use(express.static(path.join(__dirname, '../public')))
app.use(limiter);
app.use(express.json())

app.use('/document', Document)
app.use((req: Request, res: Response)=>{
    res.status(404)
    return PatternResponses.error.notFound(res, 'route')
})

app.use(errorHandler)

export default app
