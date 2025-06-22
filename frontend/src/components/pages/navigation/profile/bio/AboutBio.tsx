import { useState } from "react";
import useAuthContext from "../../../../../contexts/AuthContext";
import useProfile from "../../../../../hooks/useProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCirclePlus,
	faPencil,
	faTrashCan
} from "@fortawesome/free-solid-svg-icons";
import TipTapEditor from "./editor/TipTapEditor";
import { EditorTypes, ExtendedBioSectionProp } from "../../../../../interfaces";
import { useLocation } from "react-router-dom";

export default function AboutBio({isAnotherUserProfile}: ExtendedBioSectionProp) {
	const [showEditor, setEditorVisibility] = useState(false);
    const location = useLocation();
	const [pathname] = useState(location.pathname.split("/"));
	const { userData } = useAuthContext()!;
	const [editorContent, setEditorContent] = useState("");

	const { addExtendedBio, deleteExtendedBio, extendedBio } = useProfile();

	function getEditorContent(content: string) {
		setEditorContent(content);
	}

	return (
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
					className={`bg-neutral-900 border border-slate-700 rounded-md p-3 mt-3 flex ${
						pathname[1] !== userData?.username &&
						pathname[1] === "settings" &&
						"hover:cursor-pointer"
					}`}
					onClick={() => {
						if (isAnotherUserProfile) {
							return;
						}

						setEditorVisibility(true);
					}}
				>
					{isAnotherUserProfile && !extendedBio?.extendedBio ? (
						<p className="text-base">
							{extendedBio?.userData.username} currently hasn't written a bio
						</p>
					) : (
						!userData?.extendedBio && (
							<p className="text-base">Tell us about yourself</p>
						)
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
							__html: isAnotherUserProfile
								? extendedBio?.extendedBio || ""
								: userData?.extendedBio || ""
						}}
					/>
					{pathname[1] !== userData?.username && pathname[1] === "settings" && (
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
						disabled={editorContent.length === 0 || editorContent.length === 7}
					>
						Save
					</button>
				</>
			)}
		</div>
	);
}
