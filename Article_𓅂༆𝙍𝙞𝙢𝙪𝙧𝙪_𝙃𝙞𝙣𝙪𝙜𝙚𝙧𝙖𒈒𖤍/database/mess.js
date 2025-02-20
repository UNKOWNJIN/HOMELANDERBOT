require("./global")

const mess = {
   wait: "*`[ ✵ ] Be patient, Dog*`*",
   success: "*`[ ✵ ] Good luck Dong`*",
   on: "*`[ On Feature ]` - it's active*", 
   off: "*`[ Off Feature ]` - It's Off*",
   query: {
       text: "*`[ ✵ ] The text is Mana?`*",
       link: "*`[ ✵ ] Where's the link?`*",
   },
   error: {
       fitur: "*`[ ✵ ] Sorry diddy, Error Feature, Please Chat with the Bot Developer So It Can Be Fixed Immediately`*",
   },
   only: {
       group: "*`[ ✵ ] This feature can only be accessed within a group`*",
       private: "`[ ✵ ] This feature can only be accessed in private chat`",
       owner: "*`[ ✵ ] Pretending to be fun to fuck`*",
       admin: "*`[ ✵ ] This feature can only be accessed by the Admin`*",
       badmin: "*`[ ✵ ] Can't, the •¥• ELDERS •¥• Bot Becomes Admin`*",
       premium: "*`[ ✵ ] This feature can only be accessed by Prem •¥• ELDERS •¥• members`*",
   }
}

global.mess = mess

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})