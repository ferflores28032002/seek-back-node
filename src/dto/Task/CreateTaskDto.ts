import { IsInt, IsString, Length, Min } from "class-validator";

export class CreateTaskDto {
  @IsString()
  @Length(3, 100)
  title!: string;

  @IsString()
  @Length(0, 500)
  description!: string;

  @IsInt()
  @Min(1)
  statusId!: number;
}
