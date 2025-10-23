const config = require('../config')
const {cmd , commands} = require('../command')
const os = require("os")
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson} = require('../lib/functions')
cmd({
    pattern: "alive",
    desc: "Check bot online or no.",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
return await conn.sendMessage(from,{image: {url: config.ALIVE_IMG},caption: config.ALIVE_MSG},{quoted: mek})
}catch(e){
console.log(e)
reply(`${e}`)
}
})

//============ping=======
cmd({
    pattern: "ping",
    react: "🚀",
    alias: ["speed"],
    desc: "Check bot\'s ping",
    category: "main",
    use: '.ping',
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
var inital = new Date().getTime();
let ping = await conn.sendMessage(from , { text: '```Pinging To index.js!!!```'  }, { quoted: mek } )
var final = new Date().getTime();
return await conn.edit(ping, '*Pong*' + (final - inital) + ' ms* ' )
} catch (e) {
reply(`${e}`)
console.log(e)
}
})

//===========menu========
cmd({
    pattern: "menu",
    desc: "To get the menu.",
    react: "📁",
    category: "main",
    filename: __filename
},
async(conn, mek, m,{from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply}) => {
try{
    
let menu = {
main: '',
download: '',
group: '',
owner: '',
convert: '',
ai: '',
tools: '',
search: '',
fun: '',
voice: '',
other: ''
};

for (let i = 0; i < commands.length; i++) {
if (commands[i].pattern && !commands[i].dontAddCommandList) {
menu[commands[i].category] += `.${commands[i].pattern}\n`;
 }
}

let madeMenu = `
👋 𝐇𝐄𝐋𝐋𝐎, ${pushname}!

𝗪𝗲𝗹𝗰𝗼𝗺𝗲 𝘁𝗼 𝗤𝗨𝗘𝗘𝗡 𝗠𝗔𝗬𝗔 〽️𝗗  
╭─「 ᴄᴏᴍᴍᴀɴᴅꜱ ᴘᴀɴᴇʟ」
│◈ *Up time*  * ${runtime(process.uptime())}
│◈ *Bot Owner * Sandes isuranda 
│◈ *Owner number* * 94716717099*  
╰──────────●●►
╭──────────●●►
  ⬇️ *Download Menu*

 .tiktok ( Download Tik Tok videos )
 .mp43 ( Download YouTube Videos )
 .song3 (Download YouTube Songs )
 
 👤 *Owner Menu*
 
 .jid (Get your jid)
 .gjid (Get group jids)
 .block (Block some one)
 .ban (Band some one)
 .setpp (Set your Dp)
 
 ✨ *Other Menu*
 
 .ping (Check bot response speed)
 .menu (Check Available Cmd)
 
 🔍 *Search Menu*
 
 .yts (Search YouTube )
 .tiktoksearch (Tik Tok Search)
╰───────────●●►


> *©ᴘᴏᴡᴇʀᴇᴅ ʙʏ Sandes isuranda ツ*`

return await conn.sendMessage(from,{image: {url: `https://files.catbox.moe/4bc81k.png`},caption:madeMenu},{quoted: mek})
}catch(e){
console.log(e)
reply(`𝔼𝕣𝕣𝕣𝕠𝕣`)
}
})
