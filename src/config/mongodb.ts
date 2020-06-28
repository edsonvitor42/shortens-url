const MONGO_DB = {
    HOST: '',
    USER: '',
    PASSWORD: '',
    DATABASE: ''
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