import { model, Schema } from "mongoose";

import { BaseModel } from "./base.model";

export type User = {
    email: string;
    name: string;
    password: string;
} & BaseModel;

export const UserSchema = new Schema<User>(
    {
        deletedAt: { default: null, type: Date },
        email: { required: true, type: String },
        name: { required: true, type: String },
        password: { required: true, type: String },
    },
    {
        timestamps: true,
    },
);

export const UserModel = model<User>("User", UserSchema);
