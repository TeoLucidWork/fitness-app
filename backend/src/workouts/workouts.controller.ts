import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutLogDto, CreateExerciseLogDto } from './dto/create-workout-log.dto';
import { UpdateWorkoutLogDto, UpdateExerciseLogDto } from './dto/update-workout-log.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('workouts')
@UseGuards(JwtAuthGuard)
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  // Create a new workout log
  @Post('logs')
  create(@Request() req, @Body() createWorkoutLogDto: CreateWorkoutLogDto) {
    return this.workoutsService.createWorkoutLog(req.user.id, createWorkoutLogDto);
  }

  // Get all workout logs for the authenticated user
  @Get('logs')
  findAll(@Request() req) {
    return this.workoutsService.getWorkoutLogs(req.user.id, req.user.role);
  }

  // Get specific workout log
  @Get('logs/:id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.workoutsService.getWorkoutLog(id, req.user.id, req.user.role);
  }

  // Update workout log
  @Patch('logs/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() updateWorkoutLogDto: UpdateWorkoutLogDto,
  ) {
    return this.workoutsService.updateWorkoutLog(id, req.user.id, req.user.role, updateWorkoutLogDto);
  }

  // Delete workout log
  @Delete('logs/:id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.workoutsService.deleteWorkoutLog(id, req.user.id, req.user.role);
  }

  // Add exercise log to existing workout
  @Post('logs/:id/exercises')
  createExerciseLog(
    @Param('id', ParseIntPipe) workoutLogId: number,
    @Body() createExerciseLogDto: CreateExerciseLogDto,
  ) {
    return this.workoutsService.createExerciseLog(workoutLogId, createExerciseLogDto);
  }

  // Update exercise log
  @Patch('exercise-logs/:id')
  updateExerciseLog(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() updateExerciseLogDto: UpdateExerciseLogDto,
  ) {
    return this.workoutsService.updateExerciseLog(id, req.user.id, req.user.role, updateExerciseLogDto);
  }

  // Get workout statistics
  @Get('stats')
  getStats(@Request() req, @Query('clientId') clientId?: string) {
    const clientIdNum = clientId ? parseInt(clientId, 10) : undefined;
    return this.workoutsService.getWorkoutStats(req.user.id, req.user.role, clientIdNum);
  }
}