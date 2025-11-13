const { cmd, commands } = require("../command");
const { runtime } = require("../lib/functions");

cmd({
  pattern: "menu",
  desc: "Send round video first and then menu",
  category: "main",
  filename: __filename
},
async (conn, mek, m, { from, pushname, reply }) => {
  try {
    // Step 1: Send round video (PTV)
    const videoUrl = "https://files.catbox.moe/h6i20o.mp4";
    await conn.sendMessage(
      from,
      {
        video: { url: videoUrl },
        mimetype: "video/mp4",
        ptv: true, // 👉 this makes it a round (PTV) video
      },
      { quoted: mek }
    );

    // Step 2: Wait a bit (optional)
    await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay

    // Step 3: Send the normal menu message
    let madeMenu = `
👋 𝐇𝐄𝐋𝐋𝐎, ${pushname}!

𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 𝗤𝗨𝗘𝗘𝗡 𝗠𝗔𝗬𝗔 〽️𝗗  
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *Up time* - * ${runtime(process.uptime())}*
│◈ *Bot Owner* - Sandes Isuranda
│◈ *Owner number* - *94716717099*  
│◈ *Mode* - Public
│◈ *Group* - Working
│◈ *System* - 95.9
╰──────────●●►
╭──────────●●►
│◈     ⬇️ *Download Menu*
│ 
│ .tiktok ( Download TikTok videos )
│ .mp43 ( Download YouTube Videos )
│ .song3 ( Download YouTube Songs )
│
│◈     👤 *Owner Menu*
│ 
│ .jid (Get your jid)
│ .gjid (Get group jids)
│ .block (Block someone)
│ .ban (Ban someone)
│ .setpp (Set your Dp)
│  
│◈     ✨ *Other Menu*
│ 
│ .ping (Check bot response speed)
│ .menu (Check Available Cmd)
│ 
│◈     🔍 *Search Menu*
│ 
│ .yts (Search YouTube)
│ .tiktoksearch (TikTok Search)
╰───────────●●►

> *© Powered by Sandes Isuranda ツ*
`;

    await conn.sendMessage(
      from,
      {
        image: { url: `https://files.catbox.moe/4bc81k.png` },
        caption: madeMenu,
      },
      { quoted: mek }
    );

  } catch (e) {
    console.log(e);
    reply("⚠️ Error sending menu or round video!");
  }
});
