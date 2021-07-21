const { MessageActionRow, MessageEmbed, MessageButton } = require("discord.js");

module.exports = {

    id: `ticketCreate`,

    execute(interaction) {

        // determine if the user has a ticket open already or not
        const buttonUser = interaction.member.user;
        const usernameScrubbed = buttonUser.username.toLowerCase().replace(/[^a-z]+/g, '');
        const textChannels = interaction.member.guild.channels.cache.filter(c => c.type === `GUILD_TEXT` && c.name.includes(`ticket`)).map(c => c.name);

        if (textChannels.includes(`ticket-${usernameScrubbed}`)) {
            return interaction.reply({ content: `You already have a ticket open! Please close that ticket before opening a new one!`, ephemeral: true });
        } else {
            // reply to the interaction
            interaction.deferUpdate();
        }

        // create embed with instructions and buttons
        const ticketEmbed_main = new MessageEmbed()
            .setTitle(`Open a Ticket!`)
            .setDescription(`How can we help? Please write your request and then click the "📝 Continue" button and a moderator will be able to help you shortly. If this was a mistake, close the ticket by clicking the "🔒 Close" button.`)
            .setColor(`6aa4ad`)

        const ticketOptions = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('ticketCancel')
                    .setLabel(`Close`)
                    .setStyle('DANGER')
                    .setEmoji(`🔒`)
            )
            .addComponents(
                new MessageButton()
                    .setCustomId('ticketAccept')
                    .setLabel(`Continue`)
                    .setStyle('SUCCESS')
                    .setEmoji(`📝`)
            )

        // perform interaction actions
        interaction.member.guild.channels.create(`ticket-${usernameScrubbed}`, {
            type: 'GUILD_TEXT',
            parent: interaction.channel.parentId,
            permissionOverwrites: [
                {
                    id: interaction.channel.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: `692097359005351947`, // Supreme Overseers
                    deny: ['VIEW_CHANNEL'],
                },
                {
                    id: interaction.user.id,
                    allow: ['VIEW_CHANNEL'],
                    deny: [`SEND_MESSAGES`]
                },
            ],
        }).then(supportChannel => {
            supportChannel.send(`<@${buttonUser.id}>`).then(m => m.delete());
            supportChannel.send({ embeds: [ticketEmbed_main], components: [ticketOptions] });
        })

    },
};