import type { ChatInputCommandInteraction, Client } from 'discord.js';
import { ChatCommand } from '../types/Command';

import application, { levelUp } from '../libs/app';

class Command extends ChatCommand {
    constructor() {
        super({
            name: 'level',
            description: 'Write a command and get some XP :D'
        });
    }

    async execute(integration: ChatInputCommandInteraction, client: Client) {
        let user = await application.fetchUser(integration.user.id);

        if (!user) return integration.reply({ content: `You are not in the database. Please log in to the app.`, ephemeral: true });

        levelUp(user.id, user.username);

        integration.reply({ content: `You got some XP ^_^`, ephemeral: true });
    }
}

export default new Command();