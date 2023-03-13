const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
  if (message.content === '!story') {
    let messages = await message.channel.fetchMessages({ limit: 100 });
    let stopMessage = null;
    for (const msg of messages.array().reverse()) {
      if (msg.content.toLowerCase().includes('tamat') && !messages.some(m => m.createdAt > msg.createdAt && m.content.toLowerCase().includes('tamat'))) {
        stopMessage = msg;
        break;
      }
    }
    let userMessages = messages.filter(msg => !msg.content.toLowerCase().includes('!story'));
    if (stopMessage !== null && stopMessage.createdAt >= userMessages.last().createdAt) {
      userMessages = userMessages.filter(msg => msg.createdAt > stopMessage.createdAt);
    }
    let story = userMessages.reduce((acc, msg) => `${msg.content}\n${acc}`, '');
    let lastMessageId = messages.last().id;
    while (true) {
      messages = await message.channel.fetchMessages({ limit: 100, before: lastMessageId });
      if (messages.size === 0) {
        break;
      }
      const moreUserMessages = messages.filter(msg => !msg.content.toLowerCase().includes('!story') && msg.createdAt > stopMessage.createdAt);
      userMessages = userMessages.concat(moreUserMessages);
      lastMessageId = messages.last().id;
    }
    story = userMessages.reduce((acc, msg) => `${msg.content}\n${acc}`, story);
    const channel = client.channels.get('836599878218022943');
    channel.send(story.replace(/\n/g, ' '));
  }
});

client.login(process.env.TOKEN);