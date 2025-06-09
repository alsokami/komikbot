const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('rateperson')
        .setDescription('Rates a person based on humour, smartness, and looks.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to rate')
                .setRequired(false)
        ),

    async execute(interaction) {
        const user = interaction.options.getUser('target') || interaction.user;

        if (user.username.toLowerCase() === 'alsokami') { // if it's me gang lmfao
            const embed = new EmbedBuilder()
                .setTitle('OMG ITS KOMIK!!!1')
                .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setColor('#ff94e6')
                .addFields(
                    { name: '😂 FUNNY GUY', value: '100/100', inline: true },
                    { name: '🧠 SMART MF', value: '100/100', inline: true },
                    { name: '😎 DAMN HE FINE', value: '100/100', inline: true },
                )
                .setFooter({ text: 'KOMIK MY GOAT (subway is too)', iconURL: interaction.client.user.displayAvatarURL() })
                .setTimestamp();

            return await interaction.reply({ embeds: [embed] });
        }

        // 🔄 Otherwise: run the normal random version
        const humour = Math.floor(Math.random() * 101);
        const smartness = Math.floor(Math.random() * 101);
        const looks = Math.floor(Math.random() * 101);

        const embed = new EmbedBuilder()
            .setTitle(`📊 ${user.username} rating`)
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor('#ff94e6')
            .addFields(
                { name: '😂 Humour', value: `${humour}/100`, inline: true },
                { name: '🧠 Not Dumbness', value: `${smartness}/100`, inline: true },
                { name: '😎 Looks', value: `${looks}/100`, inline: true },
            )
            .setFooter({ text: 'komikbot your beloved', iconURL: interaction.client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
