import { UserData, UserData_Conversation } from "../interfaces";

export default function isFollowing(
	profile: UserData | UserData_Conversation | undefined,
	currUID: string | undefined
): boolean {
	if (profile && profile._id !== currUID) {
		const profileFollowers = profile.followers;
		return profileFollowers.some(
			(follower: UserData) => follower._id === currUID
		);
	}

	return false;
}
