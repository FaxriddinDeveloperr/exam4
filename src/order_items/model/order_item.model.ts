import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({modelName: "Order_item"})
export class Order_Item extends Model{
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    orderId: number

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

    @Column({
        type: DataType.DECIMAL,
        allowNull: false
    })
    price_at_order: number
}