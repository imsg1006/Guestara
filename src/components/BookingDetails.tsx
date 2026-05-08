import type { Booking } from '../types/booking';
import { format } from 'date-fns';

interface BookingDetailsProps {
  bookings: Booking[];
  start: Date | null;
  end: Date | null;
}

export function BookingDetails({ bookings, start, end }: BookingDetailsProps) {
  if (!start) {
    return (
      <div className="glass booking-details bd-empty">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p>Select a date range to view bookings</p>
      </div>
    );
  }

  const startDateStr = format(start, 'MMM d, yyyy');
  const endDateStr = end && start !== end ? ` - ${format(end, 'MMM d, yyyy')}` : '';

  return (
    <div className="glass booking-details animate-fade-in">
      <h3 className="bd-title">Bookings Details</h3>
      <p className="bd-subtitle">
        {startDateStr}{endDateStr}
      </p>

      <div className="bd-list">
        {bookings.length === 0 ? (
          <div className="bd-empty" style={{ paddingTop: '2rem' }}>
            No bookings for this period.
          </div>
        ) : (
          bookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="bc-header">
                <span className="bc-name">{booking.guestName}</span>
                <span className={`bc-status status-${booking.status}`}>
                  {booking.status.replace('_', ' ')}
                </span>
              </div>
              <div className="bc-grid">
                <div><span className="bc-label">Room:</span> {booking.roomNumber} ({booking.roomType})</div>
                <div><span className="bc-label">Guests:</span> {booking.guests}</div>
                <div><span className="bc-label">In:</span> {booking.checkIn}</div>
                <div><span className="bc-label">Out:</span> {booking.checkOut}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
