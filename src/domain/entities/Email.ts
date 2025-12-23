export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public getValue(): string {
    return this.value;
  }

  public static create(email: string): Email {
    if (!this.isValid(email)) {
      throw new Error("Invalid email");
    }

    return new Email(email.toLowerCase());
  }

  private static isValid(email: string): boolean {
    // Regex simples e suficiente para 99% dos casos
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}