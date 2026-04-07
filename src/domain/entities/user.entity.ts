import { Column, Entity, Index, Unique } from "typeorm";

import { BaseEntityWithUUID } from "./base";

@Entity({
    name: "users",
})
@Index(["email"])
@Unique(["email"])
export class UserEntity extends BaseEntityWithUUID {
    @Column({
        length: 255,
        type: "varchar",
        unique: true,
    })
    email!: string;

    @Column({
        length: 255,
        type: "varchar",
    })
    firstName?: string;

    @Column({
        nullable: true,
        type: "timestamp with time zone",
    })
    lastLoginAt?: Date;

    @Column({
        length: 255,
        type: "varchar",
    })
    lastName?: string;

    @Column({
        length: 255,
        type: "varchar",
    })
    password!: string;
}
