import argon2 from "argon2";

const ARGON_OPTIONS = {
  type: argon2.argon2id as 2,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
  hashLength: 32,
};

export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password, ARGON_OPTIONS);
}

export async function verifyPassword(
  hash: string,
  password: string
): Promise<boolean> {
  try {
    return await argon2.verify(hash, password);
  } catch {
    return false;
  }
}