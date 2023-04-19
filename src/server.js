require('dotenv').config();

const { Application, MongooseProvider } = require('discord-linked-roles');
const crypto = require('crypto');
const express = require('express');
const cookieParser = require('cookie-parser');
const { ID, SECRET, REDIRECT_URI, TOKEN, MONGO_URI } = process.env;

const application = new Application({
    id: ID,
    token: TOKEN,
    clientSecret: SECRET,
    redirectUri: REDIRECT_URI,
    scopes: ['identify', 'role_connections.write'],
    databaseProvider: new MongooseProvider(MONGO_URI),
});

const app = express();

app.use(cookieParser(crypto.randomUUID()));
app.get('/linked-roles', application.authorization.setCookieAndRedirect.bind(application.authorization));
app.get('/auth-callback', async (req, res) => {
    try {
        // Verifies if the cookie equals the one given on the /linked-role route
        const code = application.authorization.checkCookieAndReturnCode(req, res);
        // Invalid Cookie
        console.log(code);
        if (!code) return res.sendStatus(403);


        // Gets the user and stores the tokens
        const data = await application.authorization.getUserAndStoreToken(code);

        if(!application.authorization.checkRequiredScopesPresent(data.scopes)) return res.redirect('/linked-roles');
        const user = data.user;
        let token = await application.authorization.getAccessToken(user.id);
        console.log(user, token);

        // const advancedUser = await application.fetchUser(user.id); , User with email, verified ...
        
        // Set Application MetaData
        await application.setUserMetaData(user.id, user.username, { level: 24, xp: 523 })
        // setMetaData(token, user.username, { level: 24, xp: 523 })
        res.send("Successfully linked your account!")
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
})

app.get('/update/:userId', async (req, res) => {
    let { userId } = req.params;

    if (!userId) return res.status(401).json({});

    const user = await application.fetchUser(userId);
    application.setUserMetaData(user.id, user.username ,{ level: Number((Math.random()*24).toFixed(0)), xp: Number((Math.random()*523).toFixed(0)) })

    res.status(200).json({
        message: 'yes'
    })
});

app.get('/u/:userId', async (req, res) => {
    let { userId } = req.params;

    if (!userId) return res.status(401).json({});

    const user = await application.fetchUser(userId);
    const metadata = await application.getUserMetaData(userId);
    
    res.status(200).json({
        user,
        metadata
    })
});

let port = 5745
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});