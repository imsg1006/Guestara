import type { Booking, DayOccupancy } from '../types/booking';

interface HeaderStatsProps {
  currentMonth: Date;
  occupancyMap: Record<string, DayOccupancy>;
  bookings: Booking[];
}

export function HeaderStats({ currentMonth, occupancyMap, bookings }: HeaderStatsProps) {
  const currentMonthPrefix = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
  
  let totalNightsOccupied = 0;
  let daysInMonth = 0;

  for (const [dateStr, dayOcc] of Object.entries(occupancyMap)) {
    if (dateStr.startsWith(currentMonthPrefix)) {
      totalNightsOccupied += dayOcc.occupancyCount;
      daysInMonth++;
    }
  }

  const daysInCurrentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const maxPossibleNights = daysInCurrentMonth * 10;
  const avgOccupancy = maxPossibleNights > 0 ? (totalNightsOccupied / maxPossibleNights) * 100 : 0;

  const monthBookings = bookings.filter(b => b.checkIn.startsWith(currentMonthPrefix) && b.status !== 'cancelled');
  const totalRevenue = monthBookings.reduce((sum, b) => sum + b.totalAmount, 0);

  return (
    <div className="glass stats-container">
      <div className="stat-item">
        <span className="stat-label">Avg Occupancy</span>
        <span className="stat-value">{avgOccupancy.toFixed(1)}%</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Nights Booked</span>
        <span className="stat-value">{totalNightsOccupied}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Est. Revenue</span>
        <span className="stat-value">₹{totalRevenue.toLocaleString()}</span>
      </div>
    </div>
  );
}
