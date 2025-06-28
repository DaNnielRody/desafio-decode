import { IUserRepository } from '@/infrastructure/repositories/userRepository';

export class UserRepositoryValidationUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async validateUserExists(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
  }

  async validateUserActive(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    if (!user.isActive) {
      throw new Error('User is not active');
    }
  }

  async validateUserEmail(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('User not found with the provided email');
    }
  }

  async validateUnicEmail(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (user) {
      throw new Error('User already exists with the provided email');
    }
  }
}
