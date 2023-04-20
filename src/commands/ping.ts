import type { ChatInputCommandInteraction, Client } from 'discord.js';
import { ChatCommand } from '../types/Command';

class Command extends ChatCommand {
    constructor() {
        super({
            name: 'ping',
            description: 'Replies with Pong!'
        });
    }

    async execute(integration: ChatInputCommandInteraction, client: Client) {
        integration.reply('Pong!');
    }
}

export default new Command();