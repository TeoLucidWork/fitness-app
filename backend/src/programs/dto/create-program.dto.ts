import { IsString, IsOptional, IsBoolean, IsInt, IsArray, IsEnum, Min, Max } from 'class-validator';
import { ExerciseDifficulty } from '@prisma/client';

export class CreateProgramDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  clientId?: number;

  @IsOptional()
  @IsBoolean()
  isTemplate?: boolean;

  @IsInt()
  @Min(1)
  @Max(52)
  duration: number; // weeks

  @IsInt()
  @Min(1)
  @Max(7)
  sessionsPerWeek: number;

  @IsEnum(ExerciseDifficulty)
  difficulty: ExerciseDifficulty;

  @IsArray()
  @IsString({ each: true })
  goals: string[]; // ['strength', 'hypertrophy', 'endurance', 'weight_loss']

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}