import { IUser, UserData } from "../../interfaces";

export default function getUserData(user: IUser): UserData {
	return {
		_id: user._id,
		username: user.username,
		fullName: user.fullName,
		email: user.email,
		location: user.location,
		followers: user.followers,
		following: user.following,
		profilePicture: user.profilePicture,
		coverImage: user.coverImage,
		bio: user.bio,
		link: user.link,
		likedPosts: user.likedPosts,
		numFollowers: user.numFollowers,
		numFollowing: user.numFollowing,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
		isVerified: user.isVerified
	};
}
