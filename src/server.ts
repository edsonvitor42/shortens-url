import express, { json, Request, Response } from 'express';
import * as mongodb from './config/mongodb';
import mongoose from 'mongoose';
import crypto from 'crypto';

// Model's
import { UrlModel, IUrlModel } from './models/url.model';

const app = express();
app.use(json());

app.get('/:hash', async (request: Request, response: Response) => {
    if (!request.params.hash) {
        return response.status(400).send('Nenhuma código foi informado!');
    }

    const urlFound = await <IUrlModel>UrlModel.findOne({ 
        hash: String(request.params.hash) 
    })
        .select('original_url')
        .lean();

    if (!urlFound) {
        return response.status(400).send('Url não existe ou foi removida!');
    }

    response.redirect(String(urlFound.original_url));
});

app.post('/', async (request: Request, response: Response) => {
    if (!request.body.original_url) {
        return response.status(400).send('Nenhuma url foi encontrada!');
    }

    const { host } = request.headers;

    const urlFound = await <IUrlModel>UrlModel.findOne({
        original_url: String(request.body.original_url).toLowerCase()
    })
        .select('hash')
        .lean();

    if (urlFound) {
        return response.status(200).send(`http://${host}/${urlFound.hash}`);
    }

    let hash;
    do {
        const hashToBeVerified = crypto.randomBytes(6).toString('hex');

        const hashSignIsAlreadyInUse = await UrlModel.findOne({
            hash: String(hashToBeVerified)
        })
            .select('_id')
            .lean();
        
        if (!hashSignIsAlreadyInUse) {
            hash = hashToBeVerified;
        }
    } while (!hash)

    const data = await <IUrlModel>UrlModel.create({
        original_url: String(request.body.original_url).toLowerCase(),
        hash: hash
    });

    return response.status(200).send(`http://${host}/${data.hash}`);
});

app.listen(3000, async () => {
    await mongoose.connect(mongodb.srv, mongodb.options, err => {
        if (err) throw err;

        console.log('Servidor rodando em http://localhost:3000');
    });
});