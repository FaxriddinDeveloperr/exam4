import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({modelName: "Order"})
export class Orders extends Model{
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number

    @Column({
        type: DataType.ENUM("pending","activ","finish"),
        defaultValue: "pending"
    })
    status: string

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    addres: string

}