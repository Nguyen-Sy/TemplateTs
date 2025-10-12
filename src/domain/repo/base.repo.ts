import { BaseModel } from "@domain/entity/base.model";
import appLogger from "@shared/lib/logger";
import { FilterQuery, Model } from "mongoose";
import { Logger } from "winston";

export abstract class BaseRepo<T extends BaseModel> {
    protected readonly logger: Logger = appLogger.child({
        source: this.constructor.name,
    });
    constructor(protected readonly model: Model<T>) {}

    async findById(id: string): Promise<T | null> {
        const item = await this.model.findById(id);
        if (item?.deletedAt) {
            return null;
        }
        return item;
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

    async findOne(query: FilterQuery<T>): Promise<T | null> {
        const item = await this.model.findOne(query).lean();
        return item as T | null;
    }

    async create(data: Partial<T> | Partial<T>[]): Promise<T | T[]> {
        const items = await this.model.create(data);
        return items as T | T[];
    }

    async update(id: string, data: Partial<T>): Promise<T | null> {
        const item = await this.model.findByIdAndUpdate(id, data, {
            new: true,
        });
        return item as T | null;
    }

    async delete(id: string): Promise<T | null> {
        const item = await this.model.findByIdAndUpdate(
            id,
            { deletedAt: new Date() },
            { new: true },
        );
        return item as T | null;
    }

    async hardDelete(id: string): Promise<T | null> {
        const item = await this.model.findByIdAndDelete(id);
        return item as T | null;
    }
}
