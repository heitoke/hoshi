import { UserContextMenuCommandInteraction, Client, EmbedBuilder } from 'discord.js';
import { UserContextMenuCommand } from '../types/Command';

class Command extends UserContextMenuCommand {
    constructor() {
        super({
            name: 'User Information'
        });
    }

    async execute(integration: UserContextMenuCommandInteraction, client: Client) {
        let user = integration.targetUser,
            embed = new EmbedBuilder()
            .setAuthor({ iconURL: user.displayAvatarURL() || user.defaultAvatarURL, name: user.tag })
            .addFields([
                { name: 'Bot', value: `\` ${user.bot ? 'Yes' : 'No'} \`` }
            ])
            .setColor(user.accentColor || '#2b2d31')
            .setThumbnail(user.bannerURL() || user.displayAvatarURL() || user.defaultAvatarURL)
            .setTimestamp()

        integration.reply({ embeds: [embed], ephemeral: true });
    }
}

export default new Command();