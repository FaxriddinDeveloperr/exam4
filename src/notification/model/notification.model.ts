import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "src/user/model/user.model";

@Table({modelName: "notifikation"})
export class Notification extends Model{
    @ForeignKey(()=> User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number

    @BelongsTo(()=> User)
    user: User

    @Column({
        type: DataType.STRING,
        defaultValue: "comment"
    })
    type: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    message: string

    @Column({
        type: DataType.BOOLEAN,
        defaultValue: false
    })
    Is_read: boolean

}