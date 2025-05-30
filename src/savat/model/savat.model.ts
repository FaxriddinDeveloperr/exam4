import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { Product } from "src/product/model/product.entity";
import { User } from "src/user/model/user.model";

@Table({modelName: "Savat"})
export class Savat extends Model{
    @ForeignKey(()=> User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    userId: number

    @BelongsTo(()=> User)
    user: User

    @ForeignKey(()=> Product)
    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    productId: number

    @BelongsTo(()=> Product)
    product: Product

    @Column({
        type: DataType.INTEGER,
        allowNull: false
    })
    count: number


}