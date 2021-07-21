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
const removeUserFromChat = async () => {
	try {
		await vk.api.messages.removeChatUser({
			chat_id: config.chat_id,
			user_id: config.invite_id,
		});
	} catch (error) {
		if (error.code !== 15) {
			throw new Error();
		}
	}
};

// приглашает пользователя в беседу
const addUserToChat = async () => {
	try {
		await vk.api.messages.addChatUser({
			chat_id: config.chat_id,
			user_id: config.invite_id,
		});
	} catch (error) {
		if (error.code !== 935) {
			throw new Error();
		}
	}
};

(async function main() {
	while (!isError) {
		++inviteCount;
		await removeUserFromChat().catch(() => {
			++errorsCount;
		});
		await addUserToChat().catch(() => {
			++errorsCount;
		});
		if (inviteCount >= config.amount) {
			console.log(`Готово.`);
			process.exit();
		} else if (errorsCount >= config.errorLimit) {
			console.log(`Превышен лимит ошибок.`);
			process.exit();
		} else {
			await new Promise((resolve) => {
				setTimeout(() => resolve(), configValue * 1_000);
			});
		}
	}
})();
