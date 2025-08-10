export function formatCurrency(value: number | undefined | null): string {
  if (typeof value === 'number' && !isNaN(value)) {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  }
  return '0 ₫';
}
