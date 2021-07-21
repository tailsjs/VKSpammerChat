const config = require("./config.js")
const { VK } = require("vk-io")
const vk = new VK({
	token: config.token
})
if(config.invite_id < 1 || isNaN(config.invite_id))return console.error('некорректно введён параметр "invite_id"')
if(config.amount < 1 || isNaN(config.amount))return console.error('некоррктно введён параметр "amount"')
let c = 0
setInterval(function() {
	c += 1
 	vk.api.messages.removeChatUser({ // удаляет пользователя из беседы
		chat_id: config.chat_id,
		user_id: config.invite_id
	}).catch(function(){
		return console.error('облом.')
	})
	vk.api.messages.addChatUser({ // приглашает пользователя в беседу
		chat_id: config.chat_id,
		user_id: config.invite_id
	}).catch(function(){
		return console.error('облом.')
	})
	
	console.log(`Заспамлено уже: ${c} раз`) // каунтер
	if(c == config.amount){
		console.log('готово.')
		break
	}
}, config.time*1000);
