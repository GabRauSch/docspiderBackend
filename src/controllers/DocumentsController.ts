import { Request, Response } from "express";
import Document from "../models/Documents";
import { documentCreation, documentCreationContent, documentUpdate } from "../validation/document";
import PatternResponses from "../utils/PatternResponses";
import { DocumentCreation } from "../types/DocumentType";
import fs from 'fs'

export class DocumentsController {
    static async listAll(req: Request, res: Response){
        const {limit, offset} = req.query;

        const documents = await Document.findAll({
            limit: parseInt(limit as string), offset: parseInt(offset as string)
        });

        if(!documents) throw new Error(`Couldn't make the search for documents`)

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

        if(!file) throw new Error('No file uploaded')

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

        return PatternResponses.success.created(res);
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
        const id = req.params;

        const deleteDocument = await Document.destroy({where:id});

        if(!deleteDocument) return PatternResponses.error.notDeleted(res);

        return PatternResponses.success.deleted(res)
    }
}