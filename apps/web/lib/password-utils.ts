export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}

export function generateSecurePassword(options: PasswordOptions): string {
  const charset = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
  };

  let availableChars = "";
  if (options.uppercase) availableChars += charset.uppercase;
  if (options.lowercase) availableChars += charset.lowercase;
  if (options.numbers) availableChars += charset.numbers;
  if (options.symbols) availableChars += charset.symbols;

  if (!availableChars) return "";

  const passwordChars: string[] = [];
  const randomValues = new Uint32Array(options.length);
  crypto.getRandomValues(randomValues);

  for (let i = 0; i < options.length; i++) {
    passwordChars.push(availableChars[randomValues[i] % availableChars.length]);
  }

  return passwordChars.join("");
}

export function getPasswordStrength(password: string): "Weak" | "Medium" | "Strong" {
  if (!password) return "Weak";
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score < 3) return "Weak";
  if (score < 5) return "Medium";
  return "Strong";
}
