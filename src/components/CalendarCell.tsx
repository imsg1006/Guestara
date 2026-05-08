import React, { useMemo } from 'react';
import { format, isSameMonth, isToday } from 'date-fns';
import type { DayOccupancy } from '../types/booking';

interface CalendarCellProps {
  day: Date;
  currentMonth: Date;
  occupancy?: DayOccupancy;
  isSelected: boolean;
  onMouseDown: (date: Date) => void;
  onMouseEnter: (date: Date) => void;
  onMouseUp: () => void;
}

export const CalendarCell = React.memo(({
  day,
  currentMonth,
  occupancy,
  isSelected,
  onMouseDown,
  onMouseEnter,
  onMouseUp
}: CalendarCellProps) => {
  const isCurrentMonth = isSameMonth(day, currentMonth);
  const today = isToday(day);
  const count = occupancy?.occupancyCount || 0;

  const heatLevel = Math.min(Math.max(count, 0), 10);

  const style = useMemo(() => {
    if (!isCurrentMonth) {
      return { backgroundColor: 'transparent' };
    }
    if (count === 0) {
      return { backgroundColor: 'var(--cell-bg)' };
    }
    return { backgroundColor: `var(--heat-${heatLevel})` };
  }, [count, heatLevel, isCurrentMonth]);

  let classNames = 'calendar-cell';
  if (!isCurrentMonth) classNames += ' dimmed';
  if (isSelected) classNames += ' selected';

  return (
    <div
      onMouseDown={() => onMouseDown(day)}
      onMouseEnter={() => onMouseEnter(day)}
      onMouseUp={onMouseUp}
      style={style}
      className={classNames}
      title={count > 0 ? `${count} room(s) occupied` : 'No bookings'}
    >
      <div className="cell-header">
        <span className={`cell-date ${today ? 'today' : ''}`} style={{ color: !today && !isCurrentMonth ? 'var(--cell-dim)' : '' }}>
          {format(day, 'd')}
        </span>
        {count > 0 && isCurrentMonth && (
          <span className={`cell-count ${count === 10 ? 'full' : 'normal'}`}>
            {count}/10
          </span>
        )}
      </div>
    </div>
  );
});
