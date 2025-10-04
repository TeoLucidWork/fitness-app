import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserRole } from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { CreateClientDto } from './dto/create-client.dto';
import { AuthResponse } from './interfaces/auth-response.interface';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  private generateSalt(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password + salt, saltRounds);
  }

  private async validatePassword(
    password: string,
    hashedPassword: string,
    salt: string,
  ): Promise<boolean> {
    return bcrypt.compare(password + salt, hashedPassword);
  }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const {
      email,
      password,
      firstName,
      lastName,
      role = UserRole.USER,
    } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Generate salt and hash password
    const salt = this.generateSalt();
    const hashedPassword = await this.hashPassword(password, salt);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        username: email, // Use email as username
        password: hashedPassword,
        salt,
        firstName,
        lastName,
        role,
      },
    });

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await this.validatePassword(
      password,
      user.password,
      user.salt,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (
      user &&
      (await this.validatePassword(password, user.password, user.salt))
    ) {
      const { password: _, salt: __, ...result } = user;
      return result;
    }
    return null;
  }

  async createClient(createClientDto: CreateClientDto, trainerId: number): Promise<User> {
    // Verify trainer role
    const trainer = await this.prisma.user.findUnique({
      where: { id: trainerId },
    });

    if (!trainer || trainer.role !== UserRole.TRAINER) {
      throw new ForbiddenException('Only trainers can create clients');
    }

    const {
      email,
      password,
      firstName,
      lastName,
    } = createClientDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Generate salt and hash password
    const salt = this.generateSalt();
    const hashedPassword = await this.hashPassword(password, salt);

    // Create user with USER role (client)
    const user = await this.prisma.user.create({
      data: {
        email,
        username: email, // Use email as username
        password: hashedPassword,
        salt,
        firstName,
        lastName,
        role: UserRole.USER,
      },
    });

    // Return user without password and salt
    const { password: _, salt: __, ...result } = user;
    return result as User;
  }

  async getTrainerClients(trainerId: number): Promise<Pick<User, 'id' | 'email' | 'username' | 'firstName' | 'lastName' | 'role' | 'createdAt'>[]> {
    // Verify trainer role
    const trainer = await this.prisma.user.findUnique({
      where: { id: trainerId },
    });

    if (!trainer || trainer.role !== UserRole.TRAINER) {
      throw new ForbiddenException('Only trainers can view clients');
    }

    // For now, get all users with role USER as potential clients
    // In the future, this could be expanded to show only assigned clients
    const clients = await this.prisma.user.findMany({
      where: {
        role: UserRole.USER,
      },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return clients;
  }

  async generateRegistrationToken(trainerId: number): Promise<{ token: string; expiresAt: Date; link: string }> {
    // Verify trainer role
    const trainer = await this.prisma.user.findUnique({
      where: { id: trainerId },
    });

    if (!trainer || trainer.role !== UserRole.TRAINER) {
      throw new ForbiddenException('Only trainers can generate registration links');
    }

    // Generate unique token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Token expires in 7 days

    // Save token to database
    await this.prisma.registrationToken.create({
      data: {
        token,
        trainerId,
        expiresAt,
      },
    });

    // Generate registration link
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const link = `${baseUrl}/register?token=${token}`;

    return { token, expiresAt, link };
  }

  async registerWithToken(registerDto: RegisterDto, token: string): Promise<AuthResponse> {
    // Validate token
    const registrationToken = await this.prisma.registrationToken.findUnique({
      where: { token },
      include: { trainer: true },
    });

    if (!registrationToken) {
      throw new UnauthorizedException('Invalid registration token');
    }

    if (registrationToken.isUsed) {
      throw new UnauthorizedException('Registration token has already been used');
    }

    if (new Date() > registrationToken.expiresAt) {
      throw new UnauthorizedException('Registration token has expired');
    }

    const { email, password, firstName, lastName } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Generate salt and hash password
    const salt = this.generateSalt();
    const hashedPassword = await this.hashPassword(password, salt);

    // Create user with trainer assignment
    const user = await this.prisma.user.create({
      data: {
        email,
        username: email, // Use email as username
        password: hashedPassword,
        salt,
        firstName,
        lastName,
        role: UserRole.USER,
        trainerId: registrationToken.trainerId, // Auto-assign to trainer
      },
    });

    // Mark token as used
    await this.prisma.registrationToken.update({
      where: { id: registrationToken.id },
      data: {
        isUsed: true,
        usedById: user.id,
      },
    });

    // Generate JWT token
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    };
  }

  async getRegistrationTokens(trainerId: number): Promise<any[]> {
    // Verify trainer role
    const trainer = await this.prisma.user.findUnique({
      where: { id: trainerId },
    });

    if (!trainer || trainer.role !== UserRole.TRAINER) {
      throw new ForbiddenException('Only trainers can view registration tokens');
    }

    return this.prisma.registrationToken.findMany({
      where: { trainerId },
      include: {
        usedBy: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getClientDetails(trainerId: number, clientId: number): Promise<any> {
    // Verify trainer role
    const trainer = await this.prisma.user.findUnique({
      where: { id: trainerId },
    });

    if (!trainer || trainer.role !== UserRole.TRAINER) {
      throw new ForbiddenException('Only trainers can view client details');
    }

    // Get client info
    const client = await this.prisma.user.findUnique({
      where: { id: clientId },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    });

    if (!client) {
      throw new ForbiddenException('Client not found');
    }

    // Verify client belongs to this trainer
    if (client.role !== UserRole.USER) {
      throw new ForbiddenException('Invalid client');
    }

    // Get weight entries
    const weightEntries = await this.prisma.weightEntry.findMany({
      where: { userId: clientId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Get weight stats
    const latestWeight = weightEntries.length > 0 ? weightEntries[0].weight : null;
    const initialWeight = weightEntries.length > 0 ? weightEntries[weightEntries.length - 1].weight : null;
    const weightChange = latestWeight && initialWeight ? latestWeight - initialWeight : null;

    // Get workout stats
    const workoutLogs = await this.prisma.workoutLog.findMany({
      where: { userId: clientId },
      include: {
        programSession: {
          select: {
            name: true,
            program: {
              select: { name: true }
            }
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const completedWorkouts = workoutLogs.filter(log => log.isCompleted).length;
    const totalWorkouts = workoutLogs.length;

    // Get assigned programs
    const programs = await this.prisma.program.findMany({
      where: { clientId },
      include: {
        sessions: {
          include: {
            exercises: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      client,
      weight: {
        latest: latestWeight,
        initial: initialWeight,
        change: weightChange,
        entries: weightEntries,
      },
      workouts: {
        total: totalWorkouts,
        completed: completedWorkouts,
        recentLogs: workoutLogs.slice(0, 5),
      },
      programs: programs.map(p => ({
        id: p.id,
        name: p.name,
        description: p.description,
        sessionsCount: p.sessions.length,
        createdAt: p.createdAt,
      })),
    };
  }
}
