import { format, isThisYear } from 'date-fns';

export function formatDate(date: Date | string) {
  let formatString = isThisYear(date) ? 'MMMM dd' : 'MMMM dd, yyyy';
  return format(date, formatString);
}

export function formatDateDMY(date: Date | string) {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
