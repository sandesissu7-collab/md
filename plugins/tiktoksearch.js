const { cmd } = require("../command");
const fetch = require("node-fetch");

cmd({
  pattern: "tiktoksearch",
  alias: ["tiktoks", "tiks"],
  desc: "Search for TikTok videos using a query.",
  react: "🔍",
  category: "tools",
  filename: __filename
},
async (conn, mek, m, { from, reply, q }) => {
  try {
    if (!q) {
      return reply(
        "What do you want to search on TikTok?\n\n*Usage Example:*\n.tiktoksearch <query>"
      );
    }

    await reply(`🔎 Searching TikTok for: *${q}*`);

    const response = await fetch(
      `https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=${encodeURIComponent(q)}`
    );
    const data = await response.json();

    if (!data || !data.data || data.data.length === 0) {
      return reply(
        "❌ No results found for your query. Please try with a different keyword."
      );
    }

    // Get up to 7 random results
    const results = data.data.slice(0, 7).sort(() => Math.random() - 0.5);

    for (const video of results) {
      const message =
        `♣ *TIKTOK VIDEO RESULT:*\n\n` +
        `*• TITLE*: ${video.title}\n` +
        `*• AUTHOR*: ${video.author || "Unknown"}\n` +
        `*• DURATION*: ${video.duration || "Unknown"}\n` +
        `*• URL*: ${video.link}\n\n> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ꜱᴀɴᴅᴇꜱ ɪꜱᴜʀᴀɴᴅᴀ ツ*`;

      if (video.nowm) {
        await conn.sendMessage(
          from,
          {
            video: { url: video.nowm },
            caption: message
          },
          { quoted: mek }
        );
      } else {
        reply(`❌ Failed to retrieve video for *"${video.title}"*.`);
      }
    }
  } catch (error) {
    console.error("Error in TikTokSearch command:", error);
    reply("❌ An error occurred while searching TikTok. Please try again later.");
  }
});