import { ChangeEvent, RefObject } from "react";

export interface CarouselImageProps {
	children: React.ReactNode;
	imageIndex: number;
	removeImage?: (imageIndex: number) => void;
	allowDelete: boolean;
	forPost: boolean;
	numImages: number;
	forGallery?: boolean;
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

export interface UserData_Conversation {
	_id: string;
	username: string;
	fullName: string;
	profilePicture: string;
	isVerified: boolean;
	createdAt: Date;
	bio: string;
	numFollowers: number;
	followers: UserData[];
}

export interface Conversation {
	_id: string;
	users: UserData_Conversation[];
	isGroupchat: boolean;
	groupName: string;
	groupPhoto: string;
	media: string[];
	latestMessage: string;
	isDMRequest: boolean;
	requestedBy: UserData_Conversation;
	requestedTo: UserData_Conversation;
	messages: Message[];
}

export interface UserData {
	_id: string;
	username: string;
	fullName: string;
	email: string;
	location: string;
	followers: UserData[];
	following: UserData[];
	profilePicture: string;
	coverImage: string;
	bio: string;
	link: string;
	likedPosts: string[];
	numFollowers: number;
	numFollowing: number;
	isVerified: boolean;
	conversations: Conversation;
	createdAt: Date;
	updatedAt: Date;
}

export interface Message {
	message: string;
	sender: {
		_id: string;
		username: string;
		profilePicture: string;
	};
	attachments: string[];
	conversationID: string;
	createdAt: Date;
	encryptedAESKeys: Record<string, string>;
}

export interface ContextProps {
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
	currentProfilePostData: Post[];
	postMutation: (uploadedImages: string[], postContent: string) => void;
	isPending: boolean;
	deleteMutation: (postID: string) => void;
	postDataByID: Post;
	showPostModal: boolean;
	showThePostModal: (bool: boolean) => void;
	getPostDataOnHover: () => void;
}

export interface UserCardProps {
	showFollowButton?: boolean;
	isFollowing?: boolean;
	showFollowStatus: boolean;
	userData: UserData;
}

export interface UserTagProps {
	profilePicture: string;
	userFullName: string;
	deleteUser: (tagIndex: number) => void;
	tagIndex: number;
}

export interface UserSearchModalProps {
	closeModal: () => void;
}

export interface UserTagData {
	pfp: string;
	fullName: string;
}

export interface UserSearchTools {
	deleteUser: (tagIndex: number) => void;
	searchedUser: string;
	searchedUsers: UserTagData[];
	path: string;
	updateSearchedUser: (e?: ChangeEvent<HTMLInputElement>) => void;
	autoSearch: () => void;
	searching: boolean;
	returnedUsers: UserData[];
	addUserTag: (user: UserData) => void;
}

export interface PostImage {
	_id: string;
	postImages: string[];
}

export interface ProfileTools {
	postMutation: (
		fullName: string,
		username: string,
		email: string,
		currentPassword: string,
		newPassword: string,
		location: string,
		bio: string,
		link: string
	) => void;
	profileData: UserData | undefined;
	handleFollowing: (userID: string | undefined) => void;
	handleImage: (
		event: React.ChangeEvent<HTMLInputElement>,
		isPfp: boolean
	) => void;
	postsImages: PostImage[];
}

export interface ContactProps {
	conversationID: string;
	username: string;
	pfp: string;
	fullName: string;
	latestMessage: string;
}

export interface ConversationProps {
	defaultSubtext: string;
	showHeaderText: boolean;
	conversation: Conversation | undefined;
}

export interface InboxFooterProps {
	uploadedImage: string;
	deleteImage: () => void;
	contentEditableDivRef: RefObject<HTMLDivElement> | null;
	handlePaste: (e: React.ClipboardEvent<HTMLDivElement>) => void;
	members: UserData_Conversation[];
}

export enum Status {
	Online = "ONLINE",
	Offline = "OFFLINE"
}

export interface InboxHeaderProps {
	conversation: Conversation;
	currUID: string;
	status: Status;
}

export interface ProfilePreviewProps {
	conversation: Conversation;
	currUID: string;
}

export interface DMTools {
	createDM: (searchedUsers: UserTagData[]) => void;
	conversations: Conversation[];
	sendMessage: (
		message: string | undefined,
		uploadedImage: string,
		conversationID: string
	) => void;
	messages: Message[];
}

export interface SocketContextData {
	connectSocket: () => void;
	disconnectSocket: () => void;
	activeUsers: string[];
	receivedMessage: Message | undefined;
	handleTypingIndicator: (
		chatID: string,
		members: string[],
		senderUID: string | undefined
	) => void;
	typingIndicatorChatID: string;
	userIsTyping: boolean;
	typingUser: string;
}

enum NotificationTypes {
	Like = "LIKE",
	Comment = "COMMENT",
	Follow = "FOLLOW",
	Message = "MESSAGE"
}

export interface Notification {
	_id: string;
	from: {
		username: string;
		profilePicture: string;
	};
	to: {
		username: string;
		profilePicture: string;
	};
	notifType: NotificationTypes;
	read: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface UserNotificationCardProps {
	username: string;
	userPfp: string;
	notifType: string;
	notifDescription: string;
	notifDate: string;
	notifID: string;
}

export interface EditorProps {
	showBorder?: boolean;
}

export interface PostModalComponentProp {
	children: React.ReactNode;
}

export interface SideSuggestionsComponentProps {
	showFollowerSuggestions: boolean;
}

export interface ProfileHeaderProps {
	openModal: () => void;
	isMedia: boolean;
}
