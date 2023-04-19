import { Application, MongooseProvider, MetaDataTypes, MapProvider } from 'discord-linked-roles';

import dotenv from 'dotenv';

dotenv.config();

const { ID, SECRET, REDIRECT_URI, TOKEN, MONGO_URI } = process.env;

export type DataBaseProvider = {
    findAll(): Promise<{tokens: OAuthTokens, id: string}>;
    // Gets the token for the user
    fetchUser: (userId: string) => Promise<OAuthTokens | undefined>;
    createOrUpdate: (userId: string, token: OAuthTokens) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
}

export interface OAuthTokens {
    access_token: string;
    refresh_token: string;
    expires_at: number;
}

const application = new Application({
    id: ID,
    token: TOKEN,
    clientSecret: SECRET,
    redirectUri: REDIRECT_URI,
    scopes: ['identify', 'role_connections.write'],
    databaseProvider: (MONGO_URI ? new MongooseProvider(MONGO_URI) : new MapProvider()) as any
});

export function register() {
    application.registerMetaData([
        {
            key: 'level',
            name: 'Level',
            description: 'The level of the user',
            type: MetaDataTypes.INTEGER_GREATER_THAN_OR_EQUAL as any
        },
        {
            key: 'xp',
            name: 'Total XP',
            description: 'The total xp of the user',
            type: MetaDataTypes.INTEGER_GREATER_THAN_OR_EQUAL as any
        }
    ]);
}

export default application;