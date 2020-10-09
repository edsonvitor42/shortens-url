const MONGO_DB = {
    HOST: process.env.MONGO_DB_HOST || '',
    USER: process.env.MONGO_DB_USER || '',
    PASSWORD: process.env.MONGO_DB_PASSWORD || '',
    DATABASE: process.env.MONGO_DB_DATABASE || ''
};

const srv = `mongodb+srv://${MONGO_DB.USER}:${MONGO_DB.PASSWORD}@${MONGO_DB.HOST}/${MONGO_DB.DATABASE}`;

const options = {
    poolSize: 5,
    keepAlive: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
};

export {
    srv,
    options
};