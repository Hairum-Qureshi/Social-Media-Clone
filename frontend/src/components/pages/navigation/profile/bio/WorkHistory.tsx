import { useEffect, useState } from "react";
import useProfile from "../../../../../hooks/useProfile";
import { WorkHistory as IWorkHistory } from "../../../../../interfaces";
import { formatDateRange } from "../../../../../utils/formatDateRange";
import useAuthContext from "../../../../../contexts/AuthContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faCirclePlus,
	faPencil,
	faTrashCan
} from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import WorkHistoryForm from "./form/WorkHistoryForm";

export default function WorkHistory() {
	const [showWorkHistory, setShowWorkHistory] = useState(false);
	const location = useLocation();
	const [pathname] = useState(location.pathname.split("/"));
	const [workHistoryIndex, setWorkHistoryIndex] = useState(-1);
	const [workHistoryToEdit, setWorkHistoryToEdit] = useState<
		IWorkHistory | undefined
	>();

	function hideWorkHistoryForm() {
		setShowWorkHistory(false);
	}

	const { extendedBio, deleteWorkExperienceByID } = useProfile();
	const { userData } = useAuthContext()!;

	useEffect(() => {
		const workHistory: IWorkHistory[] | undefined = extendedBio?.workExperience;

		if (workHistory && workHistory.length > 0 && workHistoryIndex !== -1) {
			const toEdit: IWorkHistory = workHistory[workHistoryIndex];
			setWorkHistoryToEdit(toEdit);
		}
	}, [workHistoryIndex]);

	// TODO - make edit work history feature work

	return (
		<div className="w-full p-5">
			<div className="flex items-center">
				<h3 className="font-bold text-2xl">Work History</h3>
				{showWorkHistory && (
					<h1
						className="ml-auto text-red-500 hover:cursor-pointer"
						onClick={() => {
							setShowWorkHistory(false);
							setWorkHistoryIndex(-1);
							setWorkHistoryToEdit(undefined);
						}}
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
								(workExperience: IWorkHistory, index: number) => {
									return (
										<div className="bg-neutral-900 border border-slate-700 rounded-md p-3 mt-3 flex">
											<div className="w-full flex">
												<div className="w-10 h-10 mr-3">
													<img
														src={workExperience.companyLogo}
														alt="Company Logo"
														className="w-10 h-10 object-cover rounded-sm"
													/>
												</div>
												<div>
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
															onClick={() => {
																setShowWorkHistory(true);
																setWorkHistoryIndex(index);
															}}
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
				<WorkHistoryForm
					hideWorkHistoryForm={hideWorkHistoryForm}
					workHistoryToEdit={workHistoryToEdit}
				/>
			)}
		</div>
	);
}
