import { useState, useCallback, useEffect } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { getMonthDays, isDateInSelectionRange } from '../utils/dateHelpers';
import { CalendarCell } from './CalendarCell';
import type { DayOccupancy, SelectionRange } from '../types/booking';

interface CalendarProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  occupancyMap: Record<string, DayOccupancy>;
  selection: SelectionRange;
  onSelectionChange: (selection: SelectionRange) => void;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function Calendar({
  currentMonth,
  onMonthChange,
  occupancyMap,
  selection,
  onSelectionChange
}: CalendarProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Date | null>(null);

  const days = getMonthDays(currentMonth);

  const handlePrevMonth = () => onMonthChange(subMonths(currentMonth, 1));
  const handleNextMonth = () => onMonthChange(addMonths(currentMonth, 1));
  const handleToday = () => onMonthChange(new Date());

  const handleMouseDown = useCallback((date: Date) => {
    setIsDragging(true);
    setDragStart(date);
    onSelectionChange({ start: date, end: date });
  }, [onSelectionChange]);

  const handleMouseEnter = useCallback((date: Date) => {
    if (isDragging && dragStart) {
      onSelectionChange({ start: dragStart, end: date });
    }
  }, [isDragging, dragStart, onSelectionChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    const onGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener('mouseup', onGlobalMouseUp);
    return () => window.removeEventListener('mouseup', onGlobalMouseUp);
  }, []);

  return (
    <div className="glass calendar-wrapper shadow-xl">
      <div className="calendar-header">
        <h2 className="calendar-title">
          <CalendarIcon style={{ width: '1.5rem', height: '1.5rem', color: 'var(--primary-color)' }} />
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="calendar-controls">
          <button 
            onClick={handleToday}
            className="btn-primary"
          >
            Today
          </button>
          <div className="btn-nav-group">
            <button onClick={handlePrevMonth} className="btn-nav">
              <ChevronLeft style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>
            <div className="nav-divider" />
            <button onClick={handleNextMonth} className="btn-nav">
              <ChevronRight style={{ width: '1.25rem', height: '1.25rem' }} />
            </button>
          </div>
        </div>
      </div>

      <div className="calendar-days-header">
        {DAYS_OF_WEEK.map(day => (
          <div key={day} className="day-name">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const isSelected = isDateInSelectionRange(day, selection.start, selection.end);
          
          return (
            <CalendarCell
              key={dateStr}
              day={day}
              currentMonth={currentMonth}
              occupancy={occupancyMap[dateStr]}
              isSelected={isSelected}
              onMouseDown={handleMouseDown}
              onMouseEnter={handleMouseEnter}
              onMouseUp={handleMouseUp}
            />
          );
        })}
      </div>
    </div>
  );
}
