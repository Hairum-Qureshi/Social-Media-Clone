import { UserData } from "../interfaces";

export default function isFollowing(
	profile: UserData | undefined,
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
