import { ChangeEvent } from "react";

export interface CarouselImageProps {
	image: string;
	imageIndex: number;
	removeImage?: (imageIndex: number) => void;
	allowDelete: boolean;
	forPost: boolean;
}

export interface CarouselProps {
	images: string[];
	numImages: number;
	removeImage?: (imageIndex: number) => void;
	allowDelete: boolean;
	forPost: boolean;
}

export interface EditorOptionsProps {
	handleImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
	uploadedImages: string[];
	postContent: string;
	clearTextArea: () => void;
}

export interface UserData {
	_id: string;
	username: string;
	fullName: string;
	email: string;
	location: string;
	followers: string[];
	following: string[];
	profilePicture: string;
	coverImage: string;
	bio: string;
	link: string;
	likedPosts: string[];
	numFollowers: number;
	numFollowing: number;
	isVerified: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface AuthProps {
	children: React.ReactNode;
}

export interface ContextData {
	userData: UserData | null;
}

export interface Post {
	_id: string;
	user: UserData;
	text: string;
	image: string;
	likes: string[];
	comments: Comment[];
	numLikes: number;
	numComments: number;
	createdAt: Date;
	updatedAt: Date;
	postImages: string[];
}

export interface OptionsProps {
	close: () => void;
	isOwner: boolean;
	username: string;
	postID: string;
}

export interface PostProps {
	isOwner: boolean;
	postData: Post;
}

export interface PostData {
	postData: Post[];
	loadingStatus: boolean;
	currentUserPostData: Post[];
	postMutation: (uploadedImages: string[], postContent: string) => void;
	isPending: boolean;
	deleteMutation: (postID: string) => void;
	postDataByID: Post;
}

export interface UserCardProps {
	showFollowButton?: boolean;
	isFollowing?: boolean;
	showFollowStatus: boolean;
}

export interface UserTagProps {
	userFullName: string;
    deleteUser: (tagIndex:number) => void;
	tagIndex: number
}

export interface UserSearchModalProps {
	closeModal: () => void;
}

export interface UserSearchTools {
	deleteUser: (tagIndex: number) => void;
	handleUserTag: (e: KeyboardEvent) => void;
	searchedUser: string;
	searchedUsers: string[];
	path: string;
	updateSearchedUser: (e?: ChangeEvent<HTMLInputElement>) => void;
	autoSearch: () => void;
	searching: boolean;
}