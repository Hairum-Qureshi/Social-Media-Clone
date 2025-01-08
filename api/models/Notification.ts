import { Schema, Types, model } from "mongoose";
import { INotification } from "../interfaces";

const notificationSchema = new Schema(
	{
		from: {
			type: Types.ObjectId,
			ref: "User",
			required: true
		},
		to: {
			type: Types.ObjectId,
			ref: "User",
			required: true
		},
        notifType: {
            type: String,
            required: true,
            enum: ["LIKE", "COMMENT", "FOLLOW", "MESSAGE"]
        },
        read: {
            type: Boolean,
            default: false
        }
	},
	{
		timestamps: true
	}
);

export default model<INotification>("Notification", notificationSchema);
