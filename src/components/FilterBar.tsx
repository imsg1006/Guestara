import type { ChangeEvent } from 'react';
import { Search, Filter, BedDouble } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  roomTypeFilter: string;
  onRoomTypeChange: (val: string) => void;
  roomTypes: string[];
}

export function FilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  roomTypeFilter,
  onRoomTypeChange,
  roomTypes
}: FilterBarProps) {
  return (
    <div className="glass filter-bar">
      <div className="filter-group flex-1">
        <label htmlFor="search" className="filter-label">Search Guest or Room</label>
        <div className="input-wrapper">
          <Search className="input-icon" size={18} />
          <input 
            id="search"
            type="text" 
            placeholder="e.g. James or 102"
            value={searchQuery}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            className="filter-input with-icon"
          />
        </div>
      </div>

      <div className="filter-group filter-group-fixed">
        <label htmlFor="status" className="filter-label">Status</label>
        <div className="input-wrapper">
          <Filter className="input-icon" size={18} />
          <select 
            id="status"
            value={statusFilter}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => onStatusChange(e.target.value)}
            className="filter-input with-icon"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="checked_in">Checked In</option>
            <option value="checked_out">Checked Out</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="filter-group filter-group-fixed">
        <label htmlFor="roomType" className="filter-label">Room Type</label>
        <div className="input-wrapper">
          <BedDouble className="input-icon" size={18} />
          <select 
            id="roomType"
            value={roomTypeFilter}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => onRoomTypeChange(e.target.value)}
            className="filter-input with-icon"
          >
            <option value="all">All Room Types</option>
            {roomTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
