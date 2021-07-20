const fs = require('fs');
const Discord = require('discord.js');
const { prefix , userIDs } = require('./resources/config.json');
const { permsChecker, logCommandRun, logCommandError, recievedDM } = require(`../global/dependencies/indexdeps.js`);

fs.readdirSync(`./`).includes(`.env`) ? require("dotenv").config() : ``;

// create new discord client with proper intents
const client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES', `GUILD_VOICE_STATES`, `GUILD_MESSAGE_REACTIONS`, `DIRECT_MESSAGES`, `GUILD_PRESENCES`], partials: ['CHANNEL'] });
client.commands = new Discord.Collection();
client.buttons = new Discord.Collection();
client.slashCommands = new Discord.Collection();

// load all commands
for (let dir of [`./release_oc/commands`, `./global/commands`]) {
    // find all local and global commands
    const commandFiles = fs.readdirSync(dir).filter(file => file.endsWith(`.js`));
    dir.includes(`global`) ? dir = `../global/commands` : dir = `./commands`;

    // load all local and global commands
    for (const file of commandFiles) {
        const command = require(`${dir}/${file}`);
        client.commands.set(command.name, command);
    }
}

// load all events
for (let dir of [`./release_oc/events`, `./global/events`]) {
    // find all local and global events
    const eventFiles = fs.readdirSync(dir).filter(file => file.endsWith(`.js`));
    dir.includes(`global`) ? dir = `../global/events` : dir = `./events`;

    // load all local and global events
    for (const file of eventFiles) {
        const event = require(`${dir}/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
}

const slashCommandsList = fs.readdirSync(`./release_oc/interactions/slashCommands`).filter(file => file.endsWith('.js'));
for (const file of slashCommandsList) {
    const slashcommand = require(`./interactions/slashCommands/${file}`);
    client.slashCommands.set(slashcommand.name, slashcommand)
}

const buttonFiles = fs.readdirSync(`./release_oc/interactions/buttons`).filter(file => file.endsWith('.js'));
for (const file of buttonFiles) {
	const button = require(`./interactions/buttons/${file}`);
	client.buttons.set(button.id, button)
}

// Command handling
client.on('messageCreate', message => {

    // logs any DM that is sent to Wall-E that isn't a command
    if (message.channel.type === 'DM' && !message.content.startsWith(prefix) && message.author.id != userIDs.walle) {
        return recievedDM(message);
    }

    // if a message does not contain the prefix for the bot OR is from another bot, ignore the message
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // if the message is a command, remove the prefix & split messaage by spaces & store in args. shifts all index values down and stores zeroth in commandName
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    // check all command names & aliases for commandName & stop if message isn't a command
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;

    // check to make sure that the user has all the required permissions
    if (!permsChecker(command, message, args)) return;

    try {
        command.execute(message, args);
        logCommandRun(client, command, message);

    } catch (error) {
        console.error(error);
        logCommandError(client, command, message, error);;
    }

});

// interaction handler (slash commands)
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const slashCommand = client.slashCommands.get(interaction.commandName);
    await slashCommand.execute(interaction);
});

// interaction handler (buttons)
client.on('interactionCreate', async interaction => {
    // if the interaction is not a button press, ignore the event, otherwise log the user who triggered the event and preform the event action(s)
    if (!interaction.isButton()) return;
    console.log(`${interaction.member.user.username} pressed ${interaction.customId}!`)
    // console.log(client.buttons)

    const buttonPress = client.buttons.get(interaction.customId);
    if (!buttonPress) {
        interaction.reply({ content: `This feature is still a work in progress! If you want to check out what else is coming, check out my GitHub Repository at the link below!\nhttps://github.com/torohangupta/Wall-E`, ephemeral: true })
        return console.log(`${interaction.member.user.username} pressed a broken button!`);
    }

    // preform the button action(s)
    await buttonPress.execute(interaction);
});

// login to Discord with bot token
client.login(process.env.TOKEN_ONLINECOLLEGE_RELEASE);