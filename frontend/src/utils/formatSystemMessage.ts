import { UserData } from "../interfaces";

export function formatSystemMessage(
	userData: UserData | null,
	message: string
): string {
	if (!userData) return message;

	const username = userData.username.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape regex special chars
	const mentionIsNowAdminRegex = new RegExp(
		`@${username} is now the admin`,
		"g"
	);
	const mentionRegex = new RegExp(`@${username}`, "g");

	// Step 1: Handle "@username is now the admin" → "You are now the admin"
	if (mentionIsNowAdminRegex.test(message)) {
		return message.replace(mentionIsNowAdminRegex, "You are now the admin");
	}

	// Step 2: Replace any mention of @username with correct casing
	return message.replace(mentionRegex, (_, offset) => {
		// Check if match is at the beginning of the string or follows punctuation and space
		const isCapitalizedContext =
			offset === 0 || /[.!?]\s*$/.test(message.slice(0, offset));

		return isCapitalizedContext ? "You" : "you";
	});
}
