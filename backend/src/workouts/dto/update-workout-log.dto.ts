import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkoutLogDto, CreateExerciseLogDto } from './create-workout-log.dto';

export class UpdateWorkoutLogDto extends PartialType(CreateWorkoutLogDto) {}

export class UpdateExerciseLogDto extends PartialType(CreateExerciseLogDto) {}