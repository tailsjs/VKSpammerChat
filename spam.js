//Собственно, сам скрипт.
const cnfg = require("./config.js")
const { VK } = require("vk-io")
const { Request } = require("vk-io")
const vk = new VK({
	token: cnfg.token
})
const id = cnfg.inviteId // ID человека для спама
const spam = cnfg.count // кол-во спама
const chat = cnfg.chatId // ID чата
const time = cnfg.time * 1000 // время
const check = cnfg.time // для проверки
let c = 0 //Для подсчёта
//проверки
	if(id < 1)return console.error(`Вы не указали ID!`)
	if(isNaN(id) || !id)return console.error(`Неккоректный ID!`)
	if(spam < 1)return console.error(`А сколько надо спамить?`)
	if(isNaN(spam) || !spam)return console.error(`Неккоректное количество спама!`)
	if(check < 0)return console.error(`Число времени уходит в минус!`)
	if(isNaN(time) || !time)return console.error(`Неккоректное время!`)
	if(chat < 1)return console.error(`Вы не указали ID чата!`)
	if(isNaN(chat) || !chat)return console.error(`Неккоректный chatID!`)
	if(spam > 20)return console.error(`Такое число вызывает FloodControl!`)
		//если убрать, то будет капец.
	// а теперь спам собсна входом/выходом
var timerId = setInterval(function() { // новый таймер
 vk.api.messages.removeChatUser({ // удаляет пользователя из беседы
		chat_id: chat,
	user_id: id
	})
	vk.api.messages.addChatUser({ // приглашает пользователя в беседу
		chat_id: chat,
	user_id: id
	}) 
	c += 1 // если в первой версии было только для показателя спама, теперь это может остановить это
	console.log(`Заспамлено уже: ${c} раз`) // каунтер
	if(c == spam){
		clearInterval(timerId);
	}
}, time);
return console.log(`Заспамлено!`)