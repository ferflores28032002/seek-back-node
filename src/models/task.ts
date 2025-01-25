import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";

import TaskStatus from "./TaskStatus";
import User from "./user";

@Table({
  tableName: "tasks",
  timestamps: true,
})
export class Task extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description!: string;

  @ForeignKey(() => TaskStatus)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  statusId!: number;

  @BelongsTo(() => TaskStatus)
  status!: TaskStatus;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  createdBy!: number;

  @BelongsTo(() => User, { foreignKey: "createdBy" })
  creator!: User;
}

export default Task;
