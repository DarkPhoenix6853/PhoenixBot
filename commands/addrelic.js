//If something needs to know the permissions for this command, it looks here
exports.permissions = (client) => {
    return perms = {
        botChannel: true,           //If true, bot only responds in bot channels
        adminBotChannel: false,     //If true, bot only responds in admin bot channels
        role: client.perms.user     //Last word specifies permission level needed to use this command
    }
}

//This code is run when the command is executed
exports.run = (client, message, args) => {
    let searchString = args.join(" ");

    let regex = /((Lith)|(Meso)|(Neo)|(Axi)){1} ?[a-z]{1}[0-9]+/gi;
    let currentMatch;
    let result = "";
    let matches = [];

    while((currentMatch = regex.exec(searchString)) !== null) {
        result = currentMatch[0];

        if (result.startsWith('lith') || result.startsWith('meso')) {
            spaceIndex = 4;
        } else {
            spaceIndex = 3;
        }

        if (result[spaceIndex] != ' ') {
            result = result.substring(0,spaceIndex) + " " + result.substring(spaceIndex, result.length);
        }

        result = result
            .toLowerCase()
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
            .join(' ');

        if (client.DBEnmap.indexes.includes(result)) {
            matches.push(result);
        }
    }
    //'matches' is now an array of correctly formatted, vaulted relics found in the input

    let sendMessage;
    if (matches.length > 0) {
        let userID = message.author.id;
        let memberName = message.guild.member(message.author).displayName;

        sendMessage = `Subscribing user ${memberName} to relics: ${matches.join(', ')}.`

        for (let relic of matches) {
            client.DBEnmap.push(relic, userID);
        }
        
    } else {
        sendMessage = "Relic(s) not found. Are you sure they're vaulted?"
    }

    message.channel.send(sendMessage);
};

//This code is run when the help command is used to get info about this command
exports.help = (client, message) => {
    message.channel.send(`Help for AddRelic:
Subscribes you to relics that you want to receive notifications for.  

Usage: ${client.baseConfig.prefix}AddRelic <relic name(s)>`);
};
