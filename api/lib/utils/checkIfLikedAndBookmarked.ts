import { Types } from "mongoose";
import User from "../../models/User";

export async function checkIfLikedAndBookmarked(
	postID: Types.ObjectId,
	currUID: Types.ObjectId
): Promise<{ isBookmarked: boolean; isLiked: boolean }> {
	const isBookmarked = await User.findOne({
		_id: currUID,
		bookmarkedPosts: { $in: [postID] }
	}).lean();

	const isLiked = await User.findOne({
		_id: currUID,
		likedPosts: { $in: [postID] }
	}).lean();

	return { isBookmarked: !!isBookmarked, isLiked: !!isLiked };
}
