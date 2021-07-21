const { VK } = require("vk-io");

const {
	invite_id,
	amount,
	chat_id,
	errorLimit,
	time,
	token,
} = require("./config.js");

const vk = new VK({
	token: token,
});
let inviteCount = 0;
let errorsCount = 0;

if (invite_id < 1 || isNaN(invite_id)) {
	console.error('Некорректно введён параметр "invite_id"');
	process.exit();
}
if (amount < 1 || isNaN(amount)) {
	console.error('Некоррктно введён параметр "amount"');
	process.exit();
}
if (errorLimit < 1 || isNaN(errorLimit)) {
	console.error('Некоррктно введён параметр "errorLimit"');
	process.exit();
}

// убирает пользователя из беседы
const removeUserFromChat = () => {
	return vk.api.messages.removeChatUser({
		chat_id,
		user_id: invite_id,
	});
};

// приглашает пользователя в беседу
const addUserToChat = () => {
	return vk.api.messages.addChatUser({
		chat_id,
		user_id: invite_id,
	});
};

(async function main() {
	while (true) {
		++inviteCount;
		await removeUserFromChat().catch(({ code }) => {
			if (code !== 15) {
				++errorsCount;
			}
		});
		await addUserToChat().catch(({ code }) => {
			if (code !== 935) {
				++errorsCount;
			}
		});
		if (inviteCount >= amount) {
			console.log(`Готово.`);
			process.exit();
		} else if (errorsCount >= errorLimit) {
			console.log(`Превышен лимит ошибок.`);
			process.exit();
		} else {
			await new Promise((resolve) => {
				setTimeout(() => resolve(), time * 1_000);
			});
		}
	}
})();
