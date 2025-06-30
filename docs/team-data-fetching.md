# Team Data Fetching

This document explains how team data is fetched for tokens in the application.

## Overview

The application now fetches team data from the database for each token address, replacing the previous hardcoded approach.

## Database Schema

The `teams` table has the following structure:

```sql
teams: {
  id: string
  address: string | null  -- Foreign key to tokens.address
  name: string | null
  description: string | null
  image: string | null
  role: string | null
  x_account: string | null
}
```

The relationship is:

- One token can have multiple team members (one-to-many)
- Foreign key: `teams.address` → `tokens.address`

## Implementation

### 1. useTeams Hook (`hooks/use-teams.ts`)

```typescript
export function useTeams(address: string) {
  const {
    data: teams = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['teams', address],
    queryFn: () => fetchTeams(address),
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return { teams, loading, error, refetch };
}
```

### 2. Token Detail Page Integration

The `TokenDetailPage` component now uses the `useTeams` hook to fetch and display team data:

```typescript
const { teams, loading: teamsLoading, error: teamsError } = useTeams(address);
```

### 3. UI Components

The team section displays:

- Team member avatars (with fallback to placeholder)
- Names and roles
- Twitter/X account links
- Descriptions
- Responsive grid layout

## Features

- **Real-time data**: Fetches from database instead of hardcoded data
- **Error handling**: Displays appropriate error messages
- **Loading states**: Shows loading indicators
- **Empty states**: Handles cases with no team members
- **Responsive design**: Adapts to different screen sizes
- **Type safety**: Full TypeScript support with database types

## Usage

To use team data in any component:

```typescript
import { useTeams, type Team } from '@/hooks/use-teams';

function MyComponent({ tokenAddress }: { tokenAddress: string }) {
  const { teams, loading, error } = useTeams(tokenAddress);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {teams.map((team: Team) => (
        <div key={team.id}>
          <h3>{team.name}</h3>
          <p>{team.role}</p>
        </div>
      ))}
    </div>
  );
}
```

## Database Setup

To add team data to the database:

```sql
INSERT INTO teams (address, name, role, description, image, x_account)
VALUES (
  'token_address_here',
  'Team Member Name',
  'Developer',
  'Team member description',
  'https://example.com/image.jpg',
  'twitter_handle'
);
```

## Migration from Hardcoded Data

The application previously used hardcoded team data in `lib/tokens.ts`. The new implementation:

1. Fetches data dynamically from the database
2. Provides better performance through caching
3. Allows real-time updates without code changes
4. Maintains backward compatibility with existing UI patterns
