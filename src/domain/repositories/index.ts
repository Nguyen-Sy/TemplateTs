import userRepository from "./user.repository";

const repositories = {
    user: userRepository,
} as const;

export type Repositories = typeof repositories;
export default repositories;
