import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isWithinInterval,
  startOfDay,
  isBefore
} from 'date-fns';

export function getMonthDays(currentDate: Date) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 }); // Sunday start
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

  return eachDayOfInterval({
    start: startDate,
    end: endDate
  });
}

export function formatDateStr(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

export function isDateSelected(date: Date, start: Date | null, end: Date | null) {
  if (!start && !end) return false;
  if (start && !end) return isSameDay(date, start);
  
  // Start and end might be inverted if user dragged backwards
  let realStart = start!;
  let realEnd = end!;
  if (isBefore(realEnd, realStart)) {
    realStart = end!;
    realEnd = start!;
  }
  
  return isWithinInterval(startOfDay(date), { start: startOfDay(realStart), end: startOfDay(realEnd) });
}

export function isDateInSelectionRange(date: Date, start: Date | null, end: Date | null) {
    if (!start || !end) return false;
    let realStart = start;
    let realEnd = end;
    if (isBefore(realEnd, realStart)) {
        realStart = end;
        realEnd = start;
    }
    return isWithinInterval(startOfDay(date), { start: startOfDay(realStart), end: startOfDay(realEnd) });
}
