const { cmd } = require('../command');
const axios = require('axios');

cmd({
  pattern: "tiktok",
  alias: ["tt", "ttdl", "tiktokdl"],
  desc: "Download TikTok video (with options)",
  react: "🎬",
  category: "downloader",
  filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply('*Please enter a valid TikTok link!*');
    if (!q.includes('tiktok.com')) return reply('*Invalid TikTok URL provided!*');

    reply('🔄 Processing your request...');

    const api = `https://delirius-apiofc.vercel.app/download/tiktok?url=${q}`;
    const { data } = await axios.get(api);

    if (!data.status || !data.data) {
      return reply('❌ Failed to fetch TikTok video.');
    }

    const info = data.data;
    const author = info.author || {};
    const video = info.meta?.media?.find(v => v.type === "video");

    if (!video || !video.org) {
      return reply('❌ Video URL not found in API response.');
    }

    const vidUrl = video.org;
    const title = info.title || "TikTok Video";
    const thumbnail = author.avatar || null;

    const caption = `*🎬 TIKTOK VIDEO DOWNLOADER*\n
👤 User: ${author.nickname || 'Unknown'} (@${author.username || 'N/A'})
📖 Title: ${title}
👍 Likes: ${info.like || '0'}
💬 Comments: ${info.comment || '0'}
🔁 Shares: ${info.share || '0'}

*Reply This Message With Option* ⤵️

*1* ▶ Send as video
*2* 📁 Send as document

> Powered by Sandes isuranda`;

    let thumbBuffer = null;
    if (thumbnail) {
      try {
        const img = await axios.get(thumbnail, { responseType: 'arraybuffer' });
        thumbBuffer = img.data;
      } catch {
        thumbBuffer = null;
      }
    }

    const sent = await conn.sendMessage(from, {
      image: { url: thumbnail || 'https://i.ibb.co/4pDNDk1/default.png' },
      caption,
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true
      }
    }, { quoted: mek });

    conn.ev.on('messages.upsert', async (msgUpdate) => {
      const msg = msgUpdate.messages[0];
      if (!msg?.message?.extendedTextMessage) return;

      const ctx = msg.message.extendedTextMessage.contextInfo;
      if (!ctx || ctx.stanzaId !== sent.key.id) return;

      const choice = msg.message.extendedTextMessage.text.trim();

      switch (choice) {
        case '1':
          await conn.sendMessage(from, {
            video: { url: vidUrl },
            caption: `🎬 ${title}\n\n> ✅ Downloaded Successfully`,
            mimetype: 'video/mp4',
            contextInfo: {
              externalAdReply: {
                title: 'TIKTOK DOWNLOADER',
                body: title,
                previewType: "VIDEO",
                thumbnail: thumbBuffer,
                mediaType: 2,
                sourceUrl: q
              }
            }
          }, { quoted: sent });
          break;

        case '2':
          await conn.sendMessage(from, {
            document: { url: vidUrl },
            mimetype: 'video/mp4',
            fileName: `${title}.mp4`,
            caption: `📁 ${title}\n\n> ✅ Downloaded Successfully`,
            contextInfo: {
              externalAdReply: {
                title: 'TIKTOK DOWNLOADER',
                body: title,
                previewType: "VIDEO",
                thumbnail: thumbBuffer,
                mediaType: 2,
                sourceUrl: q
              }
            }
          }, { quoted: sent });
          break;

        default:
          await conn.sendMessage(from, {
            text: "❌ Invalid option! Please reply with *1* or *2*."
          }, { quoted: sent });
      }
    });

  } catch (e) {
    console.error(e);
    reply(`❌ Error: ${e.message}`);
  }
});