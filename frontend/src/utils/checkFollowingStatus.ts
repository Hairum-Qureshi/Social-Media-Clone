import { UserData, UserData_Conversation } from "../interfaces";

export default function isFollowing(
	profile: UserData | UserData_Conversation | undefined,
	currUID: string | undefined
	// isProfilePage: boolean = true
): boolean {
	if (profile && profile._id !== currUID) {
		const profileFollowing: string[] = profile.following as unknown as string[];
		return profileFollowing?.some(
			(following: string) => String(following) === String(currUID)
		);
	}

	// if (profile && profile._id !== currUID && isProfilePage) {
	// 	const profileFollowers: string[] = profile.followers as unknown as string[];
	// 	return profileFollowers.some(
	// 		(follower: string) => String(follower) === String(currUID)
	// 	);
	// }

	return false;
}
