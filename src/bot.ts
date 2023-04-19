import dotenv from 'dotenv';

import { REST, Routes, Client, GatewayIntentBits, ActivityType, ChannelType } from "discord.js";

dotenv.config();

const { ID, TOKEN } = process.env;

class Bot {
    readonly applicationId: string;
    readonly applicationToken: string;
    rest: REST;
    client: Client;

    constructor() {
        this.applicationId = ID;
        this.applicationToken = TOKEN;

        this.rest = new REST({ version: '10' }).setToken(this.applicationToken);

        this.client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages] });
    }

    async registerCommands() {
        const commands = [
            {
                name: 'ping',
                description: 'Replies with Pong!'
            }
        ];
        
        try {
            console.log('Started refreshing application (/) commands.');
        
            await this.rest.put(Routes.applicationCommands(this.applicationId), { body: commands });
        
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
            if (!interaction.isChatInputCommand()) return;
          
            if (interaction.commandName === 'ping') {
                await interaction.reply('Pong!');
            }
        });
          
        this.client.login(TOKEN);
    }
}

export default Bot;