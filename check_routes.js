const fs = require('fs');
const path = require('path');

const routes = [
  // Admin items
  "/admin", "/admin/users", "/admin/rooms", "/admin/bookings", "/admin/staff", "/admin/reports", "/admin/settings",
  // Manager items
  "/manager", "/manager/bookings", "/manager/staff", "/manager/reports", "/manager/services",
  // Receptionist items
  "/receptionist", "/receptionist/checkin", "/receptionist/reservations", "/receptionist/rooms", "/receptionist/guests",
  // Housekeeping items
  "/housekeeping", "/housekeeping/tasks", "/housekeeping/rooms", "/housekeeping/supplies", "/housekeeping/issues",
  // Inventory items
  "/inventory", "/inventory/stock", "/inventory/orders", "/inventory/suppliers", "/inventory/reports",
  // Customer items
  "/customer", "/customer/profile", "/customer/invoices", "/customer/services"
];

const basePath = path.join(__dirname, 'app');
const missing = [];
const existing = [];

routes.forEach(route => {
  const pagePath = path.join(basePath, route, 'page.tsx');
  if (fs.existsSync(pagePath)) {
    existing.push(route);
  } else {
    missing.push(route);
  }
});

console.log("Missing routes:");
missing.forEach(r => console.log(r));

console.log("\nExisting routes:");
existing.forEach(r => console.log(r));
