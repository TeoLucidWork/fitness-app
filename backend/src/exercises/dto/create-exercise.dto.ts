import { IsString, IsEnum, IsOptional, IsBoolean, IsArray, IsUrl, IsInt } from 'class-validator';
import { ExerciseCategory, ExerciseDifficulty } from '@prisma/client';

export class CreateExerciseDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  nameEn?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(ExerciseCategory)
  category: ExerciseCategory;

  @IsEnum(ExerciseDifficulty)
  difficulty: ExerciseDifficulty;

  @IsArray()
  @IsString({ each: true })
  muscleGroups: string[];

  @IsArray()
  @IsString({ each: true })
  equipment: string[];

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @IsArray()
  @IsString({ each: true })
  instructions: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tips?: string[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsInt()
  createdBy?: number;
}