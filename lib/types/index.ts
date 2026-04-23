// User Roles
export type UserRole = 'admin' | 'manager' | 'receptionist' | 'housekeeping' | 'inventory_manager' | 'customer';

export interface User {
  id: string;
  email: string;
  password: string; // hashed
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface Customer extends User {
  role: 'customer';
  loyaltyPoints: number;
  preferences?: {
    roomType?: string;
    floorPreference?: 'low' | 'high';
    smoking?: boolean;
    specialRequests?: string;
  };
  bookingHistory: string[]; // booking IDs
}

export interface Staff extends User {
  role: Exclude<UserRole, 'customer'>;
  department: string;
  shift?: 'morning' | 'afternoon' | 'night';
  hireDate: Date;
  employeeId: string;
}

// Authentication
export interface AuthToken {
  token: string;
  userId: string;
  role: UserRole;
  expiresAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
  phone?: string;
}

// Rooms
export type RoomType = 'standard' | 'deluxe' | 'suite' | 'presidential' | 'family';
export type RoomStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'reserved' | 'dirty';
export type BedType = 'single' | 'double' | 'queen' | 'king' | 'twin';

export interface Room {
  id: string;
  roomNumber: string;
  type: RoomType;
  floor: number;
  bedType: BedType;
  maxOccupancy: number;
  pricePerNight: number;
  status: RoomStatus;
  amenities: string[];
  description: string;
  descriptionAm?: string; // Amharic
  descriptionOm?: string; // Afaan Oromo
  images: string[];
  panoramaImage?: string; // 360 view
  size: number; // sqm
  view?: 'city' | 'garden' | 'pool' | 'mountain';
  isSmokingAllowed: boolean;
  hasBalcony: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RoomPricing {
  roomId: string;
  basePrice: number;
  weekendPrice: number;
  holidayPrice: number;
  seasonalMultipliers: {
    low: number;
    mid: number;
    high: number;
    peak: number;
  };
}

// Bookings
export type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show';
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'refunded' | 'failed';
export type PaymentMethod = 'chapa' | 'telebirr' | 'cash' | 'bank_transfer' | 'card' | 'credit';

// Payment & Invoice Types
export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paidAt: Date;
  paidBy: string; // customer or staff ID
  notes?: string;
  receiptUrl?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  bookingId?: string;
  organizationId?: string;
  customerId: string;
  customerName: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  total: number;
  paidAmount: number;
  status: 'draft' | 'issued' | 'paid' | 'partial' | 'overdue' | 'cancelled';
  issuedAt: Date;
  dueDate?: Date;
  paidAt?: Date;
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Organization {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
  creditLimit: number;
  paymentTerms: string; // e.g., "Net 30"
  isActive: boolean;
  createdAt: Date;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  roomId: string;
  roomNumber: string;
  roomType: RoomType;
  checkInDate: Date;
  checkOutDate: Date;
  actualCheckIn?: Date;
  actualCheckOut?: Date;
  numberOfGuests: number;
  numberOfNights: number;
  totalAmount: number;
  paidAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  specialRequests?: string;
  addOns: BookingAddOn[];
  organizationId?: string; // For corporate bookings
  organizationName?: string;
  payments: Payment[]; // Track multiple payments
  invoiceId?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string; // staff ID if walk-in
}

export interface BookingAddOn {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

// Services
export type ServiceCategory = 'room_service' | 'laundry' | 'spa' | 'restaurant' | 'transport' | 'other' | 'food';
export type ServiceRequestStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export type ChargeType = 'per_person' | 'per_stay' | 'per_hour' | 'per_item' | 'free';

export interface Service {
  id: string;
  name: string;
  nameAm?: string;
  nameOm?: string;
  category: ServiceCategory;
  description: string;
  price: number;
  chargeType: ChargeType;
  isAvailable: boolean;
  availableHours?: {
    start: string;
    end: string;
  };
  image?: string;
}

export type FoodCategory = 'appetizer' | 'main_course' | 'dessert' | 'beverage' | 'ethiopian' | 'international' | 'breakfast' | 'snack' | 'juice_fruit' | 'alcoholic_beverage' | 'hot_drinks' | 'water';

export interface MenuItem extends Service {
  category: 'restaurant';
  foodCategory: FoodCategory;
  ingredients: string[];
  portionSize: string; // e.g., "500g", "Regular", "Large"
  calories?: number;
  isVegetarian: boolean;
  isSpicy: boolean;
  preparationTime: number; // minutes
}

export interface ServiceRequest {
  id: string;
  bookingId: string;
  roomNumber: string;
  customerId: string;
  serviceId: string;
  serviceName: string;
  quantity: number;
  totalPrice: number;
  status: ServiceRequestStatus;
  notes?: string;
  requestedAt: Date;
  completedAt?: Date;
  assignedTo?: string; // staff ID
}

// Housekeeping
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'verified';
export type TaskType = 'checkout_clean' | 'stay_clean' | 'deep_clean' | 'turndown' | 'maintenance';

export interface HousekeepingTask {
  id: string;
  roomId: string;
  roomNumber: string;
  type: TaskType;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo?: string;
  assignedToName?: string;
  scheduledFor: Date;
  startedAt?: Date;
  completedAt?: Date;
  verifiedBy?: string;
  notes?: string;
  checklistItems?: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  task: string;
  isCompleted: boolean;
}

export interface MaintenanceRequest {
  id: string;
  roomId: string;
  roomNumber: string;
  reportedBy: string;
  reportedByName: string;
  issue: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedTo?: string;
  createdAt: Date;
  resolvedAt?: Date;
  resolution?: string;
  images?: string[];
}

// Inventory
export type InventoryCategory = 'linens' | 'toiletries' | 'cleaning' | 'minibar' | 'kitchen' | 'office' | 'maintenance';

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  sku: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  unitPrice: number;
  unit: string;
  supplierId?: string;
  location: string;
  lastRestocked?: Date;
  expiryDate?: Date;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  categories: InventoryCategory[];
  leadTimeDays: number;
  paymentTerms: string;
  isActive: boolean;
}

export type PurchaseOrderStatus = 'draft' | 'submitted' | 'approved' | 'ordered' | 'partial' | 'received' | 'cancelled';

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderItem[];
  totalAmount: number;
  status: PurchaseOrderStatus;
  createdBy: string;
  createdAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  expectedDelivery?: Date;
  receivedAt?: Date;
  notes?: string;
}

export interface PurchaseOrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  receivedQuantity?: number;
}

// Reports & Analytics
export interface DailyReport {
  date: Date;
  totalRevenue: number;
  roomRevenue: number;
  serviceRevenue: number;
  occupancyRate: number;
  totalCheckIns: number;
  totalCheckOuts: number;
  newBookings: number;
  cancellations: number;
  averageDailyRate: number;
}

export interface OccupancyStats {
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  cleaningRooms: number;
  maintenanceRooms: number;
  reservedRooms: number;
  occupancyRate: number;
}

// Notifications
export type NotificationType = 'booking' | 'checkin' | 'checkout' | 'service' | 'maintenance' | 'inventory' | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Dashboard Stats
export interface AdminDashboardStats {
  totalRevenue: number;
  todayRevenue: number;
  occupancyRate: number;
  totalBookings: number;
  pendingCheckIns: number;
  pendingCheckOuts: number;
  totalGuests: number;
  totalStaff: number;
  lowStockAlerts: number;
  maintenanceRequests: number;
}

export interface ReceptionistDashboardStats {
  todayCheckIns: number;
  todayCheckOuts: number;
  currentOccupancy: number;
  availableRooms: number;
  pendingArrivals: number;
  pendingDepartures: number;
  vipArrivals: number;
  walkInBookings: number;
}

export interface HousekeepingDashboardStats {
  pendingTasks: number;
  inProgressTasks: number;
  completedToday: number;
  roomsCleaning: number;
  roomsMaintenance: number;
  urgentTasks: number;
}

export interface InventoryDashboardStats {
  totalItems: number;
  lowStockItems: number;
  pendingOrders: number;
  totalSuppliers: number;
  monthlySpend: number;
  expiringItems: number;
}

// Locale
export type Locale = 'en' | 'am' | 'om';

export interface LocaleConfig {
  code: Locale;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
}

// Audit Trail & Security
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string; // e.g., 'booking', 'payment', 'room'
  entityId: string;
  changes?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

export interface UserSession {
  id: string;
  userId: string;
  deviceName: string;
  ipAddress: string;
  location?: string;
  loginAt: Date;
  lastActivityAt: Date;
  isActive: boolean;
}

// Gallery & Media
export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  category: 'rooms' | 'restaurant' | 'lobby' | 'events' | 'facilities' | 'exterior';
  imageUrl: string;
  panoramaUrl?: string; // 360° view
  is360: boolean;
  hotspots?: Hotspot[];
  uploadedAt: Date;
  uploadedBy: string;
}

export interface Hotspot {
  id: string;
  x: number; // percentage
  y: number; // percentage
  title: string;
  description: string;
  icon?: string;
}

// Events & Conference
export interface Event {
  id: string;
  name: string;
  eventType: 'conference' | 'wedding' | 'meeting' | 'party' | 'other';
  hallId: string;
  hallName: string;
  organizerId: string;
  organizerName: string;
  organizerEmail: string;
  organizerPhone: string;
  startDate: Date;
  endDate: Date;
  numberOfGuests: number;
  packageId?: string;
  services: string[]; // service IDs
  totalAmount: number;
  paidAmount: number;
  status: 'inquiry' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Date;
}

export interface ConferenceHall {
  id: string;
  name: string;
  capacity: number;
  size: number; // sqm
  amenities: string[];
  pricePerHour: number;
  pricePerDay: number;
  images: string[];
  isAvailable: boolean;
}

// Reviews & Ratings
export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  rating: number; // 1-5
  cleanliness: number;
  service: number;
  amenities: number;
  value: number;
  location: number;
  comment: string;
  response?: string; // Admin response
  respondedBy?: string;
  respondedAt?: Date;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

// Promotions & Discounts
export interface Promotion {
  id: string;
  code: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minBookingAmount?: number;
  maxDiscount?: number;
  validFrom: Date;
  validTo: Date;
  usageLimit?: number;
  usedCount: number;
  applicableRoomTypes?: RoomType[];
  isActive: boolean;
  createdAt: Date;
}
