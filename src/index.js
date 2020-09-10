const Discord = require('discord.js');
const token = process.env.TOKEN || '';
const hourToRemind = process.env.HOUR || '10';
const minToRemind = process.env.MIN || '00';
const client = new Discord.Client();

/**
 * [{
 *      'channel':'',
 *      'msg":''
 *      'lastUpdate':''
 * }]
 * 
 * 
 */
reminder_list = []

function intervalUpdate()
{
    currentDate = new Date().toLocaleString("en-US", {timeZone: 'Asia/Seoul'});
    currentDate = currentDate.split("/");
    hours = currentDate[2].split(' ')[1].split(':')[0];
    minutes = currentDate[2].split(' ')[1].split(':')[1];
    afternoon = currentDate[2].split(' ')[2] === 'PM';

    if (hours === hourToRemind && minutes === minToRemind && !afternoon) {
        reminder_list.forEach(el => {
            client.channels.cache.get(el.channel).send('@everyone : ' + el.msg);
        });
    }
}

function filterContent(content) {
    var words = content.toLowerCase().split(" ");
    var filtered = words.filter(function (el) {
        return el != "" && el != null;
    });
    return filtered;
}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    words = filterContent(msg.content)

    if (words[0] === '!help') {
        msg.reply("You can only do a simple cmd to remind someting everyday: remind [...]");
    }

    if (words[0] === 'remind') {
        msg.reply("Bot will remind it for you everyday at 10am");
        reminder_list.push({
            channel: msg.channel.id,
            msg: msg.content.replace('remind ', '')
        });
    }
});

client.login(token);

setInterval(intervalUpdate, 60000)