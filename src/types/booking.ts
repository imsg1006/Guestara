export interface Booking {
  id: string;
  guestName: string;
  roomNumber: string;
  roomType: string;
  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD
  guests: number;
  totalAmount: number;
  currency: string;
  status: 'confirmed' | 'cancelled' | 'checked_in' | 'checked_out';
  source: string;
}

export interface DayOccupancy {
  date: string; // YYYY-MM-DD
  occupancyCount: number;
  overlappingBookings: Booking[];
}

export interface SelectionRange {
  start: Date | null;
  end: Date | null;
}
