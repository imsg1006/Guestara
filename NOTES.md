# Developer Notes

This document outlines the architectural decisions, open-scope features implemented, trade-offs made, and potential future improvements for the Guestara front desk application.

## Open-Scope Features Chosen & Why

1. **Interactive Occupancy Heatmap & Selection Range**
   - *Feature:* The calendar cells dynamically change color based on the number of bookings on that day. Users can select a range of dates to see exactly which bookings overlap with that selection.
   - *Why:* A simple list of bookings isn't enough for a front desk. Staff need to instantly visualize high-occupancy dates or available days at a glance. The visual heatmap improves booking management and revenue strategy, while the drill-down selection allows staff to see exactly who is arriving, departing, or staying over without leaving the dashboard.

2. **Comprehensive Filter Bar**
   - *Feature:* A fully responsive filter bar allowing users to search by guest name/room number, and filter by reservation status or room type.
   - *Why:* As properties scale, quickly finding bookings is critical for operations. This reduces the time staff spend searching for a specific guest checking in or out.

3. **Header Statistics Summaries**
   - *Feature:* Dynamic statistics in the header that summarize the currently selected month (e.g., total active bookings, average occupancy rate).
   - *Why:* Provides managers with an immediate overview of performance and property status without needing to navigate to a separate analytics page.

4. **Premium Glassmorphism Aesthetics**
   - *Feature:* Custom CSS utilizing modern UI trends like glassmorphism, smooth micro-animations, and vibrant gradients.
   - *Why:* To deliver a highly polished, professional, and visually stunning first impression that feels responsive and alive, encouraging user interaction.

## Trade-Offs Made

- **Client-Side vs. Server-Side Filtering:** 
  Currently, all data is loaded and then filtered on the client side. This provides extremely fast, instantaneous UI updates and is perfect for small to medium datasets. However, the trade-off is that it won't scale efficiently for tens of thousands of records. In a massive enterprise system, we would trade this immediate responsiveness for server-side pagination and filtering to reduce initial load size.
  
- **Custom CSS vs. Utility Frameworks:** 
  I opted to write custom CSS (with advanced features like CSS variables and glassmorphism techniques) rather than strictly relying on a heavy component library (like Material UI) or pure Tailwind. This allowed for a highly customized, "wow-factor" aesthetic that feels unique, though it introduces slightly more maintenance overhead compared to using pre-built components.

- **In-Memory State vs. URL-Driven State:** 
  The current month, selection range, and filter parameters are kept in React local state. If the user refreshes the page, they return to the default view. This was chosen for development speed, trading off the ability to "bookmark" or "share" a specific calendar state via URL.

## What I Would Do Differently With More Time

1. **URL State Synchronization:**
   I would sync the active filters, search queries, and selected date ranges to the URL query parameters (e.g., `?month=2026-02&roomType=suite`). This allows users to share direct links to specific views or bookmark their preferred dashboard state.

2. **Drag-and-Drop Scheduling:**
   Implement a drag-and-drop interface directly on the calendar or timeline view to allow staff to quickly move, extend, or shorten bookings visually.

3. **Detailed Booking Modals & Edit Capabilities:**
   Clicking a specific booking in the details pane currently shows its read-only info. I would build a full-page modal or sliding side-drawer allowing staff to edit the booking details (change status, add notes, process payments) and persist those changes to a backend.

4. **Virtualization for Scale:**
   If the date range or number of bookings becomes very large, I would implement list/grid virtualization (e.g., using `@tanstack/react-virtual`) to ensure the DOM isn't overloaded and the application maintains a smooth 60fps frame rate.

5. **Comprehensive Testing Suite:**
   Add unit tests using Vitest (to verify date overlap logic and occupancy calculations) and End-to-End tests using Playwright to ensure the core user flows (filtering, selecting dates) remain bug-free as the codebase evolves.
