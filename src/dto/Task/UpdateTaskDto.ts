import { IsInt, IsOptional, IsString, Length, Min } from "class-validator";

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @Length(3, 100)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  statusId?: number;
}
