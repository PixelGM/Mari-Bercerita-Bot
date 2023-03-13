const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async message => {
  if (message.content === '!story') {
    const messages = await message.channel.fetchMessages({ limit: 100 });
    const userMessages = messages.filter(msg => msg.author.id === message.author.id && !msg.content.toLowerCase().includes('!story'));
    let story = userMessages.reduce((acc, msg) => `${msg.content}\n${acc}`, '');
    while (messages.size === 100) {
      const lastMessageId = messages.last().id;
      messages = await message.channel.fetchMessages({ limit: 100, before: lastMessageId });
      const moreUserMessages = messages.filter(msg => msg.author.id === message.author.id && !msg.content.toLowerCase().includes('!story'));
      story = moreUserMessages.reduce((acc, msg) => `${msg.content}\n${acc}`, story);
    }
    const channel = client.channels.get('1084707829597880330');
    channel.send(story.replace(/\n/g, ' '));
  }
});

client.login(process.env.TOKEN);
