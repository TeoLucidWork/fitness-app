import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWeightEntryDto } from './dto/create-weight-entry.dto';
import { UpdateWeightEntryDto } from './dto/update-weight-entry.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class WeightService {
  constructor(private prisma: PrismaService) {}

  // Create a new weight entry
  async createWeightEntry(userId: number, createWeightEntryDto: CreateWeightEntryDto) {
    return this.prisma.weightEntry.create({
      data: {
        userId,
        weight: createWeightEntryDto.weight,
        notes: createWeightEntryDto.notes,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
          }
        }
      }
    });
  }

  // Get weight entries for a user (with role-based access)
  async getWeightEntries(userId: number, userRole: string, clientId?: number) {
    let targetUserId = userId;

    // If trainer is requesting entries for a specific client
    if (userRole === UserRole.TRAINER && clientId) {
      // Verify the client belongs to this trainer
      const client = await this.prisma.user.findUnique({
        where: { id: clientId }
      });

      if (!client || client.trainerId !== userId) {
        throw new ForbiddenException('You do not have access to this client\'s data');
      }

      targetUserId = clientId;
    } else if (userRole === UserRole.TRAINER && !clientId) {
      throw new ForbiddenException('Trainer must specify clientId to get weight entries');
    }

    return this.prisma.weightEntry.findMany({
      where: { userId: targetUserId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  // Get specific weight entry
  async getWeightEntry(id: number, userId: number, userRole: string) {
    const weightEntry = await this.prisma.weightEntry.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            trainerId: true,
          }
        }
      }
    });

    if (!weightEntry) {
      throw new NotFoundException('Weight entry not found');
    }

    // Check access permissions
    if (userRole === UserRole.USER && weightEntry.userId !== userId) {
      throw new ForbiddenException('You do not have access to this weight entry');
    }

    if (userRole === UserRole.TRAINER && weightEntry.user.trainerId !== userId) {
      throw new ForbiddenException('You do not have access to this weight entry');
    }

    return weightEntry;
  }

  // Update weight entry (only the owner can update)
  async updateWeightEntry(id: number, userId: number, updateWeightEntryDto: UpdateWeightEntryDto) {
    const existingEntry = await this.prisma.weightEntry.findUnique({
      where: { id }
    });

    if (!existingEntry) {
      throw new NotFoundException('Weight entry not found');
    }

    // Only the owner can update their weight entry
    if (existingEntry.userId !== userId) {
      throw new ForbiddenException('You can only update your own weight entries');
    }

    return this.prisma.weightEntry.update({
      where: { id },
      data: updateWeightEntryDto,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
          }
        }
      }
    });
  }

  // Delete weight entry (only the owner can delete)
  async deleteWeightEntry(id: number, userId: number) {
    const existingEntry = await this.prisma.weightEntry.findUnique({
      where: { id }
    });

    if (!existingEntry) {
      throw new NotFoundException('Weight entry not found');
    }

    // Only the owner can delete their weight entry
    if (existingEntry.userId !== userId) {
      throw new ForbiddenException('You can only delete your own weight entries');
    }

    await this.prisma.weightEntry.delete({
      where: { id }
    });

    return { message: 'Weight entry deleted successfully' };
  }

  // Get weight statistics and progress
  async getWeightStats(userId: number, userRole: string, clientId?: number) {
    let targetUserId = userId;

    // If trainer is requesting stats for a specific client
    if (userRole === UserRole.TRAINER && clientId) {
      // Verify the client belongs to this trainer
      const client = await this.prisma.user.findUnique({
        where: { id: clientId }
      });

      if (!client || client.trainerId !== userId) {
        throw new ForbiddenException('You do not have access to this client\'s data');
      }

      targetUserId = clientId;
    } else if (userRole === UserRole.TRAINER && !clientId) {
      throw new ForbiddenException('Trainer must specify clientId to get weight stats');
    }

    const entries = await this.prisma.weightEntry.findMany({
      where: { userId: targetUserId },
      orderBy: { createdAt: 'asc' }
    });

    if (entries.length === 0) {
      return {
        totalEntries: 0,
        currentWeight: null,
        startingWeight: null,
        weightChange: null,
        lowestWeight: null,
        highestWeight: null,
        averageWeight: null,
        lastUpdated: null,
        trend: null, // 'increasing', 'decreasing', 'stable', or null
      };
    }

    const currentWeight = entries[entries.length - 1].weight;
    const startingWeight = entries[0].weight;
    const weightChange = currentWeight - startingWeight;

    const weights = entries.map(entry => entry.weight);
    const lowestWeight = Math.min(...weights);
    const highestWeight = Math.max(...weights);
    const averageWeight = weights.reduce((sum, weight) => sum + weight, 0) / weights.length;

    // Calculate trend based on last 3 entries
    let trend = null;
    if (entries.length >= 3) {
      const recentEntries = entries.slice(-3);
      const recentWeights = recentEntries.map(e => e.weight);
      const avgRecentChange = (recentWeights[recentWeights.length - 1] - recentWeights[0]) / (recentWeights.length - 1);

      if (avgRecentChange > 0.2) trend = 'increasing';
      else if (avgRecentChange < -0.2) trend = 'decreasing';
      else trend = 'stable';
    }

    return {
      totalEntries: entries.length,
      currentWeight,
      startingWeight,
      weightChange,
      lowestWeight,
      highestWeight,
      averageWeight: Math.round(averageWeight * 100) / 100,
      lastUpdated: entries[entries.length - 1].createdAt,
      trend,
    };
  }

  // Get weight progress over time (for charts)
  async getWeightProgress(userId: number, userRole: string, clientId?: number, days?: number) {
    let targetUserId = userId;

    // If trainer is requesting progress for a specific client
    if (userRole === UserRole.TRAINER && clientId) {
      // Verify the client belongs to this trainer
      const client = await this.prisma.user.findUnique({
        where: { id: clientId }
      });

      if (!client || client.trainerId !== userId) {
        throw new ForbiddenException('You do not have access to this client\'s data');
      }

      targetUserId = clientId;
    } else if (userRole === UserRole.TRAINER && !clientId) {
      throw new ForbiddenException('Trainer must specify clientId to get weight progress');
    }

    const whereClause: any = { userId: targetUserId };

    // Filter by days if specified
    if (days) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      whereClause.createdAt = {
        gte: startDate
      };
    }

    return this.prisma.weightEntry.findMany({
      where: whereClause,
      select: {
        id: true,
        weight: true,
        createdAt: true,
        notes: true,
      },
      orderBy: {
        createdAt: 'asc'
      }
    });
  }
}