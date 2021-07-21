const { VK } = require("vk-io");

const config = require("./config.js");

const vk = new VK({
	token: config.token,
});
let inviteCount = 0;
let errorsCount = 0;

if (config.invite_id < 1 || isNaN(config.invite_id)) {
	console.error('Некорректно введён параметр "invite_id"');
	process.exit();
}
if (config.amount < 1 || isNaN(config.amount)) {
	console.error('Некоррктно введён параметр "amount"');
	process.exit();
}
if (config.errorLimit < 1 || isNaN(config.errorLimit)) {
	console.error('Некоррктно введён параметр "errorLimit"');
	process.exit();
}

const interval = setInterval(async function () {
	let isError = false;
	++inviteCount;
	await vk.api.messages
		.removeChatUser({
			// удаляет пользователя из беседы
			chat_id: config.chat_id,
			user_id: config.invite_id,
		})
		.catch(() => {
			console.error("Облом.");
			++errorsCount;
			isError = true;
		});
	await vk.api.messages
		.addChatUser({
			// приглашает пользователя в беседу
			chat_id: config.chat_id,
			user_id: config.invite_id,
		})
		.catch(() => {
			{
				console.error("Облом.");
				++errorsCount;
				isError = true;
			}
		});

	if (isError) {
		if (errorsCount >= config.errorLimit) {
			console.log(`Лимит ошибок превышен.`);
			clearInterval(interval);
			process.exit();
		}
	} else {
		console.log(`Заспамлено уже: ${c} раз`); // каунтер
		if (c === config.amount) {
			console.log("Готово.");
			clearInterval(interval);
			process.exit();
		}
	}
}, config.time * 1000);
