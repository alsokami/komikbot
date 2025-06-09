const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Checks your ping.'),
    async execute(interaction) {
        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
        
        const roundTrip = sent.createdTimestamp - interaction.createdTimestamp;
        const wsPing = interaction.client.ws.ping;

        await interaction.editReply(`🏓 **Pong!**\nRoundtrip latency: \`${roundTrip}ms\`\nWebSocket heartbeat: \`${wsPing}ms\``);
    }
}
