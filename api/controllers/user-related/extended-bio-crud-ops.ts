import { Request, Response } from "express";
import { Types } from "mongoose";
import User from "../../models/User";
import { IUser, IWorkHistory } from "../../interfaces";
import WorkHistory from "../../models/WorkHistory";
import { sanitizeEditorContent } from "../../utils/sanitizeHTML";
import { extendedBioChecks } from "../../utils/extendedBioChecks";

const addExtendedBio = async (req: Request, res: Response): Promise<void> => {
	try {
		const { extendedBioContent } = req.body;
		const currUID: Types.ObjectId = req.user._id;

		const ALLOWED_HTML_TAGS = [
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6",
			"blockquote",
			"li",
			"ol",
			"p",
			"ul",
			"a",
			"b",
			"br",
			"em",
			"i",
			"s",
			"strong",
			"u"
		];

		if (!extendedBioContent.length || extendedBioContent.length === 7) {
			// the bio is empty (have to use 7 because even if there's no text, there's still <p></p> tags left)
			res.status(400).json({
				message: "Extended bio cannot be empty"
			});
			return;
		}

		const sanitizedHTML: string = sanitizeEditorContent(
			extendedBioContent,
			ALLOWED_HTML_TAGS,
			true
		);

		const updatedUser = await User.findByIdAndUpdate(
			currUID,
			{
				extendedBio: sanitizedHTML
			},
			{
				new: true
			}
		).select("-password -__v");

		res.status(200).json({
			updatedUser
		});
	} catch (error) {
		console.error(
			"Error in extended-bio-crud-ops.ts file,  addExtendedBio function controller"
				.red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

const deleteExtendedBio = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const currUID: Types.ObjectId = req.user._id;
		const currUserData: IUser = (await User.findOne({ _id: currUID })) as IUser;

		if (
			!currUserData?.extendedBio ||
			!currUserData?.extendedBio.length ||
			currUserData?.extendedBio.length === 7
		) {
			res.status(400).json({ message: "Extended bio is already empty" });
			return;
		}

		const updatedUser = await User.findByIdAndUpdate(
			currUID,
			{
				extendedBio: ""
			},
			{
				new: true
			}
		).select("-password -__v");

		res.status(200).json({
			updatedUser
		});
	} catch (error) {
		console.error(
			"Error in extended-bio-crud-ops.ts file,  addExtendedBio function controller"
				.red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

const addExtendedBioWorkExperience = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const {
			isCurrentlyWorkingHere,
			jobTitle,
			companyName,
			companyLogo,
			location,
			startDate,
			endDate,
			experience
		} = req.body;

		const { errorExists, statusCode, errorMessage } = extendedBioChecks(
			jobTitle,
			companyName,
			location,
			startDate,
			isCurrentlyWorkingHere,
			endDate,
			res
		);

		if (errorExists) {
			res.status(statusCode).json({ message: errorMessage });
			return;
		}

		const ALLOWED_TAGS = [
			"p",
			"b",
			"br",
			"em",
			"i",
			"s",
			"strong",
			"u",
			"ol",
			"ul"
		];

		const sanitizedHTML: string = sanitizeEditorContent(
			experience,
			ALLOWED_TAGS,
			false
		);

		const currUID: Types.ObjectId = req.user._id;

		const workHistory: IWorkHistory = await WorkHistory.create({
			user: currUID,
			company: companyName,
			companyLogo:
				!companyLogo.trim() || !companyLogo
					? `${process.env.BACKEND_URL}/assets/no-logo.jpg`
					: companyLogo,
			jobTitle,
			location,
			currentlyWorkingThere: isCurrentlyWorkingHere,
			startDate,
			endDate: !isCurrentlyWorkingHere ? endDate : "",
			description: sanitizedHTML
		});

		const updatedUser: IUser = (await User.findByIdAndUpdate(
			currUID,
			{
				$push: { workHistory: workHistory._id }
			},
			{
				new: true
			}
		)) as IUser;

		res.status(201).json(updatedUser);
	} catch (error) {
		console.error(
			"Error in extended-bio-crud-ops.ts file, addExtendedBioWorkExperience function controller"
				.red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

const deleteExtendedBioWorkExperience = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { workExperienceID } = req.params;
		const currUID: Types.ObjectId = req.user._id;

		await User.findByIdAndUpdate(currUID, {
			$pull: {
				workHistory: workExperienceID
			}
		});

		await WorkHistory.findByIdAndDelete({
			_id: workExperienceID
		});

		res.status(200).json({ message: "Work Experience deleted" });
	} catch (error) {
		console.error(
			"Error in extended-bio-crud-ops.ts file, deleteExtendedBioWorkExperience function controller"
				.red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

const getExtendedBioData = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { username } = req.params;

		const user: IUser | null = await User.findOne({ username });

		if (!user) {
			res.status(404).json({ message: "User not found" });
			return;
		}

		const userExtendedBio: IUser = (await User.findOne({ username }).populate(
			"workHistory"
		)) as IUser;

		const sortedWorkExp =
			userExtendedBio.workHistory.length > 0
				? [...userExtendedBio.workHistory].sort(
						(a: IWorkHistory, b: IWorkHistory) =>
							b.createdAt.getTime() - a.createdAt.getTime()
				  )
				: [];

		res.status(201).json({
			extendedBio: userExtendedBio.extendedBio || undefined,
			userData: {
				username: userExtendedBio.username,
				fullName: userExtendedBio.fullName,
				profilePicture: userExtendedBio.profilePicture
			},
			workExperience: sortedWorkExp || []
		});
	} catch (error) {
		console.error(
			"Error in extended-bio-crud-ops.ts file, getExtendedBioData function controller"
				.red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

const editExtendedBioWorkExperience = async (
	req: Request,
	res: Response
): Promise<void> => {
	try {
		const { workExperienceID } = req.params;

		const {
			isCurrentlyWorkingHere,
			jobTitle,
			companyName,
			companyLogo,
			location,
			startDate,
			endDate,
			experience
		} = req.body;

		const { errorExists, statusCode, errorMessage } = extendedBioChecks(
			jobTitle,
			companyName,
			location,
			startDate,
			isCurrentlyWorkingHere,
			endDate,
			res
		);

		if (errorExists) {
			res.status(statusCode).json({ message: errorMessage });
			return;
		}

		const logo = await WorkHistory.findById({ _id: workExperienceID }).select(
			"companyLogo"
		);

		const updatedWorkHistory: IWorkHistory =
			(await WorkHistory.findByIdAndUpdate(
				workExperienceID,
				{
					isCurrentlyWorkingHere,
					jobTitle,
					companyName,
					companyLogo: !companyLogo
						? logo?.companyLogo
						: companyLogo || `${process.env.BACKEND_URL}/assets/no-logo.jpg`,
					location,
					startDate,
					endDate,
					experience
				},
				{
					new: true
				}
			)) as IWorkHistory;

		res.status(200).json(updatedWorkHistory);
		return;
	} catch (error) {
		console.error(
			"Error in extended-bio-crud-ops.ts file, editExtendedBioWorkExperience function controller"
				.red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

export {
	addExtendedBio,
	deleteExtendedBio,
	addExtendedBioWorkExperience,
	deleteExtendedBioWorkExperience,
	getExtendedBioData,
	editExtendedBioWorkExperience
};
