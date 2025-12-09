# Lovable Hosting Setup Guide

This guide explains how to configure the Cloak Protocol frontend for 100% Lovable compatibility.

## ✅ What's Already Implemented

### 1. Enhanced Mock Data System
- **Location**: `src/lib/enhancedMockData.ts`
- **Features**:
  - 8 comprehensive RWA assets (credit, real estate, carbon, art, commodities, securities)
  - Realistic orders, positions, proofs, and trade history
  - Error message dictionary for all scenarios
  - Helper functions for calculations and simulations

### 2. Robust API Client
- **Location**: `src/lib/apiClient.ts`
- **Features**:
  - Automatic retry logic with exponential backoff
  - WebSocket support with auto-reconnect
  - Mock mode that works without backend
  - Type-safe requests with proper error handling
  - Auto-detects environment and switches to mock mode when needed

### 3. Error Boundary Component
- **Location**: `src/components/ErrorBoundary.tsx`
- **Status**: ✅ Already integrated in `App.tsx`
- **Features**:
  - Catches React errors and prevents app crashes
  - Displays user-friendly error messages
  - Provides one-click recovery and navigation options

## 🚀 Quick Start

### For Development (Mock Mode)

```bash
npm run dev:mock
```

This starts the development server with mock API enabled, so you can test without a backend.

### For Production Build (Lovable)

```bash
npm run build:production
```

This builds the app with production optimizations and automatically enables mock mode if no backend is available.

## 📝 Environment Configuration

### Create `.env.production` file

Create a `.env.production` file in the `frontend/` directory with:

```env
# Production Environment Variables for Lovable Hosting

# API Configuration - Use mock mode for Lovable
VITE_USE_MOCK_API=true
VITE_API_URL=http://localhost:8080

# Feature Flags
VITE_ENABLE_WEBSOCKET=false
VITE_ENABLE_REAL_PROOFS=false
VITE_DEBUG_MODE=false
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_USE_MOCK_API` | Enable mock mode (set to `true` for Lovable) | `false` |
| `VITE_API_URL` | Backend API URL | `http://localhost:8080` |
| `VITE_ENABLE_WEBSOCKET` | Enable WebSocket connections | `false` |
| `VITE_ENABLE_REAL_PROOFS` | Enable real ZK proof generation | `false` |
| `VITE_DEBUG_MODE` | Enable debug logging | `false` |

## 🔧 How It Works

### Automatic Mode Detection

The `createApiClient()` function automatically detects the environment:

1. **If `VITE_USE_MOCK_API=true`**: Uses `MockApiClient`
2. **If production mode without valid API URL**: Uses `MockApiClient`
3. **Otherwise**: Uses `CloakApiClient` with real backend

### Mock API Client Features

The `MockApiClient` provides:
- Realistic mock data from `enhancedMockData.ts`
- Simulated network latency
- Proper error handling
- All API methods return type-safe responses

### Using the API Client

```typescript
import { useApiClient } from '@/hooks/useApiClient';

function MyComponent() {
  const apiClient = useApiClient();
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await apiClient.getOrders();
      if (response.success) {
        setOrders(response.data || []);
      } else {
        console.error(response.error);
      }
    };
    fetchData();
  }, []);
}
```

## 📊 Mock Data Available

### RWA Assets (8 types)
- `RWA-CREDIT-01`: Private Credit Fund A
- `RWA-ESTATE-NYC`: Manhattan Commercial Property
- `RWA-CARBON-EU`: EU Carbon Credits 2025
- `RWA-ART-BASQUIAT`: Basquiat Artwork Fraction
- `RWA-GOLD-PAXG`: Tokenized Gold
- `RWA-TBILL-US`: US Treasury Bill Token
- `RWA-CREDIT-02`: SME Lending Pool
- `RWA-ESTATE-TOKYO`: Tokyo Residential Complex

### Mock Data Exports

```typescript
import {
  RWA_ASSETS,
  MOCK_ORDERS,
  MOCK_POSITIONS,
  MOCK_PROOFS,
  MOCK_TRADE_HISTORY,
  ERROR_MESSAGES
} from '@/lib/enhancedMockData';
```

## 🎯 Key Benefits

✅ **Works perfectly on Lovable without any backend**
✅ **Handles all errors gracefully with user-friendly messages**
✅ **Provides rich demo data with 8 RWA asset types**
✅ **Recovers automatically from network failures**
✅ **Supports WebSocket for real-time updates (when backend available)**
✅ **Production-ready with proper TypeScript types**
✅ **Scales easily with modular architecture**

## 🧪 Testing

### Test Mock Mode Locally

```bash
# Start dev server with mock mode
npm run dev:mock

# Build for production (auto-enables mock if no backend)
npm run build:production
npm run preview
```

### Verify Mock Mode is Active

Check the browser console - you should see:
```
Using Mock API Client (VITE_USE_MOCK_API=true)
```

or

```
Using Mock API Client (production mode without valid API URL)
```

## 📦 Deployment to Lovable

1. **Set Environment Variables** in Lovable dashboard:
   - `VITE_USE_MOCK_API=true`
   - `VITE_API_URL=http://localhost:8080` (or leave empty)

2. **Build Command**: `npm run build:production`

3. **Output Directory**: `dist`

4. **The app will automatically use mock mode** since no backend is available in production.

## 🔍 Troubleshooting

### Mock mode not working?

1. Check that `VITE_USE_MOCK_API=true` is set
2. Verify the environment variable is loaded: `console.log(import.meta.env.VITE_USE_MOCK_API)`
3. Check browser console for API client initialization messages

### Errors not being caught?

- The `ErrorBoundary` is already integrated in `App.tsx`
- Check that errors are React component errors (not async errors)
- For async errors, use try-catch and display user-friendly messages

### Need to switch to real backend?

1. Set `VITE_USE_MOCK_API=false`
2. Set `VITE_API_URL` to your backend URL
3. Restart the dev server or rebuild

## 📚 Additional Resources

- API Client: `src/lib/apiClient.ts`
- Mock Data: `src/lib/enhancedMockData.ts`
- Error Boundary: `src/components/ErrorBoundary.tsx`
- Hook: `src/hooks/useApiClient.ts`

