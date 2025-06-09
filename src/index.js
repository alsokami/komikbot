const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User]
});

client.commands = new Collection();
require('dotenv').config();

const fs = require('fs');
const functions = fs.readdirSync('./src/functions').filter(file => file.endsWith('.js'));
const commandFolders = fs.readdirSync('./src/commands');

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleCommands(commandFolders, './src/commands');
    client.login(process.env.token);
})();

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error while executing this command! Please contact @alsokami if it occurs again.',
            ephemeral: true
        });
    }
});


client.reactionRoleMap = new Map();
client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;

    const data = client.reactionRoleMap.get(reaction.message.id);
    if (!data) return;

    const member = await reaction.message.guild.members.fetch(user.id).catch(() => null);
    if (!member) return;

    const match = data.find(d => d.emoji === reaction.emoji.name);
    if (match) {
        await member.roles.add(match.roleId).catch(console.error);
    }
});

client.on('messageReactionRemove', async (reaction, user) => {
    if (reaction.partial) await reaction.fetch();
    if (user.bot) return;

    const data = client.reactionRoleMap.get(reaction.message.id);
    if (!data) return;

    const member = await reaction.message.guild.members.fetch(user.id).catch(() => null);
    if (!member) return;

    const match = data.find(d => d.emoji === reaction.emoji.name);
    if (match) {
        await member.roles.remove(match.roleId).catch(console.error);
    }
});
