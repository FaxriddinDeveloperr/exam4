import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({modelName: "Savat"})
export class Savat extends Model{
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    productId: number

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    count: number
}