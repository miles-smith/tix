import bcrypt from 'bcrypt';

const saltRounds = 10;

export class Password {
  static async toHash(plainText: string) {
    return bcrypt.hash(plainText, saltRounds);
  }

  static async compare(cypherText: string, plainText: string) {
    return bcrypt.compare(plainText, cypherText);
  }
}
