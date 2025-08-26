# EmptyState Component Documentation

## Overview

The `EmptyState` component is a dynamic, reusable component for displaying empty states across all tables and data lists in the application. It provides a consistent user experience with customizable content and actions.

## Location

- **Client**: `client/app/components/EmptyState.tsx`
- **Admin**: `admin/components/EmptyState.tsx`

## Basic Usage

### Simple Empty State

```tsx
import EmptyState from '@/app/components/EmptyState';

<EmptyState
  title="No Data Found"
  description="There's no data to display at the moment."
/>;
```

### Empty State with Action

```tsx
<EmptyState
  title="No Invoices Found"
  description="You haven't created any invoices yet. Start by creating your first invoice."
  actionLabel="Create Invoice"
  actionUrl="/dashboard/invoices/create"
  illustration="/no-item.svg"
/>
```

### Empty State with Custom Action Handler

```tsx
<EmptyState
  title="No Results Found"
  description="No results match your filters. Try adjusting your search criteria."
  actionLabel="Clear Filters"
  onAction={() => {
    setSearch('');
    setFilters({});
  }}
  illustration="/search-icon.svg"
/>
```

## Props

| Prop                 | Type         | Required | Description                                                     |
| -------------------- | ------------ | -------- | --------------------------------------------------------------- |
| `title`              | `string`     | ✓        | The main heading text                                           |
| `description`        | `string`     | ✓        | Descriptive text below the title                                |
| `actionLabel`        | `string`     | ✗        | Text for the action button                                      |
| `actionUrl`          | `string`     | ✗        | URL to navigate to when action is clicked                       |
| `onAction`           | `() => void` | ✗        | Custom function to call when action is clicked                  |
| `illustration`       | `string`     | ✗        | Path to illustration image                                      |
| `illustrationWidth`  | `number`     | ✗        | Width of illustration (default: 180 for client, 162 for admin)  |
| `illustrationHeight` | `number`     | ✗        | Height of illustration (default: 180 for client, 180 for admin) |
| `className`          | `string`     | ✗        | Additional CSS classes                                          |

## Predefined Configurations

The component comes with predefined configurations for common scenarios:

### Client Configurations (`EmptyStateConfigs`)

```tsx
import EmptyState, { EmptyStateConfigs } from '@/app/components/EmptyState';

// Use predefined configuration
<EmptyState {...EmptyStateConfigs.invoices} />

// Override specific props
<EmptyState
  {...EmptyStateConfigs.invoices}
  illustration="/custom-icon.svg"
/>
```

Available configurations:

- `loans` - For loan requests
- `invoices` - For invoices
- `customers` - For customer lists
- `products` - For product lists
- `quotes` - For quotes
- `marketplace` - For marketplace searches
- `search` - For search results
- `general` - Generic empty state

### Admin Configurations

```tsx
import EmptyState, { EmptyStateConfigs } from '@/components/EmptyState';

<EmptyState {...EmptyStateConfigs.loanRequests} />;
```

Available configurations:

- `loanRequests` - For loan requests
- `users` - For user lists
- `loans` - For loans
- `quotes` - For quotes
- `search` - For search results
- `general` - Generic empty state

## Usage in Tables

When using in table rows, you may want to span all columns:

```tsx
{data.length === 0 ? (
  <tr>
    <td colSpan={8} className="p-0">
      <EmptyState
        title="No Data Found"
        description="There's no data to display."
        className="border-0"
      />
    </td>
  </tr>
) : (
  // Render table rows
)}
```

## Usage in Different Contexts

### Filter/Search Results

```tsx
<EmptyState
  title={hasFilters ? 'No Results Match Filters' : 'No Data Found'}
  description={
    hasFilters
      ? 'No results match your current filters. Try adjusting your search criteria.'
      : "You haven't created any data yet."
  }
  actionLabel={hasFilters ? 'Clear Filters' : 'Create New'}
  onAction={hasFilters ? clearFilters : undefined}
  actionUrl={hasFilters ? undefined : '/create'}
/>
```

### Loading States

For loading states, use a simple loading message instead of EmptyState:

```tsx
{isLoading ? (
  <div className="text-center py-10">Loading...</div>
) : data.length === 0 ? (
  <EmptyState {...EmptyStateConfigs.general} />
) : (
  // Render data
)}
```

## Migration from Existing Empty States

### Before (Client)

```tsx
<div className="flex flex-col items-center justify-center h-[70dvh] space-y-6 border rounded-lg">
  <Image src="/icon.svg" alt="No data" width={180} height={180} />
  <h2 className="text-lg font-semibold">No Data</h2>
  <p className="text-sm text-neutral-500">No data available.</p>
  <button onClick={() => router.push('/create')}>Create New</button>
</div>
```

### After (Client)

```tsx
<EmptyState
  title="No Data"
  description="No data available."
  actionLabel="Create New"
  actionUrl="/create"
  illustration="/icon.svg"
/>
```

### Before (Admin)

```tsx
<div className="flex items-center justify-center h-[50vh]">
  <div className="space-y-5">
    <Image src="/icon.svg" alt="No data" width={162} height={180} />
    <div className="text-center space-y-2">
      <h1 className="text-lg font-medium">No Data</h1>
      <p className="text-gray-3">No data available.</p>
    </div>
  </div>
</div>
```

### After (Admin)

```tsx
<EmptyState
  title="No Data"
  description="No data available."
  illustration="/icon.svg"
/>
```

## Styling

The component automatically handles:

- Responsive design
- Consistent spacing and typography
- Focus states for accessibility
- Hover effects for buttons
- Proper color schemes for both client and admin

### Client Styling

- Uses `mikado` (yellow) color for buttons
- Neutral colors for text
- Larger container height (70vh)

### Admin Styling

- Uses `mikado` (yellow) color for buttons
- Admin-specific text colors (`resin-black`, `gray-3`)
- Smaller container height (50vh)

## Best Practices

1. **Always provide meaningful titles and descriptions**
2. **Use appropriate illustrations that match the context**
3. **Provide clear actions when applicable**
4. **Use predefined configurations when possible for consistency**
5. **Consider the context (filtered vs empty) when writing messages**
6. **Keep action labels short and actionable**
7. **Use onAction for clearing filters, actionUrl for navigation**
