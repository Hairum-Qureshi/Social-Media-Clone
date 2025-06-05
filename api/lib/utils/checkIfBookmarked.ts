import { Types } from "mongoose";
import { IPost } from "../../interfaces";

export function checkIfBookmarked(post: IPost, currUID: Types.ObjectId): boolean {
	return post.bookmarkedBy.some((uid: Types.ObjectId) => uid.equals(currUID));
}