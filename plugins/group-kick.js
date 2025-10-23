module.exports = {
  pattern: "kick",
  alias: ["remove", "ban"],
  react: "🚫",
  desc: "Remove a member from the group",

  async function(conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, args, quoted, reply }) {
    if (!isGroup) return reply("🛑 This command is only for groups!");
    if (!isAdmins) return reply("⚠️ Only group admins can use this command!");
    if (!isBotAdmins) return reply("❗ Make me admin first!");

    let target;
    if (quoted) {
      target = quoted.sender;
    } else if (args[0]) {
      target = args[0].replace(/[^0-9]/g, '') + "@s.whatsapp.net";
    } else {
      return reply("📌 Use:\n.kick @member\n.kick 947XXXXXXXX");
    }

    try {
      await conn.groupParticipantsUpdate(from, [target], "remove");
      reply(`✅ Removed: @${target.split("@")[0]}`);
    } catch (e) {
      reply(`❌ Failed to remove user.`);
    }
  }
};
