import { BaseModel } from "@domain/entity/base.model";
import appLogger from "@shared/lib/logger";
import { FilterQuery, Model } from "mongoose";
import { Logger } from "winston";

export abstract class BaseRepo<T extends BaseModel> {
    protected readonly logger: Logger = appLogger.child({
        source: this.constructor.name,
    });
    constructor(protected readonly model: Model<T>) {}

    async create(data: Partial<T> | Partial<T>[]): Promise<T | T[]> {
        const items = await this.model.create(data);
        return items as T | T[];
    }

    async delete(id: string): Promise<null | T> {
        const item = await this.model.findByIdAndUpdate(
            id,
            { deletedAt: new Date() },
            { new: true },
        );
        return item as null | T;
    }

    async find(query: FilterQuery<T>): Promise<T[]> {
        const items = await this.model
            .find({
                deletedAt: { $ne: null },
                ...query,
            })
            .lean();
        return items as T[];
    }

    async findById(id: string): Promise<null | T> {
        const item = await this.model.findById(id);
        if (item?.deletedAt) {
            return null;
        }
        return item;
    }

    async findOne(query: FilterQuery<T>): Promise<null | T> {
        const item = await this.model.findOne(query).lean();
        return item as null | T;
    }

    async hardDelete(id: string): Promise<null | T> {
        const item = await this.model.findByIdAndDelete(id);
        return item as null | T;
    }

    async update(id: string, data: Partial<T>): Promise<null | T> {
        const item = await this.model.findByIdAndUpdate(id, data, {
            new: true,
        });
        return item as null | T;
    }
}
