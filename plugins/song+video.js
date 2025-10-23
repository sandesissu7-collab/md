const {cmd , commands} = require('../command')
const yts = require('yt-search');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
const axios = require('axios');
const { Buffer } = require('buffer');

cmd({
    pattern: 'song3',
    desc: 'download songs',
    react: "🎧",
    category: 'download',
    filename: __filename
},
async (conn, mek, m, { from,reply ,q }) => {
    try {
        if (!q) return reply('*Please enter a query or a url !*');

        const search = await yts(q.trim());
        const data = search.videos[0];

        let sUrl = '';
        if (/^(https?:\/\/)/i.test(q)) {
            sUrl = q.trim();
        } else {
            if (!search.videos.length) {
                return reply("❌ Video not found!");
            }
            sUrl = data.url;
        }

        if (!sUrl) return reply("❌ Video not found!");

        const mp3Response = await (await fetch(`http://vpn.asitha.top:3000/api/ytmp3?url=${sUrl}`)).json();
        const api = mp3Response.result;
        let downloadUrl = api.download;
      
        let desc = `*🎼 QUEEN-MAYA-MD SONG DOWNLOADER . .⚙️*

🎼⚙️ TITLE - ${data.title}
🎼⚙️ VIEWS - ${data.views}
🎼⚙️ DESCRIPTION - ${data.description}
🎼⚙️ TIME - ${data.timestamp}
🎼⚙️ AGO - ${data.ago}

*Reply This Message With Option*

*1 Audio With Normal Format*
*2 Audio With Document Format*

> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀɴᴅᴇꜱ ɪꜱᴜʀᴀɴᴅᴀ ツ*`;

        const thumbnailBuffer = (await axios.get(data.thumbnail, { responseType: 'arraybuffer' })).data;
		
        let contextInfo = {
            externalAdReply: {
                title: 'QUEEN-MAYA-MD SONG DOWNLOADER',
                body: data.title,
                previewType: "PHOTO",
                thumbnail: thumbnailBuffer,
                sourceUrl: "https://whatsapp.com/channel/0029VbAEkzNFi8xevDsbJS1L", // channel link eka dahm 
                mediaType: 1,
                renderLargerThumbnail: false
            }
        };
		
        const vv = await conn.sendMessage( from,
            { image: { url: data.thumbnail }, 
			 caption: desc,   
			   contextInfo: {
                     forwardingScore: 1,
                     isForwarded: true, 
                   forwardedNewsletterMessageInfo: {
                         newsletterJid: '120363416065371245@newsletter', // ube channel jid dahm 
                         newsletterName: "QUEEN-MAYA-MD",
                         serverMessageId: 110, }
          }},
            { quoted: mek }
        ); 

        conn.ev.on('messages.upsert', async (msgUpdate) => {
            const msg = msgUpdate.messages[0];
            if (!msg.message || !msg.message.extendedTextMessage) return;

            const selectedOption = msg.message.extendedTextMessage.text.trim();

            if (msg.message.extendedTextMessage.contextInfo && msg.message.extendedTextMessage.contextInfo.stanzaId === vv.key.id) {
                switch (selectedOption) {
                    case '1':
                        await conn.sendMessage(
                            from,
                            {
                                audio: { url: downloadUrl },
                                caption: '> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀʜᴀꜱ ᴛᴇᴄʜ*',
                                mimetype: 'audio/mpeg',
                                contextInfo
                            }
                        );
                        break;

                    case '2':
                        await conn.sendMessage(
                            from,
                            {
                                document: { url: downloadUrl },
                                caption: '> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀɴᴅᴇꜱ ɪꜱᴜʀᴀɴᴅᴀ ツ*',
                                mimetype: 'audio/mpeg',
                                fileName: data.title + ".mp3",
                                contextInfo
                            }
                        );
                        await conn.sendMessage(from, { react: { text: '✔️', key: mek.key }});
                        break;

                    default:
                        reply("Invalid option. Please select a valid option🔴");
                }
            }
        });

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key }});
        reply('An error occurred while processing your request.');
    }
});
