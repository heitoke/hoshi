import dotenv from 'dotenv';

import {
    REST,
    Routes,
    Client,
    ActivityType,
    ChannelType,
    Collection,
    GatewayIntentBits
} from "discord.js";

import {
    ChatCommand,
    UserContextMenuCommand,
    MessageContextMenuCommand
} from './types/Command';

import { readdirSync } from 'fs';
import path from 'path';

dotenv.config();

const { ID, TOKEN } = process.env;

class Bot {
    readonly applicationId: string;
    readonly applicationToken: string;
    rest: REST;
    client: Client;
    commands: Collection<string, ChatCommand>;
    userContexts: Collection<string, UserContextMenuCommand>;
    messageContexts: Collection<string, MessageContextMenuCommand>;

    constructor() {
        this.applicationId = ID;
        this.applicationToken = TOKEN;

        this.rest = new REST({ version: '10' }).setToken(this.applicationToken);

        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildPresences,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildIntegrations,
                GatewayIntentBits.GuildMessageReactions,
                GatewayIntentBits.MessageContent
            ]
        });

        this.commands = new Collection();
        this.userContexts = new Collection();
        this.messageContexts = new Collection();
    }

    async registerFolderCommands(folderPath: string = 'commands') {
        let folder = path.join(__dirname, folderPath),
            files = readdirSync(folder),
            listCommands: any[] = [];

        try {
            for (let file of files) {
                let command = (await import(path.join(folder, file))).default;

                if (command instanceof ChatCommand) {
                    this.commands.set(command.data.name, command);
                } else if (command instanceof UserContextMenuCommand) {
                    this.userContexts.set(command.data.name, command);
                } else if (command instanceof MessageContextMenuCommand) {
                    this.messageContexts.set(command.data.name, command);
                }
                
                listCommands = [...listCommands || [], command.data.toJSON()];
            }

            return listCommands;
        } catch (err) {
            console.log(err);

            return [];
        }
    }

    async registerCommands() {
        try {
            console.log('Started refreshing application (/) commands.');

            await this.rest.put(Routes.applicationCommands(this.applicationId), {
                body: [
                    ...await this.registerFolderCommands(),
                    ...await this.registerFolderCommands('contexts')
                ]
            });
        
            console.log('Successfully reloaded application (/) commands.');
        } catch (err) {
            console.error(err);
        }
    }

    start() {
        this.registerCommands();

        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user.tag}!`);

            this.client.user.setPresence({
                activities: [{
                    name: `${Math.floor(Math.random() * 999) - 0}`,
                    type: ActivityType.Watching
                }],
                status: 'dnd'
            });
        });

        this.client.on('messageCreate', msg => {
            if (msg.channel.type === ChannelType.DM) return;

            let args = msg.content.split(' ');
            
            if (args[0] === '.send') {
                msg.reply(`<@${msg.author.id}>: ${args.slice(1).join(' ')}`);
            }
        })

        this.client.on('interactionCreate', async interaction => {
            try {
                if (interaction.isChatInputCommand()) {
                    let command = this.commands.get(interaction.commandName);

                    await command.execute(interaction, this.client);
                } else if (interaction.isUserContextMenuCommand()) {
                    let context = this.userContexts.get(interaction.commandName);

                    await context.execute(interaction, this.client);
                } else if (interaction.isMessageContextMenuCommand()) {
                    let context = this.messageContexts.get(interaction.commandName);

                    await context.execute(interaction, this.client);
                }
            } catch (err) {
                console.log(err);
                
            }
        });
          
        this.client.login(TOKEN);
    }
}

export default Bot;