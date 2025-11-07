# Admin Dashboard Guide

## Accessing the Dashboard

1. Navigate to `admin.html` in your browser
2. Or click the "Admin Dashboard" link in the website footer

## Features

### 1. Today's Bookings
- View all bookings scheduled for today
- See statistics: Total, Pending, Confirmed, Completed
- Manage booking status with action buttons:
  - **Confirm**: Mark booking as confirmed
  - **Complete**: Mark booking as completed
  - **Cancel**: Cancel a booking

### 2. All Bookings
- View all bookings across all dates
- Filter bookings by specific date
- Sort by date (newest first)
- Manage booking status

### 3. Pending Feedback
- Review feedback submitted by clients
- **Approve**: Add feedback to testimonials on the main website
- **Reject**: Remove feedback (requires confirmation)

### 4. Messages
- View all contact form submissions
- See client details and messages
- Messages are sorted by date (newest first)

## Booking Statuses

- **Pending**: New booking, awaiting confirmation
- **Confirmed**: Booking confirmed by admin
- **Completed**: Session completed
- **Cancelled**: Booking cancelled

## How It Works

### Data Storage
- All data is stored in browser localStorage
- Data persists across browser sessions
- To clear all data, clear browser localStorage

### Feedback to Testimonials
1. Client submits feedback via the feedback form
2. Feedback appears in "Pending Feedback" section
3. Admin reviews and approves/rejects
4. Approved feedback automatically appears in testimonials section on main website
5. Up to 6 most recent approved testimonials are displayed

## Tips

- **Daily Check**: Check "Today's Bookings" each morning to see the day's schedule
- **Feedback Review**: Regularly review pending feedback to keep testimonials fresh
- **Status Updates**: Update booking status as sessions progress

## Data Export (Future Enhancement)

For production use, consider:
- Backend API integration
- Database storage instead of localStorage
- Email notifications for new bookings
- Calendar integration
- Export functionality for reports

