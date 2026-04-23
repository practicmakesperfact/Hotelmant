FULL UPDATED PROMPT (5-STAR HOTEL SYSTEM)

Build a full Hotel Management System web application for managing one hotel with a modern UI, secure backend, and role-based access control. The system should manage rooms, bookings, customers, employees, restaurant/kitchen, housekeeping, payments, gallery, services, reports, and inventory.

🌟 Core Platform Features
Restaurant & Dining: Interactive food gallery at /restaurant with detailed ingredients, portion sizes, and diet-friendly badges.
Theme Customization: Global Light/Dark mode toggle (Sun/Moon) available in both public and dashboard headers.
3D / 360° Support: Room images and gallery must support interactive 3D / 360° virtual tours with zoom, rotate, fullscreen, and hotspots.
💳 Payment Integration

Integrate Ethiopian payment systems:

Chapa

Enhanced features:

Webhook-based payment confirmation
Payment retry system
Fraud detection flags
Payment reconciliation reports
👥 User Roles
Admin
Manager
Receptionist
Kitchen Staff
Housekeeping
Customer (Guest)

Each role has granular permissions and dedicated dashboards.

🔐 Advanced Authentication & Security
User registration and login
Password reset
Email verification
Profile management
Role-based access control (RBAC)
Fine-grained permission matrix

Advanced security:

Device/session tracking
IP-based access restriction
Full audit trail system:
Track every action (booking, payment, edits, etc.)
Store: user, action, timestamp, IP
Data encryption (sensitive fields)
GDPR-style privacy controls
🌍 Multi-Language (i18n)
Support English and Amharic
Language switcher
Store user preference
Dynamic translation system
🏨 Room Management

Admin can:

Add / edit / delete rooms

Room data:

Room number
Room type (Single, Double, Deluxe, Suite, VIP)
Price per night
Floor
Max occupancy
Facilities (WiFi, TV, AC, minibar, balcony)
Status (Available, Booked, Occupied, Cleaning, Maintenance)

Features:

Multiple images upload
3D / 360° room views
Interactive preview before booking
📅 Booking / Reservation System

Customers:

Search rooms
View 3D previews
Book / cancel
View history

Reception/Admin:

Create/edit bookings
Check-in / Check-out
Booking calendar
Walk-in handling

Advanced:

Quick check-in mode
Group bookings
Corporate bookings
Booking history tracking
Special requests
🧾 Billing & Finance (Advanced)
Multi-currency (ETB)
Tax configuration (VAT, service charge)
Folio system (guest ledger)
Charge posting (room, restaurant, services)
Invoice splitting
Night audit system (daily closing)
💰 Payments (Enhanced – IMPORTANT ADD)
Partial payments
Split payments
Deposit handling
Refund system
Payment Methods:
Online (Chapa)
Cash payment
Credit payment (pay later / postpaid)
Cash Handling:
Cashier must:
Record total cash received per transaction
Track daily total cash collection
Include in shift and financial reports
Organization / Corporate Payments:
Support company-paid bookings
Group guests under one organization
Allow:
Individual stay tracking
Final single consolidated payment by organization after all guests check out
Generate organization invoice summary
🧾 Invoice & Receipt Generation (NEW ADD – CRITICAL)
Auto-generate receipts and invoices after payment
Downloadable PDF receipt
Include:
Guest details
Organization (if applicable)
Services used
Taxes and totals
Payment method
Support:
Individual receipts
Group / organization invoices
Split invoices
🛎️ Concierge & Guest Services
Service requests:
Taxi
Tours
External services
Task lifecycle:
Requested → Assigned → Completed
Guest communication logs
🧹 Housekeeping (Advanced)
Cleaning schedules
Task assignment
Room status updates

Advanced:

Inspection checklist
Supervisor approval
Linen/laundry tracking
Lost & found
Maintenance escalation system
🍽️ Restaurant / Kitchen Management

Menu:

Add/edit/delete items
Categories (Breakfast, Lunch, Dinner, Drinks, Desserts)

Customer:

Browse menu
Order food
Room service

Kitchen:

Order dashboard
Status updates

Advanced:

Table management (POS)
Order splitting / bill merging
Kitchen Display System (KDS)
Order priority + timers
Recipe management
Auto inventory deduction
📦 Inventory (Enterprise Level)
Multi-store inventory (kitchen, housekeeping, bar)
Supplier/vendor management
Purchase orders
Goods receiving
Stock transfer
Expiry tracking
Inventory valuation reports
👨‍💼 Employee Management
Staff records

Departments:

Reception
Housekeeping
Kitchen
Restaurant
Management
Security

Features:

Shift scheduling
Attendance tracking
Task assignment

Advanced:

Performance tracking
Internal messaging
Biometric integration (optional)
🏢 Event & Conference Management
Event scheduling
Hall booking
Package pricing (hall + services)
Resource allocation
Event billing
🖼️ Gallery (3D Enabled)

Categories:

Rooms
Restaurant
Lobby
Events
Facilities

Features:

Upload images
Upload 360° virtual tours
Interactive viewer

Advanced:

Three.js integration
VR-ready mode
Hotspots:
Click objects (bed, balcony, etc.)
Show descriptions
🧰 Services & Facilities
Spa
Gym
Laundry
Transport
Conference halls

Guests can request services.

📊 Reports & Analytics

Admin dashboard:

Daily bookings
Revenue
Occupancy rate
Restaurant sales
Employee activity

Advanced:

ADR (Average Daily Rate)
RevPAR
Forecasting
Department-level analytics

Export:

Excel / CSV
🔔 Notifications
Booking confirmations
Payment alerts
Room service updates

Channels:

Email
System notifications

Advanced:

Role-based alerts
⭐ Reviews & Ratings
Guest reviews
Admin moderation
🎯 Promotions
Discounts
Coupons
Seasonal offers
🔄 Backup & System Settings
Database backup
Restore system

Configurations:

Language
Currency
📈 Admin Dashboard
Total rooms
Available rooms
Active guests
Employees
Bookings
Revenue
Orders
⚙️ System Reliability
Offline-safe operations
Auto backup system
Error logging & monitoring
🔗 Integrations (Advanced)
OTA support (booking platforms)
Channel manager
Accounting integration
🧪 Testing & Monitoring
System health dashboard
Performance monitoring
Centralized error logs
🧱 Tech Requirements

Frontend:

Next.js + Three.js

Backend:

Django + Django REST Framework

Database:

PostgreSQL

Architecture:

REST API
Secure authentication
Modular & scalable
Responsive UI
3D viewer integration (Three.js)