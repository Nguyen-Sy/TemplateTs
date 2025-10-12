import { model, Schema } from "mongoose";

import { BaseModel } from "./base.model";

export type User = {
    name: string;
    email: string;
    password: string;
} & BaseModel;

export const UserSchema = new Schema<User>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        password: { type: String, required: true },
        deletedAt: { type: Date, default: null },
    },
    {
        timestamps: true,
    },
);

export const UserModel = model<User>("User", UserSchema);
