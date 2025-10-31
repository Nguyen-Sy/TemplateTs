import { SortEnum } from "@shared/enums";

export type Comparable = number | string;

export type Maybe<T> = Nullable<Optional<T>>;

export type NodeEnv = "DEV" | "PROD" | "STAG";
export type Nullable<T> = null | T;

export type ObjectLiteral = Record<string, unknown>;

export type Optional<T> = T | undefined;
export type Pagination<T> = {
    currentPage: number;
    items: T[];
    limit: number;
    totalPage: number;
};

export type PaginationDto = {
    limit: number;
    orderBy?: string;
    page: number;
    sort?: SortEnum;
};
