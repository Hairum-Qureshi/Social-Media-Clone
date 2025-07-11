import { UserData } from "../interfaces";

export function formatSystemMessage(
	userData: UserData | null,
	message: string
) {
	if (!userData) return message;
	const mentionIsNowAdmin = `@${userData.username} is now the admin`;
	if (message.includes(mentionIsNowAdmin)) {
		return message.replace(
			new RegExp(mentionIsNowAdmin, "g"),
			"You are now the admin"
		);
	}
	const simpleMention = `@${userData.username}`;
	if (message.includes(simpleMention)) {
		return message.replace(new RegExp(simpleMention, "g"), "You");
	}
	return message;
}
