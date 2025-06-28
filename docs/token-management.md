# Token Management System

This document describes the token management system for the Pace Terminal application.

## Overview

The token management system allows administrators to:

- View all tokens in a sortable table
- Add new tokens with detailed information
- Edit existing token details
- Delete tokens with confirmation
- Organize tokens by tier (S, A, B, C)

## Features

### Token Table

- **Sortable columns**: Name, Address, Tier, Description, Created Date
- **Tier display**: Shows letter grades (S, A, B, C) instead of numeric values
- **Action buttons**: Edit and Delete for each token
- **Responsive design**: Works on desktop and mobile

### Token Form

- **Add/Edit mode**: Same form handles both creating and editing tokens
- **Validation**: Required fields include name, address, and tier
- **Image preview**: Shows token image with fallback icon
- **Tier selection**: Dropdown with S, A, B, C options
- **Real-time validation**: Shows errors immediately

### Admin Dashboard

- **Overview cards**: Quick stats and navigation
- **Token count**: Shows total number of tokens
- **Quick access**: Direct link to token management

## Token Fields

| Field       | Type   | Required | Description                           |
| ----------- | ------ | -------- | ------------------------------------- |
| Name        | String | Yes      | Token name (e.g., "USDC")             |
| Label       | String | No       | Token label/symbol (e.g., "USD Coin") |
| Address     | String | Yes      | Solana token address                  |
| Description | String | No       | Token description                     |
| Tier        | Number | Yes      | Token tier (1=S, 2=A, 3=B, 4=C)       |
| Image       | String | No       | URL to token image                    |
| Ordering    | Number | No       | Display order for sorting             |

## Usage

### Accessing Token Management

1. Navigate to `/admin` (Admin Dashboard)
2. Click "Manage Tokens" or go directly to `/admin/tokens`

### Adding a New Token

1. Click "Add Token" button
2. Fill in required fields (Name, Address, Tier)
3. Optionally add image URL, label, description, and ordering
4. Click "Create Token"

### Editing a Token

1. Click the edit icon (pencil) in the actions column
2. Modify the desired fields
3. Click "Update Token"

### Deleting a Token

1. Click the delete icon (trash) in the actions column
2. Confirm deletion in the popup dialog
3. Token will be permanently removed

## Technical Implementation

### Components

- `TokenForm`: Modal form for adding/editing tokens
- `TokensTable`: Sortable table with token data
- `TokenTablePagination`: Pagination controls (future enhancement)

### State Management

- Uses React hooks for local state
- Jotai atoms for global state (if needed)
- Supabase for database operations

### Database Schema

```sql
CREATE TABLE tokens (
  address TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  label TEXT,
  description TEXT,
  tier INTEGER,
  image TEXT,
  ordering INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by TEXT
);
```

## Future Enhancements

- [ ] Bulk operations (import/export)
- [ ] Advanced filtering and search
- [ ] Token analytics and metrics
- [ ] Image upload functionality
- [ ] Token categories/tags
- [ ] Audit trail for changes
- [ ] Role-based permissions
