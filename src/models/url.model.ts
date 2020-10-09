import { Schema, model, Document } from 'mongoose';

export interface IUrlModel {
    _id?: Schema.Types.ObjectId,
    original_url?: String,
    hash?: String,
    clicked: Number,
};

const UrlSchema = new Schema({
    original_url: String, // Link original a ser encurtado.
    hash: String, // Código utilizado para pesquisar o link.
    clicked: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        // expires: 604800,
        default: Date.now
    } // O documento irá ser deletado em 604800 segundos. 
});

const UrlModel = model('Url', UrlSchema);

export { UrlModel };