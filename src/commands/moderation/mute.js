const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require('ms'); // npm install ms

module.exports = { // imports the modules to export
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('Mutes a member temporarily by assigning them the Muted role.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to mute')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('duration')
                .setDescription('How long to mute (e.g. 5m, 1h, 2d)')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for muting')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const duration = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const guildMember = interaction.guild.members.cache.get(targetUser.id);
        const mutedRole = interaction.guild.roles.cache.get('1361115115792891945');

        if (!guildMember) return interaction.reply({ content: '❌ Member not found.', ephemeral: true });
        if (!mutedRole) return interaction.reply({ content: '❌ Muted role not found.', ephemeral: true });

        const time = ms(duration); // convert '5m', '1h' to milliseconds
        if (!time || time < 1000) return interaction.reply({ content: '❌ Invalid duration. Use formats like `5m`, `1h`, `2d`.', ephemeral: true });

        try {
            await guildMember.roles.add(mutedRole, reason);
            await interaction.reply(`🔇 ${targetUser.tag} has been muted for **${duration}**.\n**Reason:** ${reason}`);

            // Set timeout to unmute
            setTimeout(async () => {
                // Double-check they still have the role (in case it was removed manually)
                if (guildMember.roles.cache.has(mutedRole.id)) {
                    try {
                        await guildMember.roles.remove(mutedRole, 'Timed mute expired');
                        const dm = await targetUser.createDM().catch(() => null);
                        if (dm) dm.send('⏱️ You have been unmuted.');
                    } catch (err) {
                        console.error(`Failed to unmute ${targetUser.tag}:`, err);
                    }
                }
            }, time);

        } catch (err) {
            console.error(err);
            return interaction.reply({ content: '❌ Failed to mute user. Check my permissions.', ephemeral: true });
        }
    }
};
