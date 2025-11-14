const { fetchJson } = require('../lib/functions')
const config = require('../config')
const { cmd, commands } = require('../command')

cmd({
  pattern: "ig2",
  alias: ["insta2", "Instagram2"],
  desc: "To download Instagram videos.",
  react: "🎥",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q || !q.startsWith("http")) {
      return reply("❌ Please provide a valid Instagram link.");
    }
    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });
    // නිවැරදි කරන ලදි: API URL එක සම්පූර්ණ කරන ලදි
    const response = await axios.get(`https://api.dark-yasiya-api.site/download/instagram?url=${q}`);
    const data = response.data;
    if (!data || data.status !== 200 || !data.downloadUrl) {
      return reply("⚠️ Failed to fetch Instagram video. Please check the link and try again.");
    }
    await conn.sendMessage(from, { video: { url: data.downloadUrl }, mimetype: "video/mp4", caption: "📥 *𝐈ɴꜱᴛᴀɢʀᴀ𝐌 𝐕ɪᴅᴇ𝐎 𝐃ᴏᴡɴʟᴏᴀᴅᴇ𝐃 𝐒ᴜᴄᴄᴇꜱꜱꜰᴜʟʟ𝐘..!*\n\n> *© Powered By Sandes isuranda *" }, { quoted: m });
  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while processing your request. Please try again.");
  }
});

// මෙම කොටසෙහි Twitter සඳහා අනවශ්‍ය ලෙස Instagram API Call එකක් තිබුණි. එය ඉවත් කරන ලදි.
cmd({
  pattern: "twitter",
  alias: ["tweet", "twdl"],
  desc: "Download Twitter videos",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, quoted, q, reply }) => {
  try {
    // නිවැරදි කරන ලදි: URL පරීක්ෂාව සම්පූර්ණ කරන ලදි
    if (!q || !q.startsWith("https://")) {
      return conn.sendMessage(from, { text: "❌ Please provide a valid Twitter URL." }, { quoted: m });
    }
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });
    
    // වැරදි API Call එක ඉවත් කරන ලදි: මෙම කොටස අනවශ්‍යයි, මන්ද පහත කේත කොටසේ Twitter Download සඳහා වෙනම විධානයක් ඇත.
    /* const response = await axios.get(`//api.davidcyriltech.my.id/instagram?url=${q}`);
    const data = response.data;
    if (!data || data.status !== 200 || !data.downloadUrl) {
      return reply("Failed to fetch Instagram video. Please check the link and try again.");
    }
    await conn.sendMessage(from, { video: { url: data.downloadUrl }, mimetype: "video/mp4", caption: "*Here is your video..!*\n\n> > © Powered By Sandes isuranda " }, { quoted: m });
    */
    
    // මෙම විධානය එකම "twitter" pattern එකට දෙවරක් තිබුණි. එක් විධානයක් පමණක් භාවිත කිරීම නිර්දේශ කෙරේ. 
    // මම දෙවන Twitter විධානය (එනම්, reply option සහිත විධානය) නිවැරදි කර තිබෙන නිසා, ඔබට මෙම කොටස සම්පූර්ණයෙන්ම ඉවත් කළ හැකිය, නැතිනම් pattern එක වෙනස් කරන්න.
    return reply("⚠️ මෙම 'twitter' විධානය අනවශ්‍යයි (Duplicate Command). පහත ඇති reply option සහිත විධානය භාවිත කරන්න.");

  } catch (error) {
    console.error("Error:", error);
    reply("An error occurred while processing your request. Please try again.");
  }
});

// Twitter download command with reply options (නිවැරදි කරන ලද)
cmd({
  pattern: "twitter",
  alias: ["tweet", "twdl"],
  desc: "Download Twitter videos",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, quoted, q, reply }) => {
  try {
    if (!q || !q.startsWith("https://")) {
      return conn.sendMessage(from, { text: "❌ Please provide a valid Twitter URL." }, { quoted: m });
    }
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });
    const response = await axios.get(`https://www.dark-yasiya-api.site/download/twitter?url=${q}`);
    const data = response.data;
    if (!data || !data.status || !data.result) {
      return reply("Failed to retrieve Twitter video. Please check the link and try again.");
    }
    const { desc, thumb, video_sd, video_hd } = data.result;
    
    // නිවැරදි කරන ලදි: caption string එකේ අවසානයේ තිබූ අනවශ්‍ය single quote (') ඉවත් කරන ලදි.
    const caption = `╭━━━〔 *QUEEN-MAYA-MD * 〕━━━⊷\n` + 
                    `┃▸ *𝙳𝙴𝚂𝙲𝚁𝙸𝙿𝚃𝙸𝙾𝙽:* ${desc || "No description"}\n` + 
                    `╰━━━⪼\n\n` + 
                    `🔢 *Reply the number below*":*\n` + 
                    `1️⃣ *SD Quality*\n` + 
                    `2️⃣ *HD Quality*\n` + 
                    `🎵 *As Audio:*\n` + 
                    `3️⃣ *Audio (MP3)*\n` + 
                    `4️⃣ *Document (MP3)*\n` + 
                    `5️⃣ *Voice note*\n\n` + 
                    `> Powered by sandes isuranda`; // මෙතනින් '.*' ඉවත් කරන ලදි
    
    const sentMsg = await conn.sendMessage(from, { image: { url: thumb }, caption: caption }, { quoted: m });
    const messageID = sentMsg.key.id;
    
    // NOTE: Event listener එක command එක ඇතුලේ තැබීම (nesting) සෑම විටම හොඳ පුරුද්දක් නොවේ. 
    // මෙය සෑම වරක්ම command එක ක්‍රියාත්මක වන විට නව listener එකක් නිර්මාණය කරයි.
    conn.ev.on("messages.upsert", async (msgData) => {
      const receivedMsg = msgData.messages[0];
      if (!receivedMsg.message) return;
      const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
      const senderID = receivedMsg.key.remoteJid;
      const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
      if (isReplyToBot) {
        await conn.sendMessage(senderID, { react: { text: '⬇️', key: receivedMsg.key } });
        switch (receivedText) {
          case "1":
            await conn.sendMessage(senderID, { video: { url: video_sd }, caption: "*SD Quality *" }, { quoted: receivedMsg });
            break;
          case "2":
            await conn.sendMessage(senderID, { video: { url: video_hd }, caption: "HD Quality" }, { quoted: receivedMsg });
            break;
          case "3":
            await conn.sendMessage(senderID, { audio: { url: video_sd }, mimetype: "audio/mpeg" }, { quoted: receivedMsg });
            break;
          case "4":
            await conn.sendMessage(senderID, { document: { url: video_sd }, mimetype: "audio/mpeg", fileName: "Twitter_Audio.mp3", caption: "Document*" }, { quoted: receivedMsg });
            break;
          case "5":
            await conn.sendMessage(senderID, { audio: { url: video_sd }, mimetype: "audio/mp4", ptt: true }, { quoted: receivedMsg });
            break;
          default:
            // "reply" වෙනුවට "conn.sendMessage" භාවිත කරන ලදි, මන්ද senderID යනු remoteJid ය.
            await conn.sendMessage(senderID, { text: "❌ Invalid option! Please reply with 1, 2, 3, 4, or 5." }, { quoted: receivedMsg });
        }
      }
    });
  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while processing your request. Please try again.");
  }
});

cmd({
  pattern: "mediafire",
  alias: ["mfire"],
  desc: "To download MediaFire files.",
  react: "🎥",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, quoted, q, reply }) => {
  try {
    if (!q) {
      return reply("*Please provide a valid MediaFire link* ❗.");
    }
    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });
    
    // නිවැරදි කරන ලදි: API URL එක සම්පූර්ණ කරන ලදි
    const response = await axios.get(`https://www.dark-yasiya-api.site/download/mfire?url=${q}`);
    const data = response.data;
    
    // දෝෂය නිවැරදි කරන ලදි: කේතයේ මැද භාගයේ තිබූ අනවශ්‍ය ලෙස නැවත නැවතත් තිබූ කේතය ඉවත් කරන ලදි.
    if (!data || !data.status || !data.result || !data.result.dl_link) {
      return reply("⚠️ Failed to fetch MediaFire download link. Ensure the link is valid and public.");
    }
    const { dl_link, fileName, fileType } = data.result;
    const file_name = fileName || "mediafire_download";
    const mime_type = fileType || "application/octet-stream";
    await conn.sendMessage(from, { react: { text: "⬆️", key: m.key } });
    
    // caption විචල්‍යය නැවත නිර්වචනය කරන ලදි (was duplicated)
    const caption = `╭━━━〔 *QUEEN-MAYA-MD* 〕━━━⊷\n` + 
                    `┃▸ *𝙵𝙸𝙻𝙴 𝙽𝙰𝙼𝙴:* ${file_name}\n` + 
                    `┃▸ *𝙵𝙸𝙻𝙴 𝚃𝚈𝙿𝙴:* ${mime_type}\n` + 
                    `╰━━━⪼\n\n` + 
                    `*Downloding your Request*`;
                    
    await conn.sendMessage(from, { document: { url: dl_link }, mimetype: mime_type, fileName: file_name, caption: caption }, { quoted: m });
  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while processing your request. Please try again.");
  }
});

cmd({ 
  pattern: "apk",
  desc: "Download APK from Aptoide.",
  category: "download",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q) {
      return reply("❌ Please provide an app name to search.");
    }

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${q}/limit=1`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data || !data.datalist || !data.datalist.list.length) {
      return reply("⚠️ No results found for the given app name.");
    }

    const app = data.datalist.list[0];
    const appSize = (app.size / 1048576).toFixed(2); // Convert bytes to MB

    const caption = `╭━━━〔 *QUEEN-MAYA-MD* 〕━━━┈⊷
┃ 📦 *𝙽𝙰𝙼𝙴:* ${app.name}
┃ 🏋 *𝚂𝙸𝚉𝙴:* ${appSize} MB
┃ 📦 *𝙿𝙰𝙲𝙺𝙰𝙶𝙴:* ${app.package}
┃ 📅 *𝚄𝙿𝙳𝙰𝚃𝙴𝙳 𝙾𝙽:* ${app.updated}
┃ 👨‍💻 *𝙳𝙴𝚅𝙴𝙻𝙾𝙿𝙴𝚁:* ${app.developer.name}
╰━━━━━━━━━━━━━━━┈⊷
> *© Powered By Sandes isuranda*`;

    await conn.sendMessage(from, { react: { text: "⬆️", key: m.key } });

    await conn.sendMessage(from, {
      document: { url: app.file.path_alt },
      fileName: `${app.name}.apk`,
      mimetype: "application/vnd.android.package-archive",
      caption: caption
    }, { quoted: m });

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while fetching the APK. Please try again.");
  }
});

// G-Drive-DL

cmd({
  pattern: "gdrive",
  desc: "Download Google Drive files.",
  react: "🌐",
  category: "download",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q) {
      return reply("❌ Please provide a valid Google Drive link.");
    }

    await conn.sendMessage(from, { react: { text: "⬇️", key: m.key } });

    const apiUrl = `https://api.fgmods.xyz/api/downloader/gdrive?url=${q}&apikey=mnp3grlZ`;
    const response = await axios.get(apiUrl);
    
    // දෝෂය නිවැරදි කරන ලදි: response.data.result පරීක්ෂාව එකතු කරන ලදි.
    if (!response.data || !response.data.result || !response.data.result.downloadUrl) {
        return reply("⚠️ No download URL found in the API response. Please check the link and try again.");
    }
    
    const downloadUrl = response.data.result.downloadUrl;

    if (downloadUrl) {
      await conn.sendMessage(from, { react: { text: "⬆️", key: m.key } });

      await conn.sendMessage(from, {
        document: { url: downloadUrl },
        mimetype: response.data.result.mimetype,
        fileName: response.data.result.fileName,
        caption: "> *© Powered By Sandes isuranda*"
      }, { quoted: m });

      await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
    } else {
      return reply("⚠️ No download URL found. Please check the link and try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while fetching the Google Drive file. Please try again.");
  }
});
