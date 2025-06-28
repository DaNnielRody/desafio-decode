import { IHashProvider } from '@/infrastructure/providers/hashProvider';
import { hash, compare } from 'bcryptjs';

export class CryptoProvider implements IHashProvider {
  async hash(password: string): Promise<string> {
    return await hash(password, 8);
  }

  async compare(password: string, hashedPassword: string): Promise<boolean> {
    return await compare(password, hashedPassword);
  }
}
