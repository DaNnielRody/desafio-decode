import { CreateUserDTO } from '@/application/dto/createUserDTO';
import { UpdateUserDTO } from '@/application/dto/updateUserDTO';
import { User } from '@/domain/entities/User';

export interface IUserRepository {
  create(user: CreateUserDTO): Promise<User>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, user: UpdateUserDTO): Promise<User | null>;
  delete(id: string): Promise<void>;
}
