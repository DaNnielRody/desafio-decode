import { CreateUserDTO } from '@/application/dto/createUserDTO';
import { UpdateUserDTO } from '@/application/dto/updateUserDTO';
import { User } from '@/domain/entities/User';
import { Repository } from 'typeorm';

export interface IUserRepository {
  create(user: CreateUserDTO): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, user: UpdateUserDTO): Promise<User | null>;
  delete(id: string): Promise<void>;
}

export class UserRepository implements IUserRepository {
  constructor(private readonly repository: Repository<User>) {}

  async create(user: CreateUserDTO): Promise<User> {
    const newUser = this.repository.create(user);
    return await this.repository.save(newUser);
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }

  async findById(id: string): Promise<User | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({ where: { email } });
  }

  async update(id: string, user: UpdateUserDTO): Promise<User | null> {
    const updateData: any = {};

    if (user.name !== undefined) updateData.name = user.name;
    if (user.email !== undefined) updateData.email = user.email;
    if (user.password !== undefined) updateData.password = user.password;

    if (Object.keys(updateData).length === 0) {
      return await this.findById(id);
    }

    await this.repository.update(id, updateData);
    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
