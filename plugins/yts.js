// file: yts.js
const { cmd, commands } = require('../command');
const yts = require('yt-search');

cmd({
  pattern: 'yts',
  alias: ['ytsearch'],
  desc: 'Search videos from YouTube.',
  react: '🔎',
  category: 'search',
  filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply('*Please enter search keywords!*');

    const search = await yts(q);
    const videos = search.videos.slice(0, 8); // top 8 results only

    if (!videos.length) {
      return reply('❌ No results found!');
    }

    let msg = `*🔎 YouTube Search Results For:* _${q}_\n\n`;

    videos.forEach((v, i) => {
      msg += `*${i + 1}. ${v.title}*\n`;
      msg += `⏱️ ${v.timestamp} | 👁️ ${v.views}\n`;
      msg += `🔗 ${v.url}\n\n`;
    });

    await conn.sendMessage(from, { text: msg }, { quoted: mek });

  } catch (e) {
    console.error(e);
    reply('*Error while searching YouTube!*');
  }
});