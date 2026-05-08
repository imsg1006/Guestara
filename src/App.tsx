import { useState, useEffect, useMemo } from 'react';
import { Calendar } from './components/Calendar';
import { BookingDetails } from './components/BookingDetails';
import { HeaderStats } from './components/HeaderStats';
import { FilterBar } from './components/FilterBar';
import type { Booking, SelectionRange } from './types/booking';
import { calculateOccupancy, getBookingsForRange } from './utils/occupancy';
import { startOfMonth } from 'date-fns';

function App() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(new Date('2026-02-01T00:00:00')));
  const [selection, setSelection] = useState<SelectionRange>({ start: null, end: null });

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roomTypeFilter, setRoomTypeFilter] = useState('all');

  useEffect(() => {
    // Load bookings data
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/bookings.json');
        if (!res.ok) throw new Error('Failed to fetch bookings data');
        const data: Booking[] = await res.json();
        setBookings(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'An error occurred while loading data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const roomTypes = useMemo(() => {
    const types = new Set<string>();
    bookings.forEach(b => types.add(b.roomType));
    return Array.from(types).sort();
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => {
      const searchMatch = b.guestName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.roomNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const statusMatch = statusFilter === 'all' ? true : b.status === statusFilter;
      const roomMatch = roomTypeFilter === 'all' ? true : b.roomType === roomTypeFilter;
      return searchMatch && statusMatch && roomMatch;
    });
  }, [bookings, searchQuery, statusFilter, roomTypeFilter]);

  const occupancyMap = useMemo(() => calculateOccupancy(filteredBookings), [filteredBookings]);
  const overlappingBookings = useMemo(() => getBookingsForRange(filteredBookings, selection.start, selection.end), [filteredBookings, selection]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div style={{ textAlign: 'center' }}>
          <div className="spinner animate-spin"></div>
          <p style={{ fontSize: '1.125rem', fontWeight: 500 }}>Loading calendar data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-screen">
        <div className="glass error-card">
          <svg xmlns="http://www.w3.org/2000/svg" style={{ width: '4rem', height: '4rem', margin: '0 auto 1rem', color: '#ef4444' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Failed to load data</h2>
          <p style={{ color: 'var(--cell-text)' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
            style={{ marginTop: '1.5rem' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="animate-fade-in">
        
        <header className="app-header">
          <h1 className="app-title">
            Guestara Front Desk
          </h1>
          <p className="app-subtitle">Interactive Occupancy Heatmap</p>
        </header>

        <HeaderStats 
          currentMonth={currentMonth}
          occupancyMap={occupancyMap}
          bookings={filteredBookings}
        />

        <FilterBar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          roomTypeFilter={roomTypeFilter}
          onRoomTypeChange={setRoomTypeFilter}
          roomTypes={roomTypes}
        />

        <div className="main-layout">
          <div>
            <Calendar 
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
              occupancyMap={occupancyMap}
              selection={selection}
              onSelectionChange={setSelection}
            />
          </div>
          
          <div>
            <BookingDetails 
              bookings={overlappingBookings}
              start={selection.start}
              end={selection.end}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
