//Собственно, сам скрипт.
const cnfg = require("./config.js")
const { VK } = require("vk-io")
const { Request } = require("vk-io")
const vk = new VK({
	token: cnfg.token
})
const id = cnfg.inviteId
const spam = cnfg.count
const chat = cnfg.chatId 
let c = 0 //Для подсчёта
	if(id < 1)return console.error(`Вы не указали ID!`)
		if(isNaN(id) || !id)return console.error(`Неккоректный ID!`)
	if(spam < 1)return console.error(`А сколько надо спамить?`)
		if(isNaN(spam) || !spam)return console.error(`Неккоректное количество спама!`)
	if(chat < 1)return console.error(`Вы не указали ID чата!`)
		if(isNaN(chat) || !chat)return console.error(`Неккоректный chatID!`)
		if(spam > 21)return console.error(`Такое число вызывает FloodControl!`)
		
	// а теперь спам собсна входом/выходом
for(let i = 0; i < (spam); i++) {
	vk.api.messages.removeChatUser({
		chat_id: chat,
	user_id: id
	})
	vk.api.messages.addChatUser({
		chat_id: chat,
	user_id: id
	})
	
	 
	 
	c += 1
	console.log(`Заспамлено уже: ${c} раз`)
}
return console.log(`Всё зашибись!`)

