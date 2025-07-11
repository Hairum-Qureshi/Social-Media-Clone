import { Editor } from "@tiptap/react";
import { ChangeEvent, RefObject } from "react";

export interface CarouselImageProps {
	children: React.ReactNode;
	imageIndex: number;
	removeImage?: (imageIndex: number) => void;
	allowDelete: boolean;
	forPost: boolean;
	numImages: number;
	forGallery?: boolean;
	imgsPerSlide: number;
	isEditor?: boolean;
}

export interface CarouselProps {
	images: string[];
	numImages: number;
	removeImage?: (imageIndex: number) => void;
	allowDelete: boolean;
	forPost: boolean;
	imgsPerSlide?: number;
	forEditor?: boolean;
}

export interface EditorOptionsProps {
	handleImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
	uploadedImages: string[];
	postContent: string;
	clearTextArea: () => void;
	buttonText: string;
}

export interface AdminData {
	_id: string;
	username: string;
	profilePicture: string;
	fullName: string;
	isVerified: boolean;
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
	requestedTo: string[];
	messages: Message[];
	admins: AdminData[];
}

export interface WorkHistory {
	_id: string;
	user: string;
	company: string;
	companyLogo: string;
	location: string;
	jobTitle: string;
	currentlyWorkingThere: boolean;
	startDate: string;
	endDate: string;
	description: string;
	createdAt: Date;
	updatedAt: Date;
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
	extendedBio: string;
	workHistory: WorkHistory[];
	createdAt: Date;
	updatedAt: Date;
}

export interface UserData_Conversation {
	_id: string;
	username: string;
	fullName: string;
	profilePicture: string;
	isVerified: boolean;
	bio: string;
	numFollowers: number;
	followers: UserData[];
	following: UserData[];
	createdAt: Date;
}

export interface Message {
	message: string;
	sender: UserData_Conversation;
	attachments: string[];
	conversationID: string;
	createdAt: Date;
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
	likedBy: UserData[];
	retweetedBy: UserData[];
	bookmarkedBy: UserData[];
	comments: Comment[];
	numLikes: number;
	numBookmarks: number;
	numRetweets: number;
	numComments: number;
	isPinned: boolean;
	postImages: string[];
	isBookmarked: boolean;
	isLiked: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export interface OptionsProps {
	isOwner: boolean;
	username: string;
	postID: string;
	isGalleryPost?: boolean;
	updateOptionsView?: () => void;
	isPinned?: boolean;
}

export interface PostProps {
	isOwner: boolean;
	postData: Post;
	isPinned?: boolean;
	showTopBorder?: boolean;
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
	optionsMenu: boolean;
	showOptions: () => void;
	close: () => void;
	editPostMutation: (postID: string, postContent: string) => void;
	editPending: boolean;
	bookmarkPostMutation: (postID: string) => void;
	bookmarks: Post[];
	isLoadingBookmarks: boolean;
	searchPhrase: (searchedPhrase: string) => void;
	isSearching: boolean;
	searchedPhraseResult: Post | null;
	pinPost: (postID: string) => void;
	likePostMutation: (postID: string) => void;
	currUserLikedPosts: Post[];
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
	_id: string;
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
	addExtendedBio: (extendedBioContent: string) => void;
	deleteExtendedBio: () => void;
	addExtendedBioWorkExperience: (
		isCurrentlyWorkingHere: boolean,
		jobTitle: string,
		companyName: string,
		companyLogo: string,
		location: string,
		startDate: string,
		endDate: string,
		experience: string
	) => void;
	updateExtendedBioWorkExperience: (
		workHistoryID: string,
		isCurrentlyWorkingHere: boolean,
		jobTitle: string,
		companyName: string,
		companyLogo: string,
		location: string,
		startDate: string,
		endDate: string,
		experience: string
	) => void;
	extendedBio: {
		extendedBio: string;
		userData: {
			username: string;
			fullName: string;
			profilePicture: string;
		};
		workExperience: WorkHistory[];
	};
	deleteWorkExperienceByID: (workExperienceID: string) => void;
}

export interface ContactProps {
	conversationID: string;
	username: string;
	pfp: string;
	fullName: string;
	latestMessage: string;
	activeConversationID?: string | null;
	setActiveConversationID?: (id: string | null) => void;
}

export interface ConversationProps {
	defaultSubtext: string;
	showHeaderText: boolean;
	conversation: Conversation | DMRequest | undefined;
	isDMRequest?: boolean;
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
	conversation: Conversation | DMRequest;
	currUID: string;
	status: Status;
	setShowInfoPanel: (show: boolean) => void;
	showInfoPanel: boolean;
}

export interface DMRequest {
	_id: string;
	users: UserData_Conversation[];
	isGroupchat: boolean;
	groupPhoto?: string;
	groupName?: string;
	media: string[];
	isDMRequest: boolean;
	requestedBy: UserData_Conversation;
	requestedTo: string[];
	messages: Message[];
	createdAt: Date;
	updatedAt: Date;
	latestMessage: string;
	admins: AdminData[];
}

export interface ProfilePreviewProps {
	conversation: Conversation | DMRequest;
	currUID: string;
}

export interface DMTools {
	createDM: (searchedUsers: UserTagData[], groupChatName?: string) => void;
	conversations: Conversation[];
	sendMessage: (
		message: string | undefined,
		uploadedImage: string,
		conversationID: string
	) => void;
	messages: Message[];
	dmRequests: DMRequest[];
	acceptDMRequest: (dmRequestID: string) => void;
	deleteConversation: (conversationID: string) => void;
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
	link: string;
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
	placeHolder?: string;
	buttonText?: string;
	content?: string;
	isForRetweet?: boolean;
	retweetPostData?: Post | null;
}

export interface PostModalComponentProp {
	children: React.ReactNode;
	editMode?: boolean;
}

export interface SideSuggestionsComponentProps {
	showFollowerSuggestions: boolean;
}

export interface ProfileHeaderProps {
	openModal: () => void;
	isMedia: boolean;
}

export interface IconsProps {
	postData: Post;
}

export interface RetweetOptionsProps {
	retweetPostData: Post | null;
}

export enum EditorTypes {
	WORK_HISTORY = "workHistory",
	BIO = "bio"
}

export interface TipTapEditorProps {
	getEditorContent: (content: string) => void;
	editorFor: EditorTypes;
	showBlockQuoteButton?: boolean;
	showEmojiButton?: boolean;
	showLinkButton?: boolean;
	showTextSizesSelector?: boolean;
	workExperienceDescription?: string;
}

export interface TipTapEditorToolbarProps {
	editor: Editor;
	showBlockQuoteButton: boolean;
	showEmojiButton: boolean;
	showLinkButton: boolean;
	showTextSizesSelector: boolean;
}

export interface MonthsDropDownProps {
	handleMonthSelection: (month: string) => void;
}

export interface YearsDropDownProps {
	handleYearSelection: (year: string) => void;
}

export interface WorkHistoryFormProps {
	hideWorkHistoryForm: () => void;
	workHistoryToEdit: WorkHistory | undefined;
}

export interface ExtendedBioSectionProp {
	isAnotherUserProfile: boolean;
}

export interface CompaniesDropDownProps {
	company: string;
	setCompany: (company: string, companyLogo: string) => void;
}

export interface Logo {
	domain: string;
	logo_url: string;
	name: string;
}

export interface DMRequestFooterProps {
	dmRequestID: string;
	dmRequestData: DMRequest | Conversation;
	currUID: string;
}

export interface ChatBubbleProps {
	you: boolean;
	message: string;
	timestamp: Date;
	isSystem?: boolean;
}

export interface ContactsProps {
	setConvo: (conversation: Conversation) => void;
}

export interface InboxInfoPanelProps {
	conversationData: Conversation | DMRequest;
	showGCRenameModal: (show: boolean) => void;
}

export interface GroupChatTools {
	makeAdmin: (conversationID: string, uid: string) => void;
	leaveGroupChat: (conversationID: string) => void;
	removeUserFromGroupChat: (conversationID: string, uid: string) => void;
	deleteGroupChat: (conversationID: string) => void;
	renameGroupChat: (conversationID: string, newGroupName: string) => void;
}

export interface RenameGCNameModalProps {
	conversationID: string;
	showGCRenameModal: (show: boolean) => void;
}
