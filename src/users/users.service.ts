import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { user } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) { }

  async findByEmail(email: string): Promise<user | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(user_id: string): Promise<user | null> {
    return this.prisma.user.findUnique({ where: { user_id } });
  }

  async findByGoogleId(google_id: string): Promise<user | null> {
    return this.prisma.user.findUnique({ where: { google_id } });
  }

  async create(data: {
    email: string;
    password?: string;
    name?: string;
    picture?: string;
    google_id?: string;
  }): Promise<user> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return this.prisma.user.create({ data });
  }

  async findOrCreate(profile: {
    id: string;
    emails: { value: string }[];
    displayName?: string;
    photos?: { value: string }[];
  }): Promise<user> {
    const { id, emails, displayName, photos } = profile;
    const email = emails[0].value;
    const picture = photos && photos.length > 0 ? photos[0].value : null;

    let userResult = await this.findByGoogleId(id);
    if (!userResult) {
      userResult = await this.findByEmail(email);
      if (userResult) {
        // update existing user with google_id
        userResult = await this.prisma.user.update({
          where: { email },
          data: { google_id: id, picture, name: displayName },
        });
      } else {
        userResult = await this.create({
          email,
          name: displayName,
          picture: picture ?? undefined,
          google_id: id,
        });
      }
    }
    return userResult;
  }

  async findByResetToken(token: string): Promise<user | null> {
    return this.prisma.user.findFirst({
      where: {
        password_reset_token: token,
        password_reset_expires: {
          gt: new Date(),
        },
      },
    });
  }

  async updateResetToken(userId: string, token: string | null, expires: Date | null): Promise<user> {
    return this.prisma.user.update({
      where: { user_id: userId },
      data: {
        password_reset_token: token,
        password_reset_expires: expires,
      },
    });
  }

  async updatePassword(userId: string, password?: string): Promise<user> {
    let hashedPassword: string | undefined = undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    return this.prisma.user.update({
      where: { user_id: userId },
      data: {
        password: hashedPassword,
        password_reset_token: null,
        password_reset_expires: null,
      },
    });
  }

  async findAll(): Promise<user[]> {
    return this.prisma.user.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async update(userId: string, data: Partial<user>): Promise<user> {
    // Prevent password update through this method for security
    const { password, ...updateData } = data;
    return this.prisma.user.update({
      where: { user_id: userId },
      data: updateData,
    });
  }
}
