const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
  if (message.content === '!story') {
    const messages = await message.channel.fetchMessages({ limit: 100 });
    let stopMessage = null;
    for (const msg of messages.array().reverse()) {
      if (msg.content.toLowerCase().includes('stop')) {
        stopMessage = msg;
        break;
      }
    }
    let userMessages = messages.filter(msg => !msg.content.toLowerCase().includes('!story'));
    if (stopMessage !== null && stopMessage.createdAt > userMessages.last().createdAt) {
      userMessages = userMessages.filter(msg => msg.createdAt > stopMessage.createdAt);
    }
    let story = userMessages.reduce((acc, msg) => `${msg.content}\n${acc}`, '');
    while (messages.size === 100) {
      const lastMessageId = messages.last().id;
      messages = await message.channel.fetchMessages({ limit: 100, before: lastMessageId });
      const moreUserMessages = messages.filter(msg => !msg.content.toLowerCase().includes('!story'));
      if (stopMessage !== null && stopMessage.createdAt > moreUserMessages.last().createdAt) {
        userMessages = moreUserMessages.filter(msg => msg.createdAt > stopMessage.createdAt);
      }
      story = moreUserMessages.reduce((acc, msg) => `${msg.content}\n${acc}`, story);
    }
    const channel = client.channels.get('1084707829597880330');
    channel.send(story.replace(/\n/g, ' '));
  }
});

client.login(process.env.TOKEN);
