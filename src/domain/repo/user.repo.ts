import { User, UserModel } from "@domain/entity/user.model";

import { BaseRepo } from "./base.repo";

export class UserRepo extends BaseRepo<User> {
    constructor() {
        super(UserModel);
    }
}

const userRepo = new UserRepo();

export default userRepo;
