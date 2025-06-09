const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactionroles')
        .setDescription('Creates a reaction role message with up to 3 roles.')
        .addStringOption(option =>
            option.setName('role1')
                .setDescription('The first role ID')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('emoji1')
                .setDescription('The emoji for the first role')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('role2')
                .setDescription('The second role ID')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('emoji2')
                .setDescription('The emoji for the second role')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('role3')
                .setDescription('The third role ID')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('emoji3')
                .setDescription('The emoji for the third role')
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {
        const roleEmojis = [];

        for (let i = 1; i <= 3; i++) {
            const roleId = interaction.options.getString(`role${i}`);
            const emoji = interaction.options.getString(`emoji${i}`);
            if (roleId && emoji) {
                roleEmojis.push({ roleId, emoji });
            }
        }

        if (roleEmojis.length === 0) {
            return interaction.reply({ content: '❌ You must provide at least one role and emoji.', ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setColor('#58c4f6')
            .setTitle('📋 Reaction Roles')
            .setDescription(roleEmojis.map(r => `${r.emoji} <@&${r.roleId}>`).join('\n'))
            .setTimestamp()
            .setFooter({ text: 'React below to receive your role!' });
          
        const message = await interaction.channel.send({ embeds: [embed] });

        for (const pair of roleEmojis) {
            try {
                await message.react(pair.emoji);
            } catch (e) {
                console.error(`Failed to react with ${pair.emoji}:`, e);
            }
        }

        // Store the config
        interaction.client.reactionRoleMap.set(message.id, roleEmojis);

        await interaction.reply({ content: '✅ Reaction roles message sent!', ephemeral: true });
    }
};
