import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptService {
  // Salt rounds for hashing the password.
  private saltRounds = 10;

  /**
   * Gets a password and return it's hash.
   * @param {string} password
   * @returns hash
   */
  public async hash(password: string): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Gets a password and a hash and compare them.
   * @param {string} password
   * @param {string} hash
   * @returns boolean
   */
  public async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
