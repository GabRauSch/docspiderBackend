import { DataTypes, Model, Optional, QueryTypes } from "sequelize";
import sequelize from "../config/mysql";
import { DocumentCreation, DocumentUpdate } from "../types/DocumentType";

interface DocumentAttributes {
    id: number;
    title: string;
    description: string;
    path: string;
    mimetype: string;
}

interface DocumentCreationAttributes extends Optional<DocumentAttributes, 'id'> {}

class Document extends Model<DocumentAttributes, DocumentCreationAttributes> implements DocumentAttributes {
    public id!: number;
    public title!: string;
    public path!: string;
    public description!: string;
    public mimetype!: string;

    static async createWithFile(document: DocumentCreation): Promise<Document | null>{
        try {
            const creation = await Document.create(document);
            return creation;
        } catch (error) {
            console.error(error)
            return null
        }
    }
    static async updateDocument(data: DocumentUpdate): Promise<boolean>{
        try {
            const [rowsAffected] = await Document.update(data, { where: {id: data.id}});
            return rowsAffected > 0;
        } catch (error) {
            console.error('Error updating document:', error);
            return false;
        }
    }

    static async updateWithFile(data: any): Promise<Document | null>{
        try {
            const [rowsAffected] = await Document.update({
                title: data.title, description: data.description, path: data.path
            }, {
                where: {
                    id: data.id
                }
            });
            if(rowsAffected > 0){
                const updated = await Document.findByPk(data.id);
                return updated
            }
            return null
        } catch (error) {
            console.error(error);
            return null
        }
    }
    static async findDocuments(limit: number, offset: number): Promise<Document[] | null>{
        try {
            const rawQuery = `SELECT id, title, path, description, mimetype,
            DATE_FORMAT(createdAt, '%d/%m/%Y %H:%i') AS createdAt,
            DATE_FORMAT(updatedAt, '%d/%m/%Y %H:%i') AS updatedAt
            FROM documents LIMIT :limit OFFSET :offset`

            const data: Document[] = await sequelize.query(rawQuery, {
                replacements: {limit, offset},
                type: QueryTypes.SELECT
            })
            return data
        } catch (error) {
            console.error('Error updating document:', error);
            return null;
        }

    }
}

Document.init({
    id: {
        primaryKey: true,
        autoIncrement: true,
        type: DataTypes.INTEGER
    },
    title: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    description: {
        type: DataTypes.STRING(2000)
    },
    mimetype: {
        type: DataTypes.STRING,
        validate: {
            isValid(value: string){
                const invalid = ['zip', 'bat', 'exe'];
                if(value && invalid.includes(value))
                    throw new Error('Invalid mymetype');
            }
        }
    }
}, {
    sequelize,
    modelName: 'Document',
    tableName: 'documents',
    timestamps: true
});

export default Document;
