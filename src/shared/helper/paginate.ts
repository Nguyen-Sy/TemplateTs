import { SortEnum } from "@shared/enums";
import { Comparable, ObjectLiteral, PaginationDto } from "@shared/types";

export const paginate = (
    items: ObjectLiteral[],
    paginateOption?: PaginationDto,
) => {
    paginateOption = paginateOption ?? { limit: 20, page: 1 };

    const totalPage = Math.ceil(items.length / paginateOption.limit);
    if (paginateOption.orderBy !== undefined) {
        const sort =
            paginateOption.sort?.toLowerCase() === SortEnum.asc ? 1 : -1;

        items = items.sort((a, b) => {
            const key = paginateOption.orderBy as string;
            const aVal = a[key] as Comparable;
            const bVal = b[key] as Comparable;

            if (aVal > bVal) return sort;
            if (aVal < bVal) return -sort;
            return 0;
        });
    }

    items = items.slice(
        (paginateOption.page - 1) * paginateOption.limit,
        paginateOption.page * paginateOption.limit,
    );

    return {
        currentPage: paginateOption.page,
        items,
        limit: paginateOption.limit,
        totalPage,
    };
};
