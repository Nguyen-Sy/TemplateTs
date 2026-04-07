import { KeySetPaginationDto, KeySetPaginationResponse } from "@shared/types";

export interface CreateUserRequestDto {
    email: string;
    password: string;
}

export interface CreateUserResponseDto {
    email: string;
    id: string;
}

export interface DeleteUserRequestDto {
    id: string;
}

export interface GetUserByIdRequestDto {
    id: string;
}

export type GetUserByIdResponseDto = UserResponseDto;

export interface GetUsersRequestDto extends KeySetPaginationDto {
    email?: string;
}

export type GetUsersResponseDto = KeySetPaginationResponse<UserResponseDto>;

export interface UpdateUserParamsDto {
    id: string;
}

export interface UpdateUserRequestDto {
    email?: string;
    password?: string;
}

export type UpdateUserResponseDto = UserResponseDto;

export interface UserResponseDto {
    email: string;
    id: string;
}
