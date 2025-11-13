const { cmd } = require("../command");

cmd({
  pattern: "vv",
  alias: ["anti-vv"],
  desc: "Auto open & resend all View Once messages",
  category: "main",
  filename: __filename
}, async (client, message, match, { from }) => {
  try {
    // Enable or disable anti-viewonce dynamically
    if (!global.antiviewonce) {
      global.antiviewonce = true;
      return await client.sendMessage(from, { text: "✅ Anti ViewOnce mode *activated!*" }, { quoted: message });
    } else {
      global.antiviewonce = false;
      return await client.sendMessage(from, { text: "❌ Anti ViewOnce mode *deactivated!*" }, { quoted: message });
    }
  } catch (error) {
    console.error("AntiViewOnce Error:", error);
    await client.sendMessage(from, { text: "⚠️ Error: " + error.message }, { quoted: message });
  }
});
