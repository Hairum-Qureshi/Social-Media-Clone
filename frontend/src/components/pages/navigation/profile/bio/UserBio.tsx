import {
	faArrowLeft,
	faCirclePlus,
	faPencil,
	faTrashCan
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAuthContext from "../../../../../contexts/AuthContext";
import { useEffect, useState } from "react";
import TipTapEditor from "./editor/TipTapEditor";
import useProfile from "../../../../../hooks/useProfile";
import { useLocation, useNavigate } from "react-router-dom";
import { EditorTypes } from "../../../../../interfaces";

export default function UserBio() {
	const { userData } = useAuthContext()!;
	const [showEditor, setEditorVisibility] = useState(false);
	const [showWorkHistory, setShowWorkHistory] = useState(false);
	const [editorContent, setEditorContent] = useState("");
	const { addExtendedBio, deleteExtendedBio } = useProfile();

	const location = useLocation();
	const [pathname, setPathname] = useState(location.pathname.split("/"));

	useEffect(() => {
		setPathname(location.pathname.split("/"));
	}, [location.pathname]);

	function getEditorContent(content: string) {
		setEditorContent(content);
	}

	const navigate = useNavigate();

	// TODO - need to add a character limit for the extended bio

	return (
		<div className="bg-black text-white min-h-screen overflow-auto relative mx-auto w-full">
			<div className="w-full p-2 flex items-center">
				<div
					className="text-xl ml-5 hover:cursor-pointer"
					onClick={() => navigate(-1)}
				>
					<FontAwesomeIcon icon={faArrowLeft} />
				</div>
				<div className="ml-5 flex items-center">
					<img
						src={userData?.profilePicture}
						alt="User profile picture"
						className="w-10 h-10 rounded-full object-cover"
					/>
					<div className="flex flex-col ml-3 text-base">
						<span className="ml-2 font-semibold">{userData?.fullName}</span>
						<span className="ml-2 text-slate-500">@{userData?.username}</span>
					</div>
				</div>
				{pathname[1] === userData?.username && pathname[1] !== "settings" && (
					<div className="ml-auto border border-white rounded-lg p-0.5 w-16 text-center">
						<button onClick={() => setEditorVisibility(true)}>Edit</button>
					</div>
				)}
			</div>
			<div className="w-full p-5">
				<div className="flex items-center">
					<h3 className="font-bold text-2xl">About</h3>
					{showEditor && (
						<h1
							className={`ml-auto text-red-500 ${
								pathname[1] !== userData?.username &&
								pathname[1] === "settings" &&
								"hover:cursor-pointer"
							}`}
							onClick={() => setEditorVisibility(false)}
						>
							Cancel
						</h1>
					)}
				</div>
				{!showEditor ? (
					<div
						className={`bg-gray-800 rounded-md p-3 mt-3 flex  ${
							pathname[1] !== userData?.username &&
							pathname[1] === "settings" &&
							"hover:cursor-pointer"
						}`}
						onClick={() => {
							if (
								pathname[1] === userData?.username &&
								pathname[1] !== "settings"
							) {
								return;
							}

							setEditorVisibility(true);
						}}
					>
						{!userData?.extendedBio && (
							<p className="text-base">Tell us about yourself</p>
						)}
						<div
							className="leading-5
                [&_h1]:text-2xl
                [&_h3]:text-xl [&_h3]:font-bold
                [&_p]:mb-2
                [&_blockquote]:pl-4 [&_blockquote]:border-l-4 [&_blockquote]:border-sky-500 [&_blockquote]:italic [&_blockquote]:text-slate-400
                [&_ul]:list-disc [&_ul]:pl-6
                [&_ol]:list-decimal [&_ol]:pl-6
                [&_li]:mb-1
                [&_a]:text-sky-400 [&_a]:underline [&_a]:hover:text-sky-300 prose prose-invert prose-headings:font-artegra"
							dangerouslySetInnerHTML={{
								__html: userData?.extendedBio || ""
							}}
						/>
						{pathname[1] !== userData?.username &&
							pathname[1] === "settings" && (
								<span className="ml-auto hover:cursor-pointer">
									{userData?.extendedBio &&
										(userData.extendedBio.length > 7 ||
											userData.extendedBio.length > 0) && (
											<>
												<FontAwesomeIcon
													icon={faTrashCan}
													className="mx-3 text-red-600"
													onClick={e => {
														e.preventDefault();
														e.stopPropagation();
														deleteExtendedBio();
													}}
												/>
												<FontAwesomeIcon icon={faPencil} />
											</>
										)}
									{!userData?.extendedBio && (
										<FontAwesomeIcon icon={faCirclePlus} />
									)}
								</span>
							)}
					</div>
				) : (
					<>
						<div className="border border-slate-500 mt-2 rounded-md max-w-full">
							<TipTapEditor
								getEditorContent={getEditorContent}
								editorFor={EditorTypes.BIO}
							/>
						</div>
						<button
							className="w-20 py-1 mt-2 flex items-center justify-center disabled:bg-sky-400 disabled:cursor-not-allowed bg-sky-500 text-white rounded-md ml-auto"
							onClick={() => {
								addExtendedBio(editorContent);
								setEditorVisibility(false);
							}}
							disabled={
								editorContent.length === 0 || editorContent.length === 7
							}
						>
							Save
						</button>
					</>
				)}
			</div>
			<div className="w-full p-5">
				<div className="flex items-center">
					<h3 className="font-bold text-2xl">Work History</h3>
					{showWorkHistory && (
						<h1
							className="ml-auto text-red-500 hover:cursor-pointer"
							onClick={() => setShowWorkHistory(false)}
						>
							Cancel
						</h1>
					)}
				</div>
				{!showWorkHistory ? (
					<div
						className={`bg-gray-800 rounded-md p-3 mt-3 flex ${
							pathname[1] !== userData?.username &&
							pathname[1] === "settings" &&
							"hover:cursor-pointer"
						}`}
						onClick={() =>
							pathname[1] !== userData?.username &&
							pathname[1] === "settings" &&
							setShowWorkHistory(true)
						}
					>
						<p className="text-base">Add experience</p>

						{pathname[1] !== userData?.username &&
							pathname[1] === "settings" && (
								<span className="ml-auto">
									<FontAwesomeIcon icon={faCirclePlus} />
								</span>
							)}
					</div>
				) : (
					<div className="border border-slate-500 mt-2 rounded-md max-w-full">
						<TipTapEditor
							getEditorContent={getEditorContent}
							editorFor={EditorTypes.WORK_HISTORY}
							showBlockQuoteButton={false}
							showEmojiButton={false}
							showLinkButton={false}
							showTextSizesSelector={false}
						/>
					</div>
				)}
			</div>
		</div>
	);
}
