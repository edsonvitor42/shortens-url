require('dotenv').config();

import express, { json, Request, Response } from 'express';
import * as mongodb from './config/mongodb';
import mongoose from 'mongoose';
import crypto from 'crypto';
import path from 'path';

// Model's
import { UrlModel, IUrlModel } from './models/url.model';

const app = express();
app.use(json());

app.use(express.static('./index.html'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// app.get('/', (request: Request, response: Response) => {
//     response.sendFile(path.resolve(__dirname, './index.html'));
// });

app.get('/:hash', async (request: Request, response: Response) => {
    if (!request.params.hash) {
        return response.status(400).send('Nenhuma código foi informado!');
    }

    const urlFound: any = await UrlModel.findOne({
        hash: String(request.params.hash)
    })
        .select('original_url clicked')
        .lean();

    if (!urlFound) {
        return response.status(400).send('Url não existe ou foi removida!');
    }

    await UrlModel.updateOne({
        _id: urlFound._id
    }, {
        $inc: {
            clicked: 1
        }
    });

    response.redirect(String(urlFound.original_url));
});

app.post('/', async (request: Request, response: Response) => {
    const original_url = request.body.original_url || request.query.url;

    if (!original_url) {
        return response.status(400).send('Nenhuma url foi encontrada!');
    }

    const { host } = request.headers;

    const urlFound: any = await UrlModel.findOne({
        original_url: String(original_url).toLowerCase()
    })
        .select('hash')
        .lean();

    if (urlFound) {
        return response.status(200).send({
            url: `http://${host}/${urlFound.hash}`
        });
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

    const data: any = await UrlModel.create({
        original_url: String(original_url).toLowerCase(),
        hash: hash
    });

    return response.status(200).send({
        url: `http://${host}/${data.hash}`
    });
});

app.listen(process.env.NODE_PORT, async () => {
    await mongoose.connect(mongodb.srv, mongodb.options, err => {
        if (err) throw err;

        console.log(`Server running on http://localhost:${process.env.NODE_PORT}`);
    });
});