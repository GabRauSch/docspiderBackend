import { DataTypes, Model, Optional } from "sequelize";
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
