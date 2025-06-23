import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	EditorTypes,
	WorkHistoryFormProps
} from "../../../../../../interfaces";
import TipTapEditor from "../editor/TipTapEditor";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import MonthsDropDown from "./dropdowns/MonthsDropDown";
import YearsDropDown from "./dropdowns/YearsDropDown";
import useProfile from "../../../../../../hooks/useProfile";
import CompaniesDropDown from "./dropdowns/CompaniesDropDown";

// TODO - make the drop down for the company close if it can't the logo for the company
// ! BUG: for some reason there's an issue typing in the editor when trying to edit work history

export default function WorkHistoryForm({
	hideWorkHistoryForm,
	workHistoryToEdit
}: WorkHistoryFormProps) {
	const [isCurrentlyWorkingHere, setIsCurrentlyWorkingHere] = useState(false);
	const [jobTitle, setJobTitle] = useState("");
	const [companyName, setCompanyName] = useState("");
	const [location, setLocation] = useState("");
	const [experience, setExperience] = useState("");
	const [showStartMonths, setShowStartMonths] = useState(false);
	const [showEndMonths, setShowEndMonths] = useState(false);
	const [chosenStartMonth, setChosenStartMonth] = useState("");
	const [chosenEndMonth, setChosenEndMonth] = useState("");
	const [selectedStartYear, setSelectedStartYear] = useState<string>(
		new Date().getFullYear().toString()
	);
	const [selectedEndYear, setSelectedEndYear] = useState<string>(
		new Date().getFullYear().toString()
	);
	const [showSelectedStartYear, setShowSelectedStartYear] = useState(false);
	const [showSelectedEndYear, setShowSelectedEndYear] = useState(false);
	const [companyLogo, setCompanyLogo] = useState("");
	const [showCompaniesDropDown, setShowCompaniesDropDown] = useState(false);

	function handleMonthSelection(month: string) {
		if (showStartMonths) {
			setChosenStartMonth(month);
			setShowStartMonths(false);
		}
		if (showEndMonths) {
			setChosenEndMonth(month);
			setShowEndMonths(false);
		}
	}

	function handleYearSelection(year: string) {
		if (showSelectedStartYear) {
			setSelectedStartYear(year);
			setShowSelectedStartYear(false);
		}
		if (showSelectedEndYear) {
			setSelectedEndYear(year);
			setShowSelectedEndYear(false);
		}
	}

	function getEditorContent(content: string) {
		setExperience(content);
	}

	function setCompany(company: string, companyLogo: string) {
		setCompanyName(company);
		setCompanyLogo(companyLogo);
		setShowCompaniesDropDown(false);
	}

	useEffect(() => {
		if (workHistoryToEdit) {
			setJobTitle(workHistoryToEdit.jobTitle);
			setCompanyName(workHistoryToEdit.company);
			setLocation(workHistoryToEdit.location);
			setExperience(workHistoryToEdit.description);
			setChosenStartMonth(workHistoryToEdit.startDate.split(" ")[0]);
			setSelectedStartYear(workHistoryToEdit.startDate.split(" ").pop()!);

			if (workHistoryToEdit.currentlyWorkingThere) {
				setIsCurrentlyWorkingHere(true);
			} else {
				setChosenEndMonth(workHistoryToEdit.endDate.split(" ")[0]);
				setSelectedEndYear(workHistoryToEdit.endDate.split(" ").pop()!);
			}
		}
	}, [workHistoryToEdit]);

	const { addExtendedBioWorkExperience, updateExtendedBioWorkExperience } =
		useProfile();

	return (
		<div className="mt-3 border border-slate-700 p-2 rounded-md bg-zinc-900">
			<h3 className="text-white text-lg font-semibold">
				{workHistoryToEdit ? "Edit Experience" : "Add Experience"}
			</h3>
			<div className="relative mt-6 w-full">
				<input
					type="text"
					id="jobTitle"
					placeholder="Job Title (required)"
					className="peer p-2 w-full rounded-md outline-none border border-slate-500 bg-transparent text-white"
					value={jobTitle}
					onChange={e => setJobTitle(e.target.value)}
				/>
			</div>
			<div className="relative mt-6 w-full">
				<input
					type="text"
					id="company"
					placeholder="Company (required)"
					className="peer p-2 w-full rounded-md outline-none border border-slate-500 bg-transparent text-white"
					value={companyName}
					onChange={e => setCompanyName(e.target.value)}
					onKeyDown={() => setShowCompaniesDropDown(true)}
				/>
				{companyName && showCompaniesDropDown && (
					<CompaniesDropDown company={companyName} setCompany={setCompany} />
				)}
			</div>
			<div className="relative my-6 w-full">
				<input
					type="text"
					id="location"
					placeholder="Location (required)"
					className="peer p-2 w-full rounded-md outline-none border border-slate-500 bg-transparent text-white"
					value={location}
					onChange={e => setLocation(e.target.value)}
				/>
			</div>
			<div className="flex items-center">
				<input
					type="checkbox"
					placeholder="Job Title (required)"
					className="border border-slate-500 w-3.5 h-3.5"
					onChange={() => {
						setIsCurrentlyWorkingHere(!isCurrentlyWorkingHere);
						if (!isCurrentlyWorkingHere && chosenEndMonth) {
							setChosenEndMonth("");
						}
					}}
					checked={isCurrentlyWorkingHere}
				/>
				<label htmlFor="" className="ml-2">
					Currently work here <span className="text-red-600">*</span>
				</label>
			</div>
			<div>
				<div className="w-full mt-4">
					<h3 className="font-semibold text-lg">
						Start Date <span className="text-red-600">*</span>
					</h3>
					<div className="flex mt-3">
						<div className="w-1/2 relative hover:cursor-pointer">
							<div
								className="w-full border border-slate-500 rounded-md flex items-center"
								onClick={() => {
									setShowStartMonths(!showStartMonths);
									if (showEndMonths) setShowEndMonths(false);
								}}
							>
								<div>
									<p className="pl-2 mt-2 text-slate-400 text-sm">Month</p>
									<div className="h-8 flex items-center pl-2 mb-1">
										{chosenStartMonth}
									</div>
								</div>
								<div className="ml-auto pr-2 hover:cursor-pointer">
									<FontAwesomeIcon icon={faChevronDown} />
								</div>
							</div>
							{showStartMonths && (
								<MonthsDropDown handleMonthSelection={handleMonthSelection} />
							)}
						</div>
						<div className="w-1/2 relative hover:cursor-pointer">
							<div
								className="w-full border border-slate-500 rounded-md flex items-center"
								onClick={() => {
									setShowSelectedStartYear(!showSelectedStartYear);
									if (showSelectedEndYear) setShowSelectedEndYear(false);
								}}
							>
								<div>
									<p className="pl-2 mt-2 text-slate-400 text-sm">Year</p>
									<div className="h-8 flex items-center pl-2 mb-1">
										{selectedStartYear}
									</div>
								</div>
								<div className="ml-auto pr-2 hover:cursor-pointer">
									<FontAwesomeIcon icon={faChevronDown} />
								</div>
							</div>
							{showSelectedStartYear && (
								<YearsDropDown handleYearSelection={handleYearSelection} />
							)}
						</div>
					</div>
				</div>
			</div>
			<div>
				<div className="w-full my-4">
					<h3 className="font-semibold text-lg">
						End Date{" "}
						{!isCurrentlyWorkingHere && <span className="text-red-600">*</span>}
					</h3>
					<div className="flex mt-3">
						<div className="w-1/2 relative hover:cursor-pointer">
							<div
								className={`w-full border border-slate-500 rounded-md flex items-center ${
									isCurrentlyWorkingHere && "bg-gray-900"
								}`}
								onClick={() => {
									setShowEndMonths(!showEndMonths);
									if (showStartMonths && !isCurrentlyWorkingHere)
										setShowStartMonths(false);
								}}
							>
								<div>
									<p className="pl-2 mt-2 text-slate-400 text-sm">Month</p>
									<div className="h-8 flex items-center pl-2 mb-1">
										{chosenEndMonth}
									</div>
								</div>
								<div className="ml-auto pr-2 hover:cursor-pointer">
									<FontAwesomeIcon icon={faChevronDown} />
								</div>
							</div>
							{showEndMonths && !isCurrentlyWorkingHere && (
								<MonthsDropDown handleMonthSelection={handleMonthSelection} />
							)}
						</div>
						<div className="w-1/2 relative hover:cursor-pointer">
							<div
								className={`w-full border border-slate-500 rounded-md flex items-center ${
									isCurrentlyWorkingHere && "bg-gray-900"
								}`}
								onClick={() => {
									setShowSelectedEndYear(!showSelectedEndYear);
									if (showSelectedStartYear && !isCurrentlyWorkingHere)
										setShowSelectedStartYear(false);
								}}
							>
								<div>
									<p className="pl-2 mt-2 text-slate-400 text-sm">Year</p>
									<div className="h-8 flex items-center pl-2 mb-1">
										{selectedEndYear}
									</div>
								</div>
								<div className="ml-auto pr-2 hover:cursor-pointer">
									<FontAwesomeIcon icon={faChevronDown} />
								</div>
							</div>
							{showSelectedEndYear && !isCurrentlyWorkingHere && (
								<YearsDropDown handleYearSelection={handleYearSelection} />
							)}
						</div>
					</div>
				</div>
			</div>
			<div>
				<h3 className="font-semibold text-lg">Experience</h3>
				<div className="border border-slate-500 mt-2 rounded-md max-w-full">
					<TipTapEditor
						getEditorContent={getEditorContent}
						editorFor={EditorTypes.WORK_HISTORY}
						showBlockQuoteButton={false}
						showEmojiButton={false}
						showLinkButton={false}
						showTextSizesSelector={false}
						workExperienceDescription={experience}
					/>
				</div>
			</div>
			<div className="flex mt-2">
				{workHistoryToEdit ? (
					<button
						className="p-1 rounded-md bg-sky-500 w-28 ml-auto disabled:bg-sky-800 disabled:cursor-not-allowed"
						onClick={() => {
							updateExtendedBioWorkExperience(
								workHistoryToEdit?._id,
								isCurrentlyWorkingHere,
								jobTitle,
								companyName,
								companyLogo,
								location,
								`${chosenStartMonth} ${selectedStartYear}`,
								`${chosenEndMonth} ${selectedEndYear}`,
								experience
							);
							hideWorkHistoryForm();
						}}
						disabled={
							!jobTitle ||
							!companyName ||
							!location ||
							(!isCurrentlyWorkingHere
								? !chosenEndMonth
								: !chosenStartMonth && !chosenEndMonth)
						}
					>
						Update
					</button>
				) : (
					<button
						className="p-1 rounded-md bg-sky-500 w-28 ml-auto disabled:bg-sky-800 disabled:cursor-not-allowed"
						onClick={() => {
							addExtendedBioWorkExperience(
								isCurrentlyWorkingHere,
								jobTitle,
								companyName,
								companyLogo,
								location,
								`${chosenStartMonth} ${selectedStartYear}`,
								`${chosenEndMonth} ${selectedEndYear}`,
								experience
							);
							hideWorkHistoryForm();
						}}
						disabled={
							!jobTitle ||
							!companyName ||
							!location ||
							(!isCurrentlyWorkingHere
								? !chosenEndMonth
								: !chosenStartMonth && !chosenEndMonth)
						}
					>
						Add
					</button>
				)}
			</div>
		</div>
	);
}
