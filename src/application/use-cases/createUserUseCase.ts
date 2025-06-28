import { User } from '@/domain/entities/User';
import { IUserRepository } from '@/infrastructure/repositories/userRepository';
import { CreateUserDTO } from '../dto/createUserDTO';
import { CryptoProvider } from '@/infrastructure/providers/cryptoProvider';
import { UserRepositoryValidationUseCase } from './userRepositoryValidationUseCase';

export class CreateUserUseCase {
  constructor(
    private readonly userRepositoryValidationUseCase: UserRepositoryValidationUseCase,
    private readonly userRepository: IUserRepository,
    private readonly cryptoProvider: CryptoProvider
  ) {}

  async execute(user: CreateUserDTO): Promise<User> {
    await this.userRepositoryValidationUseCase.validateUnicEmail(user.email);

    const hashedPassword = await this.cryptoProvider.hash(user.password);

    return await this.userRepository.create({
      ...user,
      password: hashedPassword,
    });
  }
}
