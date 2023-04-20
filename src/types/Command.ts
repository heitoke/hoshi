import {
    Client,
    SlashCommandBuilder,
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    type ChatInputCommandInteraction,
    type UserContextMenuCommandInteraction,
    type MessageContextMenuCommandInteraction
} from 'discord.js';

interface IChatCommand {
    name: string;
    description: string;
    NSFW?: boolean;
}

interface IContextMenuCommand {
    name: string;
}

export class ChatCommand {
    data: SlashCommandBuilder;

    constructor(commandOptions: IChatCommand) {
        this.data = new SlashCommandBuilder()
            .setName(commandOptions.name)
            .setDescription(commandOptions.description)
            .setNSFW(commandOptions.NSFW || false);
    }

    async execute(integration: ChatInputCommandInteraction, client: Client): Promise<any> {
        return;
    }
}

export class UserContextMenuCommand {
    data: ContextMenuCommandBuilder;

    constructor(commandOptions: IContextMenuCommand) {
        this.data = new ContextMenuCommandBuilder()
            .setName(commandOptions.name)
            .setType(ApplicationCommandType.User);
    }

    async execute(integration: UserContextMenuCommandInteraction, client: Client) : Promise<any> {
        return;
    }
}

export class MessageContextMenuCommand {
    data: ContextMenuCommandBuilder;

    constructor(commandOptions: IContextMenuCommand) {
        this.data = new ContextMenuCommandBuilder()
            .setName(commandOptions.name)
            .setType(ApplicationCommandType.Message);
    }

    async execute(integration: MessageContextMenuCommandInteraction, client: Client) : Promise<any> {
        return;
    }
}