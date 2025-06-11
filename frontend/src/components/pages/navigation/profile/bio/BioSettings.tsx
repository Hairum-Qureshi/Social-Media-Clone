import {
	faArrowLeft,
	faCirclePlus,
	faTrashCan
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../../../../../contexts/AuthContext";
import { useState } from "react";
import TipTapEditor from "./TipTapEditor";
import useProfile from "../../../../../hooks/useProfile";

export default function BioSettings() {
	const navigate = useNavigate();
	const { userData } = useAuthContext()!;
	const [showEditor, setEditorVisibility] = useState(false);
	const [editorContent, setEditorContent] = useState("");
	const { addExtendedBio, deleteExtendedBio } = useProfile();

	function getEditorContent(content: string) {
		setEditorContent(content);
	}

	console.log(editorContent.length, editorContent);

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
			</div>
			<div className="w-full p-5">
				<div className="flex items-center">
					<h3 className="font-bold text-2xl">About</h3>
					{showEditor && (
						<h1
							className="ml-auto text-red-500 hover:cursor-pointer"
							onClick={() => setEditorVisibility(false)}
						>
							Cancel
						</h1>
					)}
				</div>
				{!showEditor ? (
					<div
						className="bg-gray-800 rounded-md p-3 mt-3 flex hover:cursor-pointer"
						onClick={() => setEditorVisibility(true)}
					>
						{!userData?.extendedBio && (
							<p className="text-base">Tell us about yourself</p>
						)}
						<div
							className="leading-5
                [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4
                [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mb-4
                [&_p]:mb-2
                [&_blockquote]:pl-4 [&_blockquote]:border-l-4 [&_blockquote]:border-sky-500 [&_blockquote]:italic [&_blockquote]:text-slate-400
                [&_ul]:list-disc [&_ul]:pl-6
                [&_ol]:list-decimal [&_ol]:pl-6
                [&_li]:mb-1
                [&_a]:text-sky-400 [&_a]:underline [&_a]:hover:text-sky-300"
							dangerouslySetInnerHTML={{
								__html: userData?.extendedBio || ""
							}}
						/>
						<span className="ml-auto hover:cursor-pointer">
							{userData?.extendedBio && userData?.extendedBio?.length > 7 && (
								<FontAwesomeIcon
									icon={faTrashCan}
									className="mr-3 text-red-600"
									onClick={e => {
										e.preventDefault();
										e.stopPropagation();
										deleteExtendedBio();
									}}
								/>
							)}
							<FontAwesomeIcon icon={faCirclePlus} />
						</span>
					</div>
				) : (
					<>
						<div className="border border-slate-500 mt-2 rounded-md max-w-full">
							<TipTapEditor getEditorContent={getEditorContent} />
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
				<h3 className="font-bold text-2xl">Work History</h3>
				<div className="bg-gray-800 rounded-md p-3 mt-3 flex">
					<p className="text-base">Add experience</p>

					<span className="ml-auto">
						<FontAwesomeIcon icon={faCirclePlus} />
					</span>
				</div>
			</div>
		</div>
	);
}
