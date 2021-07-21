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

// убирает пользователя из беседы
const removeUserFromChat = () => {
	return vk.api.messages.removeChatUser({
		chat_id: config.chat_id,
		user_id: config.invite_id,
	});
};

// приглашает пользователя в беседу
const addUserToChat = () => {
	return vk.api.messages.addChatUser({
		chat_id: config.chat_id,
		user_id: config.invite_id,
	});
};

(async function main() {
	while (true) {
		++inviteCount;
		await removeUserFromChat().catch((error) => {
			if (error.code !== 15) {
				++errorsCount;
			}
		});
		await addUserToChat().catch((error) => {
			if (error.code !== 935) {
				++errorsCount;
			}
		});
		if (inviteCount >= config.amount) {
			console.log(`Готово.`);
			process.exit();
		} else if (errorsCount >= config.errorLimit) {
			console.log(`Превышен лимит ошибок.`);
			process.exit();
		} else {
			await new Promise((resolve) => {
				setTimeout(() => resolve(), config.time * 1_000);
			});
		}
	}
})();
