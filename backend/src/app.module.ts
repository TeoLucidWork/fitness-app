import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ExercisesModule } from './exercises/exercises.module';
import { ProgramsModule } from './programs/programs.module';
import { WorkoutsModule } from './workouts/workouts.module';
import { WeightModule } from './weight/weight.module';

@Module({
  imports: [PrismaModule, AuthModule, ExercisesModule, ProgramsModule, WorkoutsModule, WeightModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
