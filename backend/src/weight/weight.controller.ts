import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { WeightService } from './weight.service';
import { CreateWeightEntryDto } from './dto/create-weight-entry.dto';
import { UpdateWeightEntryDto } from './dto/update-weight-entry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('weight')
@UseGuards(JwtAuthGuard)
export class WeightController {
  constructor(private readonly weightService: WeightService) {}

  @Post()
  createWeightEntry(
    @Request() req,
    @Body() createWeightEntryDto: CreateWeightEntryDto,
  ) {
    return this.weightService.createWeightEntry(req.user.id, createWeightEntryDto);
  }

  @Get()
  getWeightEntries(
    @Request() req,
    @Query('clientId') clientId?: string,
  ) {
    const clientIdNum = clientId ? parseInt(clientId, 10) : undefined;
    return this.weightService.getWeightEntries(req.user.id, req.user.role, clientIdNum);
  }

  @Get('stats')
  getWeightStats(
    @Request() req,
    @Query('clientId') clientId?: string,
  ) {
    const clientIdNum = clientId ? parseInt(clientId, 10) : undefined;
    return this.weightService.getWeightStats(req.user.id, req.user.role, clientIdNum);
  }

  @Get('progress')
  getWeightProgress(
    @Request() req,
    @Query('clientId') clientId?: string,
    @Query('days') days?: string,
  ) {
    const clientIdNum = clientId ? parseInt(clientId, 10) : undefined;
    const daysNum = days ? parseInt(days, 10) : undefined;
    return this.weightService.getWeightProgress(req.user.id, req.user.role, clientIdNum, daysNum);
  }

  @Get(':id')
  getWeightEntry(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.weightService.getWeightEntry(id, req.user.id, req.user.role);
  }

  @Patch(':id')
  updateWeightEntry(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() updateWeightEntryDto: UpdateWeightEntryDto,
  ) {
    return this.weightService.updateWeightEntry(id, req.user.id, updateWeightEntryDto);
  }

  @Delete(':id')
  deleteWeightEntry(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
  ) {
    return this.weightService.deleteWeightEntry(id, req.user.id);
  }
}