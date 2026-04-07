import AppDataSource from "@domain/db/postgres";
import { BaseService } from "@shared/lib/base/service";
import { BadRequestError, NotFoundError } from "@shared/lib/http/httpError";
import { removeNil } from "@shared/utils/object";
import bcrypt from "bcrypt";

import { UserError } from "./user.constants";
import {
    CreateUserRequestDto,
    CreateUserResponseDto,
    DeleteUserRequestDto,
    GetUserByIdRequestDto,
    GetUserByIdResponseDto,
    GetUsersRequestDto,
    GetUsersResponseDto,
    UpdateUserParamsDto,
    UpdateUserRequestDto,
    UpdateUserResponseDto,
} from "./user.dto";

export class UserService extends BaseService {
    createUser = async (
        dto: CreateUserRequestDto,
    ): Promise<CreateUserResponseDto> => {
        const existingUser = await this.repositories.user.findOne({
            where: {
                email: dto.email,
            },
        });
        if (existingUser) {
            throw new BadRequestError(UserError.USER_ALREADY_EXISTS);
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = await AppDataSource.transaction(async (manager) => {
            return this.repositories.user.create(manager, {
                email: dto.email,
                password: hashedPassword,
            });
        });

        return {
            email: user.email,
            id: user.id!,
        };
    };

    deleteUser = async (dto: DeleteUserRequestDto): Promise<void> => {
        const user = await this.repositories.user.findOne({
            select: {
                id: true,
            },
            where: {
                id: dto.id,
            },
        });

        if (!user) {
            throw new NotFoundError(UserError.USER_NOT_FOUND);
        }

        await AppDataSource.transaction(async (manager) => {
            await this.repositories.user.delete(manager, { id: dto.id });
        });
    };

    getUserById = async (
        dto: GetUserByIdRequestDto,
    ): Promise<GetUserByIdResponseDto> => {
        const user = await this.repositories.user.findOne({
            select: {
                email: true,
                id: true,
            },
            where: {
                id: dto.id,
            },
        });

        if (!user) {
            throw new NotFoundError(UserError.USER_NOT_FOUND);
        }

        return user;
    };

    getUsers = async (
        dto: GetUsersRequestDto,
    ): Promise<GetUsersResponseDto> => {
        return this.repositories.user.paginateKeySet(
            {
                select: {
                    email: true,
                    id: true,
                },
                where: removeNil({
                    email: dto.email,
                }),
            },
            dto,
        );
    };

    updateUser = async (
        params: UpdateUserParamsDto,
        dto: UpdateUserRequestDto,
    ): Promise<UpdateUserResponseDto> => {
        const user = await this.repositories.user.findOne({
            where: {
                id: params.id,
            },
        });

        if (!user) {
            throw new NotFoundError(UserError.USER_NOT_FOUND);
        }

        if (dto.email && dto.email !== user.email) {
            const existingUser = await this.repositories.user.findOne({
                where: {
                    email: dto.email,
                },
            });
            if (existingUser && existingUser.id !== params.id) {
                throw new BadRequestError(UserError.USER_ALREADY_EXISTS);
            }
        }

        const updatePayload = removeNil({
            email: dto.email,
            password: dto.password
                ? await bcrypt.hash(dto.password, 10)
                : undefined,
        });

        await AppDataSource.transaction(async (manager) => {
            await this.repositories.user.update(
                manager,
                { id: params.id },
                updatePayload,
            );
        });

        return this.getUserById({ id: params.id });
    };
}

const userService = new UserService();
export default userService;
