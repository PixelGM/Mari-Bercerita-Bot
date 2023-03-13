const Discord = require('discord.js');
const client = new Discord.Client();

let outputSent = false;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
  if (message.content === '!story' && !outputSent) {
    let messages = await message.channel.fetchMessages({ limit: 100 });
    let stopMessage = null;
    for (const msg of messages.array()) {
      if (msg.content.toLowerCase().includes('tamat') && !messages.some(m => m.createdAt > msg.createdAt && m.content.toLowerCase().includes('tamat'))) {
        stopMessage = msg;
        break;
      }
    }
    let userMessages = messages.filter(msg => !msg.content.toLowerCase().includes('!story'));
    if (stopMessage !== null && stopMessage.createdAt >= userMessages.last().createdAt) {
      userMessages = userMessages.filter(msg => msg.createdAt > stopMessage.createdAt);
    }
    let story = userMessages.filter(msg => !msg.content.toLowerCase().includes('!story')).array().reverse().reduce((acc, msg) => `${acc}${msg.content} `, '').toLowerCase(); // add toLowerCase()
    const channel = client.channels.get('836599878218022943');
    channel.send(story);
    outputSent = true;
  }
});

client.login(process.env.TOKEN);
