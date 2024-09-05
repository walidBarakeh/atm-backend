export function isValidAmount(amount: string): boolean {
  const regex = /^\d+(\.\d{1,2})?$/;
  return regex.test(amount);
}
