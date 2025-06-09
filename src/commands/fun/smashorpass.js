const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('smashorpass')
        .setDescription('Smash? Pass? RAW???')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Who or what are we judging?')
                .setRequired(true)),

    async execute(interaction) {
        const name = interaction.options.getString('name');

        const responses = [
            '💥 **Smash.**',
            '❌ **Pass.**',
            '🔥 **RAW.**',
            '🚫 **What the fuck, no.**'
        ];

        const result = responses[Math.floor(Math.random() * responses.length)];

        await interaction.reply(`> ${name}?\n${result}`);
    }
};
