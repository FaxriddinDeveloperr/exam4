import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({modelName: "Savat"})
export class Savat extends Model{
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number
}