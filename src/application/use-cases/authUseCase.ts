import { User } from '@/domain/entities/User';
import { IUserRepository } from '@/infrastructure/repositories/userRepository';
import { CryptoProvider } from '@/infrastructure/providers/cryptoProvider';
import { LoginDTO } from '../dto/loginDTO';
import { UserRepositoryValidationUseCase } from './userRepositoryValidationUseCase';

export class AuthUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userRepositoryValidationUseCase: UserRepositoryValidationUseCase,
    private readonly cryptoProvider: CryptoProvider
  ) {}

  async execute(data: LoginDTO): Promise<User> {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepositoryValidationUseCase.validateUserActive(user.id);

    const passwordMatch = await this.cryptoProvider.compare(data.password, user.password);

    if (!passwordMatch) {
      throw new Error('Invalid password');
    }

    return user;
  }
}
