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
import { EditorTypes, WorkHistory } from "../../../../../interfaces";
import WorkHistoryForm from "./form/WorkHistoryForm";
import { formatDateRange } from "../../../../../utils/formatDateRange";

export default function UserBio() {
	const { userData } = useAuthContext()!;
	const [showEditor, setEditorVisibility] = useState(false);
	const [showWorkHistory, setShowWorkHistory] = useState(false);
	const [editorContent, setEditorContent] = useState("");
	const {
		addExtendedBio,
		deleteExtendedBio,
		extendedBio,
		deleteWorkExperienceByID
	} = useProfile();

	// TODO - add a loading animation when the save button is pressed
	// TODO - make it so that you can click anywhere in the editor and be able to type instead of just the beginning
	// TODO - have it so that if the URL contains another user's username, display their bio; it currently just shows the current user's
	// TODO - need to add elapsed time from start date to end date
	// TODO - need to prevent empty inputs
	// TODO - need to add 'read more' to work history divs
	// ! formatDateRange() function does not work

	const location = useLocation();
	const [pathname, setPathname] = useState(location.pathname.split("/"));
	const pathnameLength = location.pathname.split("/").length;

	useEffect(() => {
		setPathname(location.pathname.split("/"));
	}, [location.pathname]);

	function getEditorContent(content: string) {
		setEditorContent(content);
	}

	const navigate = useNavigate();
	const isAnotherUserProfile: boolean = location.pathname.includes(
		"/settings/bio"
	)
		? false
		: pathnameLength === 3 && pathname[1] !== userData?.username;

	function hideWorkHistoryForm() {
		setShowWorkHistory(false);
	}

	// TODO - need to add a character limit for the extended bio
	// ! Fix issue where the current user is unable to update their extended bio (clicking on the div won't work)

	return (
		<div className="bg-black text-white min-h-screen overflow-auto mx-auto w-full max-w-screen-xl">
			<div className="w-full p-2 flex items-center">
				<div
					className="text-xl ml-5 hover:cursor-pointer"
					onClick={() => navigate(-1)}
				>
					<FontAwesomeIcon icon={faArrowLeft} />
				</div>
				<div className="ml-5 flex items-center">
					<img
						src={
							isAnotherUserProfile
								? extendedBio?.userData?.profilePicture
								: userData?.profilePicture
						}
						alt="User profile picture"
						className="w-10 h-10 rounded-full object-cover"
					/>
					<div className="flex flex-col ml-3 text-base">
						<span className="ml-2 font-semibold">
							{isAnotherUserProfile && extendedBio
								? extendedBio?.userData?.fullName
								: userData?.fullName}
						</span>
						<span className="ml-2 text-slate-500">
							@
							{isAnotherUserProfile && extendedBio
								? extendedBio?.userData?.username
								: userData?.username}
						</span>
					</div>
				</div>
				{pathname[1] === userData?.username && pathname[1] !== "settings" && (
					<div className="ml-auto border border-white rounded-lg p-0.5 w-16 text-center">
						<button
							onClick={() => !isAnotherUserProfile && setEditorVisibility(true)}
						>
							Edit
						</button>
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
						{pathnameLength === 3 &&
						pathname[1] !== userData?.username &&
						!extendedBio?.extendedBio ? (
							<p className="text-base">
								{pathname[1]} currently hasn't written a bio
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
					<>
						<div>
							{extendedBio?.workExperience &&
								extendedBio?.workExperience.length > 0 &&
								extendedBio.workExperience.map(
									(workExperience: WorkHistory) => {
										return (
											<div className="bg-neutral-900 border border-slate-700 rounded-md p-3 mt-3 flex">
												<div className="w-full">
													<p className="font-semibold">
														{workExperience.jobTitle}
													</p>
													<p className="text-sm text-zinc-400">
														{workExperience.company}&nbsp;·&nbsp;
														{workExperience.location}
													</p>
													<p className="text-sm text-zinc-400">
														{workExperience.startDate}&nbsp;-&nbsp;
														{!workExperience.endDate
															? "Present"
															: workExperience.endDate}
														{workExperience.endDate && (
															<p>
																{formatDateRange(
																	workExperience.startDate.toString(),
																	workExperience.endDate.toString()
																)}
															</p>
														)}
													</p>
													<div
														className="text-sm mt-1"
														dangerouslySetInnerHTML={{
															__html: workExperience.description
														}}
													></div>
												</div>
												{location.pathname.includes("settings") &&
													extendedBio?.userData.username ===
														userData?.username && (
														<div className="ml-auto flex">
															<FontAwesomeIcon
																icon={faTrashCan}
																className="mx-3 text-red-600 hover:cursor-pointer"
																onClick={() =>
																	deleteWorkExperienceByID(workExperience._id)
																}
															/>
															<FontAwesomeIcon
																icon={faPencil}
																className="hover:cursor-pointer"
															/>
														</div>
													)}
											</div>
										);
									}
								)}
						</div>
						<div
							className={`bg-neutral-900 border border-slate-700 rounded-md p-3 mt-3 flex ${
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
					</>
				) : (
					<WorkHistoryForm hideWorkHistoryForm = {hideWorkHistoryForm} />
				)}
			</div>
		</div>
	);
}
