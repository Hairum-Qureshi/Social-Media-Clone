import useAuthContext from "../../../../contexts/AuthContext";
import getFriend from "../../../../utils/getFriend";
import { Link, useLocation } from "react-router-dom";
import { ConversationProps, Message, Status } from "../../../../interfaces";
import { useEffect, useRef, useState } from "react";
import ChatBubble from "./ChatBubble";
import InboxHeader from "./inbox/InboxHeader";
import ProfilePreview from "./inbox/ProfilePreview";
import InboxFooter from "./inbox/InboxFooter";
import useDM from "../../../../hooks/useDM";
import useSocketContext from "../../../../contexts/SocketIOContext";
import DMRequestFooter from "../messages/request-related/DMRequestFooter";

export default function Conversation({
	defaultSubtext,
	showHeaderText = true,
	conversation,
	isDMRequest = false
}: ConversationProps) {
	const { userData } = useAuthContext()!;
	const location = useLocation();
	const [uploadedImage, setUploadedImage] = useState<string>("");
	const contentEditableDivRef = useRef<HTMLDivElement>(null);
	const { activeUsers } = useSocketContext()!;

	// TODO - add GIF functionality
	// TODO - add an upload image functionality
	// TODO - add logic to render out 'M', 'K', etc. if the user has millions or thousands of followers

	function handlePaste(e: React.ClipboardEvent<HTMLDivElement>) {
		const image = e.clipboardData || window.Clipboard;
		const file = image.files[0];
		if (file) {
			const reader = new FileReader();

			reader.onloadend = () => {
				const blob = new Blob([file], { type: file.type });
				const imageURL = URL.createObjectURL(blob);
				if (!uploadedImage) {
					setUploadedImage(imageURL);
				} else {
					alert("You cannot attach more than 1 image per message");
				}
			};
			reader.readAsDataURL(file);
		}
	}

	const { messages } = useDM();

	function deleteImage() {
		setUploadedImage("");
	}

	const bottomDivRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		bottomDivRef?.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	return (
		<div
			className={`${
				location.pathname.split("/").length === 2 && "flex"
			} h-screen`}
		>
			<div className="m-auto w-2/3">
				{location.pathname.split("/").length === 2 && (
					<>
						{showHeaderText && (
							<h2 className="font-bold text-4xl">Select a message</h2>
						)}
						<p className="text-zinc-500 mt-3">{defaultSubtext}</p>
					</>
				)}
			</div>
			{location.pathname.split("/").length !== 2 &&
				conversation &&
				userData && (
					<div className="w-full h-full overflow-y-auto">
						<InboxHeader
							conversation={conversation}
							currUID={userData?._id}
							status={
								activeUsers.includes(
									getFriend(conversation.users, userData?._id)._id
								)
									? Status.Online
									: Status.Offline
							}
						/>
						{!conversation.isGroupchat && (
							<Link
								to={`/${
									getFriend(conversation?.users, userData?._id).username
								}`}
							>
								<ProfilePreview
									conversation={conversation}
									currUID={userData?._id}
								/>
							</Link>
						)}
						<div
							className={`overflow-y-auto ${
								!isDMRequest ? "pb-14" : "pb-48"
							} w-full max-w-full`}
						>
							{messages &&
								messages?.map((message: Message) => {
									return (
										<ChatBubble
											you={message.sender._id === userData?._id}
											message={message.message}
											timestamp={message.createdAt}
										/>
									);
								})}
							<div ref={bottomDivRef}></div>
						</div>
					</div>
				)}

			{conversation && userData && isDMRequest && (
				<DMRequestFooter
					dmRequestID={conversation.messages[0].conversationID}
					dmRequestData={conversation}
					currUID={userData._id}
				/>
			)}

			{location.pathname.split("/").length !== 2 &&
				!isDMRequest &&
				conversation &&
				userData && (
					<InboxFooter
						uploadedImage={uploadedImage}
						deleteImage={deleteImage}
						contentEditableDivRef={contentEditableDivRef}
						handlePaste={handlePaste}
						members={conversation.users}
					/>
				)}
		</div>
	);
}
