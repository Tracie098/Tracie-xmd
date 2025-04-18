const { bot, getBuffer, jidToNum, genThumbnail } = require('../lib/');
const {
  textToStylist,
  getUptime,
  getRam,
  getPlatform,
} = require('../lib/');

const url1 = 'https://files.catbox.moe/zu8x5t.jpg';
const url2 = 'https://files.catbox.moe/zu8x5t.jpg';

bot(
  {
    pattern: 'menu ?(.*)',
    dontAddCommandList: true,
  },
  async (message, match, ctx) => {
    const commands = {};
    ctx.commands.forEach((command) => {
      if (!command.dontAddCommandList && command.pattern) {
        const type = command.type.toLowerCase();
        if (!commands[type]) commands[type] = [];
        commands[type].push(command.active === false ? `${command.name} [disabled]` : command.name);
      }
    });

    const colomboDateStr = new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' });
    const date = new Date(colomboDateStr);
    const time = date.toLocaleTimeString('en-US');
    const day = date.toLocaleString('en', { weekday: 'long' });
    const fullDate = date.toLocaleDateString('hi');

    let msg = `╭═══ XＥꜱʜᴜ-BOT ═══⊷
┃❃╭──────────────
┃❃│ Prefix : ${ctx.PREFIX}
┃❃│ User : ${message.pushName}
┃❃│ Time : ${time}
┃❃│ Day : ${day}
┃❃│ Date : ${fullDate}
┃❃│ Version : ${ctx.VERSION}
┃❃│ Plugins : ${ctx.pluginsCount}
┃❃│ Ram : ${getRam()}
┃❃│ Uptime : ${getUptime('t')}
┃❃│ Platform : ${getPlatform()}
┃❃╰───────────────
╰═════════════════⊷\n`;

    const commandKeys = Object.keys(commands).sort();
    if (match && commands[match]) {
      msg += `╭─❏ ${textToStylist(match.toLowerCase(), 'smallcaps')} ❏\n`;
      commands[match].sort().forEach((plugin) => {
        msg += `│ ${textToStylist(plugin.toUpperCase(), 'mono')}\n`;
      });
      msg += `╰─────────────────`;
    } else {
      for (const type of commandKeys) {
        msg += `╭─❏ ${textToStylist(type.toLowerCase(), 'smallcaps')} ❏\n`;
        commands[type].sort().forEach((plugin) => {
          msg += `│ ${textToStylist(plugin.toUpperCase(), 'mono')}\n`;
        });
        msg += `╰─────────────────\n`;
      }
    }

    const thumb = await getBuffer(url1);
    const thumbnail = await getBuffer(url2);
    const number = message.client.user.jid;

    const Data = {};
    Data.linkPreview = {
      renderLargerThumbnail: true,
      showAdAttribution: true,
      head: 'XＥꜱʜᴜ-BOT',
      body: 'Eshan Kavishka Official',
      mediaType: 1,
      thumbnail: thumb.buffer,
      sourceUrl: 'http://wa.me/94758178340?text=_Hey+XＥꜱʜᴜ-BOT',
    };

    Data.quoted = {
      key: {
        fromMe: false,
        participant: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast',
      },
      message: {
        contactMessage: {
          displayName: `${message.pushName}`,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${message.client.user.name},;;;\nFN:${message.client.user.name},\nitem1.TEL;waid=${jidToNum(number)}\nitem1.X-ABLabel:WhatsApp\nEND:VCARD`,
          jpegThumbnail: await genThumbnail(thumbnail.buffer),
        },
      },
    };

    await message.send(msg.trim(), Data);
  }
);
