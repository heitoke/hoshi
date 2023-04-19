require('dotenv').config();

const { Application, MongooseProvider, MetaDataTypes } = require('discord-linked-roles');
const { ID, SECRET, REDIRECT_URI, TOKEN, MONGO_URI } = process.env;

const application = new Application({
    id: ID,
    token: TOKEN,
    clientSecret: SECRET,
    redirectUri: REDIRECT_URI,
    scopes: ['identify'],
    databaseProvider: new MongooseProvider(MONGO_URI),
});
// Following value types exists: Boolean, Date, Integer
application.registerMetaData([
    {
        key: 'level',
        name: 'Level',
        description: 'The level of the user',
        type: MetaDataTypes.INTEGER_GREATER_THAN_OR_EQUAL
    },
    {
        key: 'xp',
        name: 'Total XP',
        description: 'The total xp of the user',
        type: MetaDataTypes.INTEGER_GREATER_THAN_OR_EQUAL
    }
]);