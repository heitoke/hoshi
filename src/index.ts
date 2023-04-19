import dotenv from 'dotenv';

import express, { Request } from 'express';

import cors from 'cors';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';

import application, { register } from './libs/app';

// * Discord Bot
import Bot from './bot';

// * Routes
import userRoute from './routes/users'; 

dotenv.config();

register();

const
    app = express(),
    bot = new Bot();

bot.start();

app.set('trust proxy', true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser(crypto.randomUUID()));

app.use(cors({
    origin: '*',
    allowedHeaders: 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With',
    methods: 'GET, POST, PUT, PATCH, DELETE'
}));

app.get('/linked-roles', application.authorization.setCookieAndRedirect.bind(application.authorization));

app.get('/auth-callback', async (req, res) => {
    try {
        let code = application.authorization.checkCookieAndReturnCode(req, res);

        if (!code) return res.status(403).json({ code: 403 });

        let data = await application.authorization.getUserAndStoreToken(code);

        if (!application.authorization.checkRequiredScopesPresent(data.scopes)) return res.redirect('/linked-roles');

        let user = data.user,
            level = Number((Math.random() * Date.now()).toFixed(2).split('.')[1]);

        application.setUserMetaData(user.id, user.username ,{
            level: String(level),
            xp: String(level * ((level * 12) * 24))
        });

        res.status(200).json({ message: 'Successfully linked your account!', code: 200 });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Server error', code: 500 });
    }
});

app.use('/users', userRoute);

let port = process.env.PORT || 5745,
    server = app.listen(port, () => {
    console.log(`Server started http://localhost:${port}`);
});

export default server;