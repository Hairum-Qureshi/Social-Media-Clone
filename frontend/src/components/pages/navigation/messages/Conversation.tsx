import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuthContext from "../../../../contexts/AuthContext";
import getFriend from "../../../../utils/getFriend";
import {
	faCircleInfo,
	faFaceSmile,
	faFilm,
	faImage,
	faPaperPlane
} from "@fortawesome/free-solid-svg-icons";
import getMonthAndYear from "../../../../utils/getMonthAndYear";
import { Link, useLocation } from "react-router-dom";
import { ConversationProps } from "../../../../interfaces";

export default function Conversation({
	defaultSubtext,
	showHeaderText = true,
	conversation
}: ConversationProps) {
	const { userData } = useAuthContext()!;
	const location = useLocation();

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
						<div className="w-full p-2 font-semibold">
							{conversation?.isGroupchat ? (
								<>
									<img
										src={conversation?.groupPhoto}
										alt="User pfp"
										className="w-8 h-8 rounded-full object-cover mr-3"
									/>
									<p>{conversation.groupName}</p>
								</>
							) : (
								<div className="flex items-center">
									<img
										src={
											getFriend(conversation?.users, userData?._id)
												.profilePicture
										}
										alt="User pfp"
										className="w-8 h-8 rounded-full object-cover mr-3"
									/>
									<p>
										{getFriend(conversation?.users, userData?._id).fullName}
									</p>
									<span className="ml-auto text-lg hover:cursor-pointer">
										<FontAwesomeIcon icon={faCircleInfo} />
									</span>
								</div>
							)}
						</div>
						<div className="p-3 border-2 border-white w-full min-h-1/3 h-auto">
							<div className="mt-5">
								<div className="w-full justify-center">
									<div className="flex items-center justify-center">
										<img
											src={
												getFriend(conversation?.users, userData?._id)
													.profilePicture
											}
											alt="User pfp"
											className="w-20 h-20 rounded-full object-cover"
										/>
									</div>
									<Link
										to={`/${
											getFriend(conversation?.users, userData?._id).username
										}`}
									>
										<div className="text-base text-center mt-2 hover:cursor-pointer">
											<p className="font-semibold">
												{getFriend(conversation?.users, userData?._id).fullName}
											</p>
											<p className="text-zinc-500">
												@
												{getFriend(conversation?.users, userData?._id).username}
											</p>
											<p className="my-3">
												{getFriend(conversation?.users, userData?._id).bio}
											</p>
											<p className="text-sm text-zinc-500 mt-2">
												Joined&nbsp;
												{
													getMonthAndYear(
														getFriend(conversation?.users, userData?._id)
															.createdAt
													)?.month
												}
												&nbsp;
												{
													getMonthAndYear(
														getFriend(conversation?.users, userData?._id)
															.createdAt
													)?.year
												}
											</p>
										</div>
									</Link>
								</div>
							</div>
						</div>
					</div>
				)}
			{location.pathname.split("/").length !== 2 &&
				conversation &&
				userData && (
					<div className="w-full relative">
						<div className="absolute bottom-0 border-t-2 border-t-slate-600 w-full p-2">
							<div className="flex mx-1 p-2 bg-zinc-900 rounded-md items-center">
								<div className="text-base text-sky-400 w-24">
									<span className="mr-3 hover:cursor-pointer">
										<FontAwesomeIcon icon={faImage} />
									</span>
									<span className="mr-3 hover:cursor-pointer">
										<FontAwesomeIcon icon={faFilm} />
									</span>
									<span className="hover:cursor-pointer">
										<FontAwesomeIcon icon={faFaceSmile} />
									</span>
								</div>
								<div
									contentEditable="plaintext-only"
									className="w-full ml-2 mr-2 px-2 py-1 min-h-[2rem] break-words resize-none overflow-hidden outline-none rounded"
									onInput={e => {
										const target = e.currentTarget;
										target.style.height = "auto";
										target.style.height =
											Math.min(target.scrollHeight, 160) + "px";
									}}
									data-placeholder="Write a new message"
								/>
								<div className="ml-auto text-sky-500 hover:cursor-pointer">
									<FontAwesomeIcon icon={faPaperPlane} />
								</div>
							</div>
						</div>
					</div>
				)}
		</div>
	);
}
