import userRepo from "./user.repo";

const appRepos = {
    userRepo,
};

export type AppRepos = typeof appRepos;
export default appRepos;
