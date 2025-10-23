const { jidNormalizedUser } = require('@whiskeysockets/baileys');

module.exports = {
  pattern: "tagall",
  alias: ["all", "mentionall"],
  react: "📢",
  desc: "Tag all group members",
  
  async function(conn, mek, m, { from, isGroup, participants, isAdmins, reply }) {
    if (!isGroup) return reply("🛑 This command is only for groups!");
    if (!isAdmins) return reply("⚠️ Only group admins can use this command!");

    let text = "📢 *Tagging all members:*\n\n";
    for (let mem of participants) {
      text += `@${mem.id.split('@')[0]}\n`;
    }

    await conn.sendMessage(from, {
      text: text,
      mentions: participants.map(a => a.id)
    }, { quoted: mek });
  }
};
