import { Types } from "mongoose";

export interface User {
    username: string,
    fullName: string,
    password: string,
    email: string,
    followers: Types.ObjectId[],
    following: Types.ObjectId[],
    profilePicture: string,
    coverImage: string,
    bio: string,
    link: string,
    createdAt: Date,
    updatedAt: Date
}