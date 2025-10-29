export function checkHoneypot(value: string | undefined): boolean {
  return !value || value.trim().length === 0;
}

export function getHoneypotError(): string {
  return "Invalid form submission detected";
}
