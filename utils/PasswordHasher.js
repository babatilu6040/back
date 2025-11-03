import bcrypt from "bcrypt";

export class PasswordHasher {
  // Hash password
  static async hash(password) {
    const saltRounds = 10;
    const hashed = await bcrypt.hash(password, saltRounds);
    return hashed;
  }

  // Compare password
  static async compare(password, hashedPassword) {
    const result = await bcrypt.compare(password, hashedPassword);
    return result;
  }
}
