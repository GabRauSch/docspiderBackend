import { Request, Response } from "express";
import Document from "../models/Documents";
import { documentCreation, documentCreationContent, documentUpdate, documentUpdateFile } from "../validation/document";
import PatternResponses from "../utils/PatternResponses";
import { DocumentCreation } from "../types/DocumentType";
import fs from 'fs'

export class DocumentsController {
    static async listAll(req: Request, res: Response){
        const {limit, offset} = req.query;

        let parsedLimit, parsedOffset;
        if(!limit || !offset){
            parsedLimit = 10,
            parsedOffset = 0
        } else{
            parsedLimit = parseInt(limit as string);
            parsedOffset = parseInt(offset as string);
        }

        const documents = await Document.findDocuments(parsedLimit, parsedOffset);

        if(!documents) return PatternResponses.error.noRegister(res)

        return res.json(documents);
    }

    static async byId(req: Request, res: Response){
        const {id} = req.params
        const document = await Document.findByPk(id);

        if(!document) throw new Error(`No valid document with id ${id}`);

        return res.json(document);
    } 

    static async createWithFile(req: Request, res: Response){
        const data = req.body;
        const file = req.file;

        if(!file) return PatternResponses.error.notCreated(res, 'No file uploaded')

        const {error} = documentCreation.validate(data);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const type = file.mimetype.split('/')[0]
        const creationData: DocumentCreation = {
            title: data.title,
            description: data.description,
            path: file.filename,
            mimetype: type 
        }
        const newFile = await Document.createWithFile(creationData);
        if(!newFile) {
            fs.unlinkSync(`./public/documents/${type}/${file.filename}`)
            return PatternResponses.error.notCreated(res, 'document');
        }

        return res.json(newFile);
    }

    static async updateWithFile(req: Request, res: Response){
        const data = req.body;
        const file = req.file;

        if(!file) return PatternResponses.error.notCreated(res, 'No file uploaded')

        const {error} = documentUpdateFile.validate(data);
        if (error) return res.status(400).json({ error: error.details[0].message });

        const type = file.mimetype.split('/')[0]
        const updateData = {
            id: data.id,
            title: data.title,
            description: data.description,
            originalPath: data.originalPath,
            path: file.filename,
            mimetype: type 
        }

        const updatedFile = await Document.updateWithFile(updateData);
        if(!updatedFile){
            fs.unlinkSync(`./public/documents/${type}/${file.filename}`)
            return PatternResponses.error.notCreated(res, 'document');
        }
        fs.unlinkSync(`./public/documents/${type}/${data.originalPath}`)
        return res.json(updateData);
    }

    static async createWithContent(req: Request, res: Response){
        const data = req.body;

        const {error} = documentCreationContent.validate(data);
        if (error) return res.status(400).json({ error: error.details[0].message });
    }

    static async update(req: Request, res: Response){
        const data = req.body;

        const {error} = documentUpdate.validate(data);
        if (error) return res.status(400).json({ error: error.details[0].message });
    
        const update = await Document.updateDocument(data);
        if(!update) return PatternResponses.error.notUpdated(res);

        return PatternResponses.success.updated(res)
    }

    static async delete(req: Request, res: Response){
        const {id} = req.params;
        console.log(id)

        if(!id) return 

        const document = await Document.findByPk(id);
        if(!document) return PatternResponses.error.noRegister(res)

        fs.unlinkSync(`./public/documents/${document.mimetype}/${document.path}`)
        await document.destroy();

        return PatternResponses.success.deleted(res)
    }
}