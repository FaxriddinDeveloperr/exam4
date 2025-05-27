import {
    Table,
    Column,
    Model,
    DataType,
    ForeignKey,
  } from 'sequelize-typescript';
  
  @Table({ tableName: 'users' })
  export class User extends Model<User> {
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    full_name: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    phone: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
      unique: true,
    })
    email: string;
  
    @Column({
      type: DataType.ENUM('admin', 'user', 'moderator'),
      allowNull: false,
      defaultValue: 'user',
    })
    role: string;
  
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    password: string;
  
    @Column({
      type: DataType.BIGINT,
    })
    region: number;
  }
  