const { MessageActionRow, MessageSelectMenu, MessageEmbed } = require("discord.js");

module.exports = {

    name: `test`,
    aliases: [`t`],
    description: `test`,
    usage: `message`,
    requiredPermissions: ``,
    developerOnly: true,

    execute(message, args) {
        // fixed width spaces https://jkorpela.fi/chars/spaces.html

        a = `001`;
        const yearEmbed = new MessageEmbed()
            .setTitle(`🎓  |  Year Selection`)
            .setDescription(`⬇️ Please select your year using the menu below! ⬇️`)
            .setFields( 
                { name: `\u200B`, value: `__Undergraduate Roles__\n\` ${a} \` 🥚 - Incoming/Prospective\n\` ${a} \` 👶 - Freshman\n\` ${a} \` 💪 - Sophomore\n\` ${a} \` 🧠 - Junior\n\` ${a} \` 👑 - Senior/Senior+` },
                { name: `\u200B`, value: `__Graduated/Graduate Program Roles__\n\` ${a} \` 🎓 - Graduated\n\` ${a} \` 📝 - Masters Program\n\` ${a} \` 🥼 - Graduate Program` },
                { name: `\u200B`, value: `Please select your __year__, **not your classification**!\n*(i.e. if you are a 1st year but have 60 credits, still select freshman)*` },
            )

        const majorEmbed = new MessageEmbed()
            .setTitle(`🎓  |  Major Selection`)

        const yearRow1 = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('undergrad')
                    .setPlaceholder('Undergraduate Roles')
                    .addOptions([
                        {
                            label: '🥚 - Incoming/Prospective',
                            description: 'Incoming/Prospective Student Role',
                            value: 'incoming_prospective',
                        },
                        {
                            label: '👶 - Freshman',
                            description: 'Undergraduate Student Role',
                            value: 'freshman',
                        },
                        {
                            label: '💪 - Sophomore',
                            description: 'Undergraduate Student Role',
                            value: 'sophomore',
                        },
                        {
                            label: '🧠 - Junior',
                            description: 'Undergraduate Student Role',
                            value: 'junior',
                        },
                        {
                            label: '👑 - Senior/Senior+',
                            description: 'Undergraduate Student Role',
                            value: 'senior',
                        }
                    ])
            )
        const yearRow2 = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('grad-postgrad')
                    .setPlaceholder('Graduated/Graduate Program Roles')
                    .addOptions([
                        {
                            label: '🎓 - Graduated',
                            description: 'Graduated/Graduate Student Role',
                            value: 'graduated',
                        },
                        {
                            label: '📝 - Masters Program',
                            description: 'Graduated/Graduate Student Role',
                            value: 'masters',
                        },
                        {
                            label: '🥼 - Graduate Program',
                            description: 'Graduated/Graduate Student Role',
                            value: 'grad',
                        },
                    ]),
            )


        const majorRow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId('select1')
                    .setPlaceholder('Nothing selected')
                    .addOptions([
                        {
                            label: 'Select me',
                            description: 'This is a description',
                            value: 'first_option',
                        },
                        {
                            label: 'You can select me too',
                            description: 'This is also a description',
                            value: 'second_option',
                        },
                    ]),
            )

        message.channel.send({ embeds: [yearEmbed], components: [yearRow1, yearRow2] });
        message.channel.send({ embeds: [majorEmbed], components: [majorRow] });
    },
};