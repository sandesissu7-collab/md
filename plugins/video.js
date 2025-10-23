// file: video+mp4.js
const { cmd, commands } = require('../command');
const yts = require('yt-search');
const axios = require('axios');
const { getBuffer, isUrl } = require('../lib/functions');

const API_BASE = 'https://senalytdl.vercel.app'; // ඔය API url එක - අවශ්‍ය නම් වෙනස් කරන්න

cmd({
  pattern: 'mp43',
  desc: 'download video (mp4)',
  react: "🎬",
  category: 'download',
  filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) return reply('*Please enter a query or a url !*');

    // search or accept url
    const search = await yts(q.trim());
    let data = null;
    let sUrl = '';

    if (/^(https?:\/\/)/i.test(q)) {
      sUrl = q.trim();
      // if user passed a url, try to get some metadata via yt-search (may fail but okay)
      const maybe = await yts(sUrl).catch(() => null);
      if (maybe && maybe.videos && maybe.videos.length) data = maybe.videos[0];
    } else {
      if (!search.videos.length) return reply("❌ Video not found!");
      data = search.videos[0];
      sUrl = data.url;
    }

    if (!sUrl) return reply("❌ Video url not found!");

    // call the provided API - try common query param 'url'
    const apiEndpoints = [
      `${API_BASE}/api?url=${encodeURIComponent(sUrl)}`,
      `${API_BASE}/api/download?url=${encodeURIComponent(sUrl)}`,
      `${API_BASE}/?url=${encodeURIComponent(sUrl)}`
    ];

    let apiResp = null;
    for (const ep of apiEndpoints) {
      try {
        const r = await axios.get(ep, { timeout: 15000 });
        if (r && r.data) {
          apiResp = r.data;
          break;
        }
      } catch (e) {
        // try next endpoint
      }
    }

    if (!apiResp) return reply('❌ Could not reach the download API. Check API url or try again later.');

    // try to locate download url in common shapes
    let downloadUrl = null;
    // common shapes: { result: { download: '...' } } or { download: '...' } or { url:'...' } or { result: [{url:...}] }
    if (apiResp.result) {
      if (typeof apiResp.result === 'string') downloadUrl = apiResp.result;
      else if (apiResp.result.download) downloadUrl = apiResp.result.download;
      else if (Array.isArray(apiResp.result) && apiResp.result.length && apiResp.result[0].url) downloadUrl = apiResp.result[0].url;
    }
    if (!downloadUrl && apiResp.download) downloadUrl = apiResp.download;
    if (!downloadUrl && apiResp.url) downloadUrl = apiResp.url;
    if (!downloadUrl && apiResp.data && apiResp.data.url) downloadUrl = apiResp.data.url;

    if (!downloadUrl) return reply('❌ Download URL not found in API response.');

    // prepare metadata (fallbacks if data missing)
    const title = (data && data.title) ? data.title : (new URL(sUrl)).pathname.split('/').pop() || 'video';
    const thumbnailUrl = (data && data.thumbnail) ? data.thumbnail : null;

    let desc = `*🎬 QUEEN-MAYA-MD VIDEO DOWNLOADER . .⚙️*

🎥 TITLE - ${title}
🎥 TIME - ${data && data.timestamp ? data.timestamp : 'N/A'}
🎥 VIEWS - ${data && data.views ? data.views : 'N/A'}

*Reply This Message With Option*

*1 Video (mp4) Normal*
*2 Video Document (mp4 as file)*

> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀɴᴅᴇꜱ ɪꜱᴜʀᴀɴᴅᴀ ツ*`;

    const thumbnailBuffer = thumbnailUrl ? (await axios.get(thumbnailUrl, { responseType: 'arraybuffer' }).then(r => r.data).catch(() => null)) : null;

    // send message with thumbnail + options (similar to your song+video structure).
    const sent = await conn.sendMessage(from, {
      image: { url: thumbnailUrl || 'https://i.ibb.co/4pDNDk1/default.png' },
      caption: desc,
      contextInfo: {
        forwardingScore: 1,
        isForwarded: true
      }
    }, { quoted: mek });

    // listen for user's reply to the same message (option 1 or 2)
    conn.ev.on('messages.upsert', async (msgUpdate) => {
      const msg = msgUpdate.messages[0];
      if (!msg || !msg.message || !msg.message.extendedTextMessage) return;

      // ensure it's a reply to our sent message
      if (!(msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === sent.key.id)) return;

      const selectedOption = msg.message.extendedTextMessage.text.trim();

      switch (selectedOption) {
        case '1':
          // send as video (streaming)
          await conn.sendMessage(from, {
            video: { url: downloadUrl },
            caption: `🎬 ${title}\n\n> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀʜᴀꜱ ᴛᴇᴄʜ*`,
            mimetype: 'video/mp4',
            contextInfo: {
              externalAdReply: {
                title: 'QUEEN-MAYA-MD VIDEO DOWNLOADER',
                body: title,
                previewType: "VIDEO",
                thumbnail: thumbnailBuffer,
                sourceUrl: sUrl,
                mediaType: 2
              }
            }
          });
          break;

        case '2':
          // send as document (file)
          await conn.sendMessage(from, {
            document: { url: downloadUrl },
            caption: `🎬 ${title}\n\n> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀɴᴅᴇꜱ ɪꜱᴜʀᴀɴᴅᴀ ツ*`,
            mimetype: 'video/mp4',
            fileName: `${title}.mp4`,
            contextInfo: {
              externalAdReply: {
                title: 'QUEEN-MAYA-MD VIDEO DOWNLOADER',
                body: title,
                previewType: "VIDEO",
                thumbnail: thumbnailBuffer,
                sourceUrl: sUrl,
                mediaType: 2
              }
            }
          });
          await conn.sendMessage(from, { react: { text: '✔️', key: mek.key }});
          break;

        default:
          await conn.sendMessage(from, { text: "Invalid option. Please reply with *1* or *2*." }, { quoted: sent });
      }
    });

  } catch (e) {
    console.error(e);
    await conn.sendMessage(from, { react: { text: '❌', key: mek.key }});
    reply('An error occurred while processing your request.');
  }
});