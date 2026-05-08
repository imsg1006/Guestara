import type { Booking, DayOccupancy } from '../types/booking';
import { parseISO, eachDayOfInterval, format, isBefore } from 'date-fns';

export function calculateOccupancy(bookings: Booking[]): Record<string, DayOccupancy> {
  const occupancyMap: Record<string, DayOccupancy> = {};

  bookings.forEach(booking => {
    // Skip cancelled
    if (booking.status === 'cancelled') return;

    const checkInDate = parseISO(booking.checkIn);
    const checkOutDate = parseISO(booking.checkOut);

    // If checkIn is same as or after checkOut, skip or handle as error. 
    // Usually it's strictly before.
    if (!isBefore(checkInDate, checkOutDate)) return;

    // We get all days from checkIn to the day *before* checkOut
    // date-fns eachDayOfInterval is inclusive on both ends, so we need to be careful.
    // Instead of doing math, we can just iterate the interval, and skip the last day.
    const days = eachDayOfInterval({ start: checkInDate, end: checkOutDate });

    // Exclude the checkout day for occupancy, unless check-in is same as check-out (not valid normally, but handled above)
    const stayDays = days.slice(0, days.length - 1);

    stayDays.forEach(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      
      if (!occupancyMap[dateStr]) {
        occupancyMap[dateStr] = {
          date: dateStr,
          occupancyCount: 0,
          overlappingBookings: []
        };
      }
      
      occupancyMap[dateStr].occupancyCount += 1;
      occupancyMap[dateStr].overlappingBookings.push(booking);
    });
  });

  return occupancyMap;
}

export function getBookingsForRange(bookings: Booking[], start: Date | null, end: Date | null): Booking[] {
  if (!start) return [];
  
  let realStart = start;
  let realEnd = end || start;
  
  if (isBefore(realEnd, realStart)) {
    realStart = end!;
    realEnd = start;
  }

  // To find if a booking overlaps with the selected date range:
  // A booking overlaps if: booking.checkIn <= selection.end AND booking.checkOut > selection.start
  // Wait, if checkout is same as selection start, does it count? 
  // "overlaps that range". If someone selects Feb 13, and booking is Feb 10 -> Feb 13, the room is free on Feb 13 night.
  // But is the booking relevant to that day? If front desk clicks Feb 13, they might want to see departures too. 
  // But requirement says: "overlaps that range". Let's stick to occupancy logic: 
  // Booking checkIn is <= realEnd, and checkOut > realStart.
  const dateStrStart = format(realStart, 'yyyy-MM-dd');
  const dateStrEnd = format(realEnd, 'yyyy-MM-dd');

  return bookings.filter(b => {
    return b.checkIn <= dateStrEnd && b.checkOut > dateStrStart;
  });
}
