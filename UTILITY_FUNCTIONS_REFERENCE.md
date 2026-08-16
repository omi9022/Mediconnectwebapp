# MediConnect Utility Functions Quick Reference

## Date Utilities (`/src/utils/dateUtils.ts`)

### `getRelativeDate(daysOffset: number): string`
Returns a formatted date string (DD/MM/YYYY) relative to today (March 26, 2026).

**Parameters:**
- `daysOffset` - Number of days from today (negative = past, positive = future)

**Returns:** String in format "DD/MM/YYYY"

**Examples:**
```typescript
getRelativeDate(0)   // "26/03/2026" (today)
getRelativeDate(-7)  // "19/03/2026" (7 days ago)
getRelativeDate(14)  // "09/04/2026" (14 days from now)
```

---

### `getFormattedDate(daysOffset: number): string`
Returns an ISO date string (YYYY-MM-DD) for form inputs.

**Parameters:**
- `daysOffset` - Number of days from today

**Returns:** String in format "YYYY-MM-DD"

**Examples:**
```typescript
getFormattedDate(0)   // "2026-03-26"
getFormattedDate(-30) // "2026-02-24"
getFormattedDate(7)   // "2026-04-02"
```

---

### `formatDate(dateString: string): string`
Converts ISO date string to display format.

**Parameters:**
- `dateString` - ISO date string (YYYY-MM-DD)

**Returns:** String in format "DD/MM/YYYY"

**Example:**
```typescript
formatDate("2026-03-26") // "26/03/2026"
```

---

### `getRelativeTimeDescription(daysOffset: number): string`
Returns human-readable time description.

**Parameters:**
- `daysOffset` - Number of days from today

**Returns:** Human-readable string

**Examples:**
```typescript
getRelativeTimeDescription(0)   // "Today"
getRelativeTimeDescription(-1)  // "Yesterday"
getRelativeTimeDescription(1)   // "Tomorrow"
getRelativeTimeDescription(-5)  // "5 days ago"
getRelativeTimeDescription(10)  // "in 10 days"
```

---

## Constants (`/src/utils/constants.ts`)

### `FALLBACK_USERS`
Default user credentials when backend is unavailable.

**Structure:**
```typescript
{
  customer: { id, username, password, name, email, phone, location, role },
  cityhospital: { ... },
  admin: { ... },
  distributor: { ... }
}
```

**Usage:**
```typescript
import { FALLBACK_USERS } from '../utils/constants';
const user = FALLBACK_USERS['customer'];
```

---

### `THEME_COLORS`
Theme color configuration for each portal.

**Structure:**
```typescript
{
  hospital: { primary, hover, light, name },
  support: { primary, hover, light, name },
  customer: { primary, hover, light, name },
  distributor: { primary, hover, light, name }
}
```

**Usage:**
```typescript
import { THEME_COLORS } from '../utils/constants';
const color = THEME_COLORS.hospital.primary; // "#2A5C82"
```

---

### `getStatusColor(status: string): string`
Returns Tailwind CSS classes for status badges.

**Parameters:**
- `status` - Status string (case-insensitive)

**Returns:** Tailwind CSS classes for background and text color

**Examples:**
```typescript
getStatusColor('active')     // "bg-green-100 text-green-700"
getStatusColor('pending')    // "bg-yellow-100 text-yellow-700"
getStatusColor('cancelled')  // "bg-red-100 text-red-700"
getStatusColor('In Stock')   // "bg-green-100 text-green-700"
```

**Supported Statuses:**
- active, inactive
- pending, completed, confirmed, cancelled
- urgent, critical
- stable, recovering, post-op
- delivered, shipped, processing
- paid, unpaid
- in-stock, low-stock, out-of-stock

---

## Storage Utilities (`/src/utils/storage.ts`)

### `getCustomUsers()`
Retrieves custom users created in Support Dashboard.

**Returns:** Object with arrays: `{ hospital: [], customer: [], distributor: [] }`

**Example:**
```typescript
import { getCustomUsers } from '../utils/storage';
const users = getCustomUsers();
console.log(users.hospital); // Array of hospital users
```

---

### `saveCustomUsers(users: any)`
Saves custom users to localStorage.

**Parameters:**
- `users` - Object with hospital, customer, and distributor arrays

**Example:**
```typescript
import { saveCustomUsers } from '../utils/storage';
saveCustomUsers({
  hospital: [...],
  customer: [...],
  distributor: [...]
});
```

---

### `getUserSession()`
Retrieves current user session.

**Returns:** `{ user: object, userType: string } | null`

**Example:**
```typescript
import { getUserSession } from '../utils/storage';
const session = getUserSession();
if (session) {
  console.log(session.user, session.userType);
}
```

---

### `saveUserSession(user: any, userType: string)`
Saves user session to localStorage.

**Parameters:**
- `user` - User object
- `userType` - 'hospital' | 'support' | 'customer' | 'distributor'

**Example:**
```typescript
import { saveUserSession } from '../utils/storage';
saveUserSession(userData, 'hospital');
```

---

### `clearUserSession()`
Clears user session from localStorage (logout).

**Example:**
```typescript
import { clearUserSession } from '../utils/storage';
clearUserSession();
```

---

### `getCustomerOrders()`
Retrieves customer orders from localStorage.

**Returns:** Array of order objects

**Example:**
```typescript
import { getCustomerOrders } from '../utils/storage';
const orders = getCustomerOrders();
```

---

### `saveCustomerOrders(orders: any[])`
Saves customer orders to localStorage.

**Parameters:**
- `orders` - Array of order objects

**Example:**
```typescript
import { saveCustomerOrders } from '../utils/storage';
saveCustomerOrders([...orders, newOrder]);
```

---

### `getDistributorProducts()`
Retrieves distributor products from localStorage.

**Returns:** Array of product objects

**Example:**
```typescript
import { getDistributorProducts } from '../utils/storage';
const products = getDistributorProducts();
```

---

### `saveDistributorProducts(products: any[])`
Saves distributor products to localStorage.

**Parameters:**
- `products` - Array of product objects

**Example:**
```typescript
import { saveDistributorProducts } from '../utils/storage';
saveDistributorProducts(updatedProducts);
```

---

## Shared Components (`/src/app/components/shared/`)

### Modal Component
```typescript
import { Modal } from './shared';

<Modal 
  isOpen={showModal} 
  onClose={() => setShowModal(false)}
  title="Modal Title"
  maxWidth="2xl"
>
  <div>Modal content here</div>
</Modal>
```

**Props:**
- `isOpen: boolean` - Control visibility
- `onClose: () => void` - Close handler
- `title: string` - Modal header
- `children: ReactNode` - Modal content
- `maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl'` - Width (default: '2xl')

---

### StatusBadge Component
```typescript
import { StatusBadge } from './shared';

<StatusBadge status="active" />
<StatusBadge status="pending" className="ml-2" />
```

**Props:**
- `status: string` - Status text (automatically colored)
- `className?: string` - Additional CSS classes

---

### StatCard Component
```typescript
import { StatCard } from './shared';
import { Users } from 'lucide-react';

<StatCard 
  title="Total Patients"
  value="1,247"
  change="+12%"
  trend="up"
  icon={Users}
  color="blue"
  onClick={() => console.log('clicked')}
/>
```

**Props:**
- `title: string` - Card title
- `value: string | number` - Main metric value
- `change?: string` - Percentage change
- `trend?: 'up' | 'down'` - Trend indicator
- `icon: LucideIcon` - Icon component
- `color?: string` - Color theme
- `onClick?: () => void` - Optional click handler

---

### SearchBar Component
```typescript
import { SearchBar } from './shared';

<SearchBar 
  searchQuery={query}
  onSearchChange={setQuery}
  placeholder="Search products..."
  showFilter
  filterValue={filter}
  onFilterChange={setFilter}
  filterOptions={[
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' }
  ]}
  showDownload
  onDownload={handleExport}
/>
```

**Props:**
- `searchQuery: string` - Current search value
- `onSearchChange: (value: string) => void` - Search handler
- `placeholder?: string` - Search placeholder
- `showFilter?: boolean` - Show filter dropdown
- `filterValue?: string` - Current filter value
- `onFilterChange?: (value: string) => void` - Filter handler
- `filterOptions?: Array<{value, label}>` - Filter options
- `showDownload?: boolean` - Show export button
- `onDownload?: () => void` - Export handler

---

### DataTable Component
```typescript
import { DataTable } from './shared';
import { StatusBadge } from './shared';

const columns = [
  { key: 'name', header: 'Name' },
  { 
    key: 'status', 
    header: 'Status',
    render: (item) => <StatusBadge status={item.status} />
  },
  { key: 'date', header: 'Date', className: 'text-right' }
];

<DataTable 
  data={items}
  columns={columns}
  onRowClick={(item) => console.log(item)}
  emptyMessage="No items found"
/>
```

**Props:**
- `data: T[]` - Array of data objects
- `columns: Column<T>[]` - Column definitions
- `onRowClick?: (item: T) => void` - Row click handler
- `emptyMessage?: string` - Empty state message
- `className?: string` - Additional CSS classes

**Column Definition:**
- `key: string` - Data property key
- `header: string` - Column header text
- `render?: (item: T) => ReactNode` - Custom cell renderer
- `className?: string` - Column CSS classes

---

## Import Patterns

### Utilities
```typescript
// Date utilities
import { getRelativeDate, getFormattedDate, formatDate } from '../../utils/dateUtils';

// Constants
import { FALLBACK_USERS, THEME_COLORS, getStatusColor } from '../../utils/constants';

// Storage
import { 
  getCustomUsers, 
  saveCustomUsers,
  getUserSession,
  saveUserSession,
  clearUserSession,
  getCustomerOrders,
  saveCustomerOrders,
  getDistributorProducts,
  saveDistributorProducts 
} from '../../utils/storage';
```

### Components
```typescript
// Single import
import { Modal } from './shared';

// Multiple imports
import { Modal, StatusBadge, StatCard, SearchBar, DataTable } from './shared';
```

---

## Error Handling

All storage utilities include try-catch error handling:

```typescript
// Safe to use - returns empty data on error
const users = getCustomUsers(); // Never throws

// Errors logged to console
// Error reading custom users: [error details]
```

---

## Best Practices

1. **Always use utilities instead of inline code**
   ```typescript
   // ❌ Bad
   const date = new Date();
   date.setDate(date.getDate() + 7);
   
   // ✅ Good
   const date = getFormattedDate(7);
   ```

2. **Use StatusBadge for all status displays**
   ```typescript
   // ❌ Bad
   <span className="px-2 py-1 bg-green-100">Active</span>
   
   // ✅ Good
   <StatusBadge status="active" />
   ```

3. **Use storage utilities for localStorage**
   ```typescript
   // ❌ Bad
   const users = JSON.parse(localStorage.getItem('users') || '[]');
   
   // ✅ Good
   const users = getCustomUsers();
   ```

4. **Import only what you need**
   ```typescript
   // ✅ Good - specific imports
   import { getRelativeDate, getFormattedDate } from '../../utils/dateUtils';
   
   // ❌ Less ideal - importing entire module
   import * as dateUtils from '../../utils/dateUtils';
   ```

---

**Last Updated:** March 27, 2026  
**Version:** 1.0  
**Status:** Production Ready
