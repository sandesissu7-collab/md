const { cmd } = require("../command");

cmd({
  pattern: "menu", // ඔයාට ඕන නම් වෙන pattern එකක් දාන්න පුලුවන්
  desc: "Send round video automatically",
  category: "main",
  react: "🎥",
  filename: __filename
},
async (conn, mek, m, { from }) => {
  try {
    // Round video source
    const videoUrl = "https://files.catbox.moe/h6i20o.mp4";

    await conn.sendMessage(
      from,
      {
        video: { url: videoUrl },
        mimetype: "video/mp4",
        fileLength: 99999999, // avoid trimming
        seconds: 9999,
        gifPlayback: false,
        viewOnce: true,
        contextInfo: {
          isForwarded: false,
          externalAdReply: {
            title: "",
            body: "",
            mediaType: 2,
            thumbnailUrl: "",
            mediaUrl: "",
            showAdAttribution: false
          }
        },
        gifAttribution: 0,
        ptv: true // 👉 මේකයි round (PTV) video එකක් කරන්න
      },
      { quoted: mek }
    );

  } catch (e) {
    console.log(e);
    await conn.sendMessage(from, { text: "Error sending round video ❌" }, { quoted: mek });
  }
});
