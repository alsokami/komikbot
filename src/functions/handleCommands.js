const { REST }  = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const fs = require('fs');

const clientId = process.env.client_id;
const token = process.env.token;
const guildId = '';

module.exports = (client) => {
    client.handleCommands = async (commandFolders, path) => {
        client.commandArray = [];

        for (const folder of commandFolders) {
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));

            for (const file of commandFiles) {
                const filePath = `../commands/${folder}/${file}`;
                const command = require(filePath);

                if (!command || !command.data || !command.data.name) {
                    console.warn(`[WARN] Command "${filePath}" is missing "data" or "data.name". Skipping.`);
                    continue;
                }

                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
            }
        }

        const rest = new REST({ version: '10' }).setToken(token);

        try {
            console.log('Started refreshing application (/) commands.');
            await rest.put(
                Routes.applicationCommands(clientId),
                { body: client.commandArray },
            );
            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    };
};