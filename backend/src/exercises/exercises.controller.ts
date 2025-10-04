import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  UseGuards,
  Request,
  ValidationPipe,
  ParseIntPipe
} from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { CreateExerciseDto } from './dto/create-exercise.dto';
import { UpdateExerciseDto } from './dto/update-exercise.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExerciseCategory, ExerciseDifficulty } from '@prisma/client';

@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body(ValidationPipe) createExerciseDto: CreateExerciseDto,
    @Request() req
  ) {
    return this.exercisesService.create(createExerciseDto, req.user.id);
  }

  @Get()
  findAll(
    @Query('category') category?: ExerciseCategory,
    @Query('difficulty') difficulty?: ExerciseDifficulty,
    @Query('muscleGroup') muscleGroup?: string,
    @Query('search') search?: string,
  ) {
    return this.exercisesService.findAll({
      category,
      difficulty,
      muscleGroup,
      search,
    });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.exercisesService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateExerciseDto: UpdateExerciseDto,
    @Request() req
  ) {
    return this.exercisesService.update(id, updateExerciseDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.exercisesService.remove(id, req.user.id);
  }
}