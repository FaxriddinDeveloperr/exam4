import { Column, DataType, Model, Table } from "sequelize-typescript";


@Table({tableName:'Comment'})
export class Comment extends Model{
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId:number

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    productId:number

    @Column({
        type: DataType.STRING,
        allowNull: false
    })
    message: string

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    star: number
}
