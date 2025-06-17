import { Request, Response } from "express";
import { Types } from "mongoose";
import sanitizeHtml from "sanitize-html";
import User from "../../../models/User";
import { IUser, IWorkHistory } from "../../../interfaces";
import WorkHistory from "../../../models/WorkHistory";

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

const addExtendedBio = async (req: Request, res: Response): Promise<void> => {
	try {
		const { extendedBioContent } = req.body;
		const currUID: Types.ObjectId = req.user._id;

		if (extendedBioContent.length === 0 || extendedBioContent.length === 7) {
			// the bio is empty (have to use 7 because even if there's no text, there's still <p></p> tags left)
			res.status(400).json({
				message: "Extended bio cannot be empty"
			});
			return;
		}

		const cleanHTML = sanitizeHtml(extendedBioContent, {
			allowedTags: ALLOWED_HTML_TAGS,
			allowedAttributes: {
				a: ["href"]
			}
		});

		const updatedUser = await User.findByIdAndUpdate(
			currUID,
			{
				extendedBio: cleanHTML
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
			"Error in user.ts file, addExtendedBio function controller".red.bold,
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
			currUserData?.extendedBio.length === 0 ||
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
			"Error in user.ts file, addExtendedBio function controller".red.bold,
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
		// TODO - need to add guards such as making sure the user's 'end date' isn't greater than their start date for ex.

		const {
			isCurrentlyWorkingHere,
			jobTitle,
			companyName,
			location,
			startDate,
			endDate,
			experience
		} = req.body;

		const currUID: Types.ObjectId = req.user._id;

		const workHistory: IWorkHistory = await WorkHistory.create({
			user: currUID,
			company: companyName,
			jobTitle,
			location,
			currentlyWorkingThere: isCurrentlyWorkingHere,
			startDate,
			endDate: !isCurrentlyWorkingHere ? endDate : "",
			description: experience
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
			"Error in user.ts file, addExtendedBioWorkExperience function controller"
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

		res.status(201).json({
			extendedBio: userExtendedBio.extendedBio || undefined,
			userData: {
				username: userExtendedBio.username,
				fullName: userExtendedBio.fullName,
				profilePicture: userExtendedBio.profilePicture
			},
			workExperience: userExtendedBio.workHistory || undefined
		});
	} catch (error) {
		console.error(
			"Error in user.ts file, getExtendedBioData function controller".red.bold,
			error
		);
		res.status(500).json({ message: (error as Error).message });
	}
};

export { 	addExtendedBio,
	deleteExtendedBio,
	addExtendedBioWorkExperience,
	getExtendedBioData };
