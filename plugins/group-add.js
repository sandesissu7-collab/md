module.exports = {
  pattern: "add",
  alias: ["invite"],
  react: "➕",
  desc: "Add member to group",

  async function(conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, args, reply }) {
    if (!isGroup) return reply("🛑 This command is only for groups!");
    if (!isAdmins) return reply("⚠️ Only group admins can add members!");
    if (!isBotAdmins) return reply("❗ Make me admin first!");

    if (!args[0]) return reply("📌 Use: .add 947XXXXXXXX");

    let number = args[0].replace(/[^0-9]/g, '');
    let jid = number + "@s.whatsapp.net";

    try {
      await conn.groupParticipantsUpdate(from, [jid], "add");
      reply(`✅ Added: @${number}`);
    } catch (e) {
      reply(`❌ Failed to add @${number}.\nMaybe they blocked invites or the number is invalid.`);
    }
  }
};
