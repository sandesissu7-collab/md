module.exports = {
  pattern: "mute",
  alias: ["groupmute", "silent"],
  react: "🔇",
  desc: "Mute group (only admins can send messages)",

  async function(conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) {
    if (!isGroup) return reply("🛑 This command is only for groups!");
    if (!isAdmins) return reply("⚠️ Only group admins can use this command!");
    if (!isBotAdmins) return reply("❗ Make me admin first!");

    try {
      await conn.groupSettingUpdate(from, "announcement");
      reply("✅ Group has been *muted*. Only admins can send messages now.");
    } catch (e) {
      reply("❌ Failed to mute group.");
    }
  }
};
