import { Column, DataType, Model, Table } from "sequelize-typescript";

@Table({
  tableName: "task_statuses",
  timestamps: true,
})
export class TaskStatus extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  color!: string;
}

export default TaskStatus;
