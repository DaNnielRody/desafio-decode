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
    await this.repository.update(id, user);
    return await this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }
}
