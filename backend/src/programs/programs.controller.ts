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
  ParseIntPipe,
} from '@nestjs/common';
import { ProgramsService } from './programs.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { CreateProgramSessionDto } from './dto/create-program-session.dto';
import { CreateProgramExerciseDto } from './dto/create-program-exercise.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExerciseDifficulty } from '@prisma/client';

@Controller('programs')
export class ProgramsController {
  constructor(private readonly programsService: ProgramsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body(ValidationPipe) createProgramDto: CreateProgramDto,
    @Request() req
  ) {
    return this.programsService.create(createProgramDto, req.user.id);
  }

  @Get()
  findAll(
    @Query('trainerId', new ParseIntPipe({ optional: true })) trainerId?: number,
    @Query('clientId', new ParseIntPipe({ optional: true })) clientId?: number,
    @Query('isTemplate') isTemplate?: string,
    @Query('difficulty') difficulty?: ExerciseDifficulty,
    @Query('search') search?: string,
  ) {
    return this.programsService.findAll({
      trainerId,
      clientId,
      isTemplate: isTemplate ? isTemplate === 'true' : undefined,
      difficulty,
      search,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-programs')
  getMyPrograms(@Request() req) {
    // For clients, return programs assigned to them
    // For trainers, return programs they created
    return this.programsService.getUserPrograms(req.user.id, req.user.role);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Request() req
  ) {
    const userId = req.user?.id;
    return this.programsService.findOne(id, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(ValidationPipe) updateProgramDto: UpdateProgramDto,
    @Request() req
  ) {
    return this.programsService.update(id, updateProgramDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Request() req
  ) {
    return this.programsService.remove(id, req.user.id);
  }

  // Program Session Management
  @UseGuards(JwtAuthGuard)
  @Post(':id/sessions')
  addSession(
    @Param('id', ParseIntPipe) programId: number,
    @Body(ValidationPipe) createSessionDto: CreateProgramSessionDto,
    @Request() req
  ) {
    return this.programsService.addSession(programId, createSessionDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('sessions/:sessionId')
  updateSession(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Body(ValidationPipe) updateSessionDto: CreateProgramSessionDto,
    @Request() req
  ) {
    return this.programsService.updateSession(sessionId, updateSessionDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('sessions/:sessionId')
  removeSession(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Request() req
  ) {
    return this.programsService.removeSession(sessionId, req.user.id);
  }

  // Program Exercise Management
  @UseGuards(JwtAuthGuard)
  @Post('sessions/:sessionId/exercises')
  addExercise(
    @Param('sessionId', ParseIntPipe) sessionId: number,
    @Body(ValidationPipe) createExerciseDto: CreateProgramExerciseDto,
    @Request() req
  ) {
    return this.programsService.addExerciseToSession(sessionId, createExerciseDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('exercises/:exerciseId')
  updateExercise(
    @Param('exerciseId', ParseIntPipe) exerciseId: number,
    @Body(ValidationPipe) updateExerciseDto: CreateProgramExerciseDto,
    @Request() req
  ) {
    return this.programsService.updateExerciseInSession(exerciseId, updateExerciseDto, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('exercises/:exerciseId')
  removeExercise(
    @Param('exerciseId', ParseIntPipe) exerciseId: number,
    @Request() req
  ) {
    return this.programsService.removeExerciseFromSession(exerciseId, req.user.id);
  }

  // Copy template to create program for client
  @UseGuards(JwtAuthGuard)
  @Post(':templateId/copy/:clientId')
  copyTemplate(
    @Param('templateId', ParseIntPipe) templateId: number,
    @Param('clientId', ParseIntPipe) clientId: number,
    @Request() req
  ) {
    return this.programsService.copyTemplate(templateId, clientId, req.user.id);
  }
}