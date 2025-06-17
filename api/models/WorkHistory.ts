import { Schema, Types, model } from "mongoose";
import { IWorkHistory } from "../interfaces";

const workHistorySchema = new Schema(
	{
		user: {
			type: Types.ObjectId,
			ref: "User"
		},
		company: {
			type: String
		},
		jobTitle: {
			type: String
		},
		location: {
			type: String
		},
		currentlyWorkingThere: {
			type: Boolean
		},
		startDate: {
			type: String
		},
		endDate: {
			type: String
		},
		description: {
			type: String
		}
	},
	{
		timestamps: true
	}
);

export default model<IWorkHistory>("WorkHistory", workHistorySchema);
