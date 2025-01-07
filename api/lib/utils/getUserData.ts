import { IUser, UserData } from "../../interfaces";

export default function getUserData(user: IUser): UserData {
	return {
		_id: user._id,
		username: user.username,
		fullName: user.fullName,
		email: user.email,
		followers: user.followers,
		following: user.following,
		profilePicture: user.profilePicture,
		coverImage: user.coverImage,
		bio: user.bio
	};
}
