const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Ask the magic 8ball a question.')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('Your question for the 8ball')
                .setRequired(true)),
    
    async execute(interaction) {
        const question = interaction.options.getString('question');

        const responses = [
            "🎱 absolutely.",
            "🎱 without a doubt.",
            "🎱 komik says so.",
            "🎱 i don't know dawg, don't ask me.",
            "🎱 who are you get out of my house!",
            "🎱 i mean.. sure?.",
            "🎱 ask nurse. not me.",
            "🎱 yeah.",
            "🎱 for sure.",
            "🎱 ehhhhhh i don't know about it.",
            "🎱 try again goofus.",
            "🎱 ask again later.",
            "🎱 want me to be honest.. or do you want me to tell you the truth?",
            "🎱 shut up! let me focus.",
            "🎱 i'm blocking you.",
            "🎱 don't count on it.",
            "🎱 nah.",
            "🎱 komik says no.",
            "🎱 that'd be bad for you.",
            "🎱 i doubt it tbh."
        ];

        const randomAnswer = responses[Math.floor(Math.random() * responses.length)];

        await interaction.reply(`> **${question}**\n${randomAnswer}`);
    }
};
