import { IsInt, IsString, IsOptional, IsBoolean, IsArray, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExerciseLogDto {
  @IsInt()
  programExerciseId: number;

  @IsInt()
  @Min(1)
  actualSets: number;

  @IsString()
  actualReps: string; // "8,10,12" - comma separated reps per set

  @IsOptional()
  @IsString()
  actualWeight?: string; // "50,52.5,55" - comma separated weights per set

  @IsOptional()
  @IsInt()
  @Min(0)
  actualRestPeriod?: number; // actual rest taken in seconds

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  actualRpe?: number; // actual RPE 1-10

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;
}

export class CreateWorkoutLogDto {
  @IsInt()
  programSessionId: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number; // 1-5 stars

  @IsOptional()
  @IsBoolean()
  isCompleted?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateExerciseLogDto)
  exerciseLogs?: CreateExerciseLogDto[];
}