const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = { // don't change
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmutes a member by removing the Muted role and sends them a DM.')
        .addUserOption(option =>
            option.setName('target')
                .setDescription('The user to unmute')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
                .setDescription('Reason for unmuting')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),

    async execute(interaction) {
        const targetUser = interaction.options.getUser('target');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const guildMember = interaction.guild.members.cache.get(targetUser.id);
        const mutedRole = interaction.guild.roles.cache.get('1361115115792891945');

        if (!guildMember) {
            return interaction.reply({ content: '❌ Member not found in this server.', ephemeral: true });
        }

        if (!mutedRole) {
            return interaction.reply({ content: '❌ Muted role not found. Check the role ID.', ephemeral: true });
        }

        if (!guildMember.roles.cache.has(mutedRole.id)) {
            return interaction.reply({ content: '🔔 This user is not muted.', ephemeral: true });
        }

        try {
            await guildMember.roles.remove(mutedRole, reason);
            await interaction.reply(`🔔 ${targetUser.tag} has been unmuted.\n**Reason:** ${reason}`);

            // Try to DM the user
            const dm = await targetUser.createDM().catch(() => null);
            if (dm) {
                await dm.send(`🔔 You have been **unmuted** in **${interaction.guild.name}**.\n**Reason:** ${reason}`);
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: '❌ Failed to unmute the user. Check my role permissions.', ephemeral: true });
        }
    }
};
