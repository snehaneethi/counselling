// Admin Dashboard Functionality

document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
    loadTodayBookings();
    loadAllBookings();
    loadPendingFeedback();
    loadContactMessages();
});

// Tab Navigation
function initializeTabs() {
    const tabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.admin-section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.getAttribute('data-tab');

            // Remove active class from all tabs and sections
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked tab and corresponding section
            tab.classList.add('active');
            document.getElementById(`${targetTab}-section`).classList.add('active');

            // Reload data for the active section
            if (targetTab === 'today') {
                loadTodayBookings();
            } else if (targetTab === 'all') {
                loadAllBookings();
            } else if (targetTab === 'feedback') {
                loadPendingFeedback();
            } else if (targetTab === 'messages') {
                loadContactMessages();
            }
        });
    });
}

// Load Today's Bookings
function loadTodayBookings() {
    const bookings = getAllBookings();
    const today = new Date().toISOString().split('T')[0];
    const todayBookings = bookings.filter(booking => booking.date === today);

    // Calculate stats
    const stats = {
        total: todayBookings.length,
        pending: todayBookings.filter(b => b.status === 'pending').length,
        confirmed: todayBookings.filter(b => b.status === 'confirmed').length,
        completed: todayBookings.filter(b => b.status === 'completed').length
    };

    // Display stats
    const statsContainer = document.getElementById('today-stats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="stat-card">
                <h3>${stats.total}</h3>
                <p>Total Bookings</p>
            </div>
            <div class="stat-card">
                <h3>${stats.pending}</h3>
                <p>Pending</p>
            </div>
            <div class="stat-card">
                <h3>${stats.confirmed}</h3>
                <p>Confirmed</p>
            </div>
            <div class="stat-card">
                <h3>${stats.completed}</h3>
                <p>Completed</p>
            </div>
        `;
    }

    // Display bookings
    const container = document.getElementById('today-bookings');
    if (container) {
        if (todayBookings.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📅</div>
                    <p>No bookings scheduled for today.</p>
                </div>
            `;
        } else {
            container.innerHTML = generateBookingsTable(todayBookings);
            attachBookingActions();
        }
    }
}

// Load All Bookings
function loadAllBookings() {
    const bookings = getAllBookings();
    const container = document.getElementById('all-bookings');
    
    if (container) {
        if (bookings.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📅</div>
                    <p>No bookings found.</p>
                </div>
            `;
        } else {
            // Sort by date (newest first)
            bookings.sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));
            container.innerHTML = generateBookingsTable(bookings);
            attachBookingActions();
        }
    }
}

// Filter Bookings by Date
function filterBookingsByDate() {
    const dateInput = document.getElementById('filter-date');
    const selectedDate = dateInput.value;
    
    if (!selectedDate) {
        showAllBookings();
        return;
    }

    const bookings = getAllBookings();
    const filtered = bookings.filter(booking => booking.date === selectedDate);
    
    const container = document.getElementById('all-bookings');
    if (container) {
        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📅</div>
                    <p>No bookings found for ${new Date(selectedDate).toLocaleDateString()}.</p>
                </div>
            `;
        } else {
            container.innerHTML = generateBookingsTable(filtered);
            attachBookingActions();
        }
    }
}

function showAllBookings() {
    loadAllBookings();
    document.getElementById('filter-date').value = '';
}

// Generate Bookings Table
function generateBookingsTable(bookings) {
    if (bookings.length === 0) return '<p>No bookings found.</p>';

    let html = `
        <table class="bookings-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Name</th>
                    <th>Service</th>
                    <th>Contact</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;

    bookings.forEach((booking, index) => {
        const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const formattedTime = formatTime(booking.time);
        const serviceNames = {
            'individual': 'Individual',
            'couples': 'Couples & Family',
            'student': 'Student',
            'behaviour': 'Behaviour',
            'speech': 'Speech & Stuttering',
            'professional': 'Professional'
        };

        html += `
            <tr data-booking-id="${index}">
                <td>${formattedDate}</td>
                <td>${formattedTime}</td>
                <td>${booking.name}</td>
                <td>${serviceNames[booking.service] || booking.service}</td>
                <td>
                    <div>${booking.email}</div>
                    <div style="font-size: 0.85rem; color: var(--color-text-light);">${booking.phone}</div>
                </td>
                <td>
                    <span class="status-badge status-${booking.status || 'pending'}">
                        ${(booking.status || 'pending').charAt(0).toUpperCase() + (booking.status || 'pending').slice(1)}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        ${booking.status !== 'confirmed' ? `<button class="action-btn btn-confirm" onclick="updateBookingStatus(${index}, 'confirmed')">Confirm</button>` : ''}
                        ${booking.status !== 'completed' ? `<button class="action-btn btn-complete" onclick="updateBookingStatus(${index}, 'completed')">Complete</button>` : ''}
                        ${booking.status !== 'cancelled' ? `<button class="action-btn btn-cancel" onclick="updateBookingStatus(${index}, 'cancelled')">Cancel</button>` : ''}
                    </div>
                </td>
            </tr>
        `;
    });

    html += `
            </tbody>
        </table>
    `;

    return html;
}

// Attach Booking Actions
function attachBookingActions() {
    // Actions are attached via onclick in the table generation
}

// Update Booking Status
function updateBookingStatus(index, status) {
    const bookings = getAllBookings();
    if (bookings[index]) {
        bookings[index].status = status;
        bookings[index].updatedAt = new Date().toISOString();
        saveAllBookings(bookings);
        
        // Reload the current view
        const activeTab = document.querySelector('.nav-tab.active');
        if (activeTab) {
            const tabName = activeTab.getAttribute('data-tab');
            if (tabName === 'today') {
                loadTodayBookings();
            } else {
                loadAllBookings();
            }
        }
    }
}

// Load Pending Feedback
function loadPendingFeedback() {
    const feedback = getAllFeedback();
    const pending = feedback.filter(f => !f.approved);
    
    const container = document.getElementById('pending-feedback');
    if (container) {
        if (pending.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💬</div>
                    <p>No pending feedback to review.</p>
                </div>
            `;
        } else {
            let html = '';
            pending.forEach((item, index) => {
                html += `
                    <div class="feedback-item" data-feedback-id="${index}">
                        <div class="feedback-header">
                            <div>
                                <div class="feedback-author">${item.name}</div>
                                <div class="feedback-location">${item.type}, ${item.location}</div>
                            </div>
                            <div class="feedback-actions">
                                <button class="btn-approve" onclick="approveFeedback(${index})">Approve</button>
                                <button class="btn-reject" onclick="rejectFeedback(${index})">Reject</button>
                            </div>
                        </div>
                        <p style="margin-top: var(--spacing-sm); color: var(--color-text);">"${item.message}"</p>
                        <div style="margin-top: var(--spacing-sm); font-size: 0.85rem; color: var(--color-text-light);">
                            Submitted: ${new Date(item.timestamp).toLocaleDateString()}
                        </div>
                    </div>
                `;
            });
            container.innerHTML = html;
        }
    }
}

// Approve Feedback
function approveFeedback(index) {
    const feedback = getAllFeedback();
    if (feedback[index]) {
        feedback[index].approved = true;
        feedback[index].approvedAt = new Date().toISOString();
        saveAllFeedback(feedback);
        
        // Update testimonials on main page
        updateTestimonialsOnMainPage();
        
        loadPendingFeedback();
        alert('Feedback approved and added to testimonials!');
    }
}

// Reject Feedback
function rejectFeedback(index) {
    if (confirm('Are you sure you want to reject this feedback?')) {
        const feedback = getAllFeedback();
        feedback.splice(index, 1);
        saveAllFeedback(feedback);
        loadPendingFeedback();
    }
}

// Load Contact Messages
function loadContactMessages() {
    const messages = getAllContactMessages();
    
    const container = document.getElementById('contact-messages');
    if (container) {
        if (messages.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📧</div>
                    <p>No messages received yet.</p>
                </div>
            `;
        } else {
            // Sort by date (newest first)
            messages.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            let html = '';
            messages.forEach((msg, index) => {
                html += `
                    <div class="feedback-item">
                        <div class="feedback-header">
                            <div>
                                <div class="feedback-author">${msg.name}</div>
                                <div class="feedback-location">${msg.email}${msg.phone ? ' • ' + msg.phone : ''}</div>
                            </div>
                            <div style="font-size: 0.85rem; color: var(--color-text-light);">
                                ${new Date(msg.timestamp).toLocaleString()}
                            </div>
                        </div>
                        <p style="margin-top: var(--spacing-sm); color: var(--color-text);">${msg.message}</p>
                    </div>
                `;
            });
            container.innerHTML = html;
        }
    }
}

// Helper Functions
function getAllBookings() {
    try {
        return JSON.parse(localStorage.getItem('bookings') || '[]');
    } catch (e) {
        console.error('Error loading bookings:', e);
        return [];
    }
}

function saveAllBookings(bookings) {
    try {
        localStorage.setItem('bookings', JSON.stringify(bookings));
    } catch (e) {
        console.error('Error saving bookings:', e);
    }
}

function getAllFeedback() {
    try {
        return JSON.parse(localStorage.getItem('feedback') || '[]');
    } catch (e) {
        console.error('Error loading feedback:', e);
        return [];
    }
}

function saveAllFeedback(feedback) {
    try {
        localStorage.setItem('feedback', JSON.stringify(feedback));
    } catch (e) {
        console.error('Error saving feedback:', e);
    }
}

function getAllContactMessages() {
    try {
        return JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    } catch (e) {
        console.error('Error loading messages:', e);
        return [];
    }
}

function formatTime(time) {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

// Update testimonials on main page (if it's open)
function updateTestimonialsOnMainPage() {
    // This will be called when the main page loads
    if (window.opener) {
        window.opener.location.reload();
    }
}

