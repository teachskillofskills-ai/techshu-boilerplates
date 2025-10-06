# 💾 Storage Optimization Boilerplate

An intelligent storage management system that automatically chooses the best storage method (cookies, localStorage, sessionStorage) based on data size, priority, and availability. Includes compression, automatic cleanup, and storage analytics.

## ✨ Features

- ✅ **Smart Storage Selection** - Automatically chooses optimal storage method
- ✅ **Priority-Based Storage** - Critical data in cookies, others in localStorage
- ✅ **Automatic Compression** - Compresses large data to save space
- ✅ **Fallback System** - Multiple fallback options if primary storage fails
- ✅ **Automatic Cleanup** - Removes expired and old data
- ✅ **Storage Analytics** - Track usage and available space
- ✅ **Cookie Size Optimization** - Keeps cookies under 4KB limit
- ✅ **TypeScript** - Full type safety
- ✅ **Zero Dependencies** - No external libraries required

## 📦 Installation

### 1. Copy Files

```bash
cp -r boilerplates/storage-optimization/lib ./src/lib/storage
```

### 2. Import and Use

```typescript
import { OptimizedStorage, optimizedStorage } from '@/lib/storage/optimized-storage'
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { optimizedStorage } from '@/lib/storage/optimized-storage'

// Store data (automatically chooses best storage method)
await optimizedStorage.setItem('user_preferences', {
  theme: 'dark',
  language: 'en'
}, 'important')

// Retrieve data
const preferences = await optimizedStorage.getItem('user_preferences')

// Remove data
optimizedStorage.removeItem('user_preferences')
```

### Priority Levels

```typescript
// Critical data - stored in cookies for immediate access
await optimizedStorage.setItem('auth_token', token, 'critical')

// Important data - stored in localStorage with compression
await optimizedStorage.setItem('user_profile', profile, 'important')

// Optional data - stored in sessionStorage
await optimizedStorage.setItem('temp_data', data, 'optional')
```

### Custom Configuration

```typescript
import { OptimizedStorage } from '@/lib/storage/optimized-storage'

const storage = new OptimizedStorage({
  maxCookieSize: 4096,           // 4KB cookie limit
  compressionThreshold: 1024,     // Compress if > 1KB
  fallbackToLocalStorage: true,   // Use localStorage as fallback
  enableCompression: true         // Enable compression
})

await storage.setItem('key', 'value')
```

## 📊 Storage Strategy

### Decision Flow

1. **Critical + Small** → Cookies (< 4KB)
2. **Large or Non-Critical** → localStorage (with compression if > 1KB)
3. **localStorage Full** → sessionStorage
4. **All Full** → Cookie with truncation warning

### Storage Limits

- **Cookies**: 4KB per cookie, ~50 cookies per domain
- **localStorage**: 5-10MB per domain
- **sessionStorage**: 5-10MB per domain

## 🔧 API Reference

### OptimizedStorage Class

#### setItem(key, value, priority)

Store data with automatic storage selection.

```typescript
await optimizedStorage.setItem(
  'key',
  { data: 'value' },
  'important' // 'critical' | 'important' | 'optional'
)
```

#### getItem(key)

Retrieve data from any storage location.

```typescript
const data = await optimizedStorage.getItem('key')
```

#### removeItem(key)

Remove data from all storage locations.

```typescript
optimizedStorage.removeItem('key')
```

#### cleanup(maxAge)

Remove expired data (default: 7 days).

```typescript
optimizedStorage.cleanup(7 * 24 * 60 * 60 * 1000) // 7 days
```

#### getStorageStats()

Get storage usage statistics.

```typescript
const stats = optimizedStorage.getStorageStats()
console.log(stats)
// {
//   cookies: { count: 5, totalSize: 2048 },
//   localStorage: { count: 10, totalSize: 50000, available: 5000000 },
//   sessionStorage: { count: 3, totalSize: 15000, available: 5000000 }
// }
```

## 💡 Use Cases

### 1. Authentication Tokens

```typescript
// Store auth token in cookies for server access
await optimizedStorage.setItem('auth_token', token, 'critical')
```

### 2. User Preferences

```typescript
// Store preferences in localStorage
await optimizedStorage.setItem('user_preferences', {
  theme: 'dark',
  fontSize: 'medium',
  notifications: true
}, 'important')
```

### 3. Session Data

```typescript
// Store temporary session data
await optimizedStorage.setItem('session_data', {
  currentPage: '/dashboard',
  scrollPosition: 100
}, 'optional')
```

### 4. Large Data with Compression

```typescript
// Automatically compresses if > 1KB
await optimizedStorage.setItem('large_dataset', {
  items: [...1000items],
  metadata: {...}
}, 'important')
```

## 🔒 Security Best Practices

1. **Never store sensitive data** - Use secure, httpOnly cookies for tokens
2. **Encrypt sensitive data** - Encrypt before storing
3. **Set appropriate priorities** - Critical data in cookies only
4. **Regular cleanup** - Remove old data regularly
5. **Validate data** - Always validate retrieved data

## 📈 Performance Tips

1. **Use priorities wisely** - Critical only for essential data
2. **Enable compression** - For data > 1KB
3. **Regular cleanup** - Prevent storage bloat
4. **Monitor usage** - Use getStorageStats()
5. **Batch operations** - Group related setItem calls

## 🐛 Troubleshooting

**Issue**: "Storage quota exceeded"
- **Solution**: Run cleanup(), reduce data size, or use compression

**Issue**: Data not persisting
- **Solution**: Check browser privacy settings, ensure storage is available

**Issue**: Slow performance
- **Solution**: Reduce compression threshold, use smaller data chunks

**Issue**: Cookies not working
- **Solution**: Check cookie size (< 4KB), ensure Secure flag on HTTPS

## 📚 Examples

### Example 1: User Session Management

```typescript
// Store user session
await optimizedStorage.setItem('user_session', {
  userId: '123',
  sessionId: 'abc',
  expiresAt: Date.now() + 3600000
}, 'critical')

// Retrieve session
const session = await optimizedStorage.getItem('user_session')

// Clear session on logout
optimizedStorage.removeItem('user_session')
```

### Example 2: Form Data Persistence

```typescript
// Auto-save form data
const saveFormData = async (formData) => {
  await optimizedStorage.setItem('form_draft', formData, 'important')
}

// Restore form data
const restoreFormData = async () => {
  return await optimizedStorage.getItem('form_draft')
}

// Clear after submission
const clearFormData = () => {
  optimizedStorage.removeItem('form_draft')
}
```

### Example 3: Storage Monitoring

```typescript
// Monitor storage usage
const monitorStorage = () => {
  const stats = optimizedStorage.getStorageStats()
  
  console.log('Storage Usage:')
  console.log(`Cookies: ${stats.cookies.totalSize} bytes`)
  console.log(`localStorage: ${stats.localStorage.totalSize} bytes`)
  console.log(`Available: ${stats.localStorage.available} bytes`)
  
  // Alert if running low
  if (stats.localStorage.available < 1000000) { // < 1MB
    console.warn('Storage running low!')
    optimizedStorage.cleanup() // Clean up old data
  }
}

// Run periodically
setInterval(monitorStorage, 60000) // Every minute
```

### Example 4: Automatic Cleanup

```typescript
// Clean up on app start
const initializeStorage = () => {
  // Remove data older than 7 days
  optimizedStorage.cleanup(7 * 24 * 60 * 60 * 1000)
  
  // Log stats
  const stats = optimizedStorage.getStorageStats()
  console.log('Storage initialized:', stats)
}

// Call on app initialization
initializeStorage()
```

## 🔄 Migration Guide

### From localStorage

```typescript
// Before
localStorage.setItem('key', JSON.stringify(value))
const value = JSON.parse(localStorage.getItem('key'))

// After
await optimizedStorage.setItem('key', value, 'important')
const value = await optimizedStorage.getItem('key')
```

### From Cookies

```typescript
// Before
document.cookie = `key=${value}; path=/`

// After
await optimizedStorage.setItem('key', value, 'critical')
```

## 📖 Advanced Usage

### Custom Storage Instance

```typescript
// Create custom instance for specific use case
const authStorage = new OptimizedStorage({
  maxCookieSize: 2048,        // Smaller cookies
  compressionThreshold: 512,   // Compress earlier
  enableCompression: true
})

await authStorage.setItem('token', token, 'critical')
```

### Storage Events

```typescript
// Listen for storage changes (localStorage only)
window.addEventListener('storage', (e) => {
  if (e.key === 'user_preferences') {
    console.log('Preferences changed:', e.newValue)
  }
})
```

## 🧪 Testing

```typescript
describe('OptimizedStorage', () => {
  test('stores and retrieves data', async () => {
    await optimizedStorage.setItem('test', { value: 123 }, 'important')
    const data = await optimizedStorage.getItem('test')
    expect(data.value).toBe(123)
  })
  
  test('cleans up old data', () => {
    optimizedStorage.cleanup(0) // Remove all
    const stats = optimizedStorage.getStorageStats()
    expect(stats.localStorage.count).toBe(0)
  })
})
```

## 📊 Storage Comparison

| Feature | Cookies | localStorage | sessionStorage |
|---------|---------|--------------|----------------|
| Size Limit | 4KB | 5-10MB | 5-10MB |
| Persistence | Expires | Permanent | Session |
| Server Access | Yes | No | No |
| Best For | Auth | Preferences | Temp Data |

## 🎯 Best Practices

1. **Use appropriate priorities** - Critical for auth, Important for preferences
2. **Enable compression** - For data > 1KB
3. **Regular cleanup** - Weekly or on app start
4. **Monitor usage** - Track storage stats
5. **Handle errors** - Always try/catch storage operations
6. **Validate data** - Check data integrity after retrieval
7. **Set expiration** - Include timestamps for time-sensitive data

---

**Need help?** Check the examples folder for complete implementations.

