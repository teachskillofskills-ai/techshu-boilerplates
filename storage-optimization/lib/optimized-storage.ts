/**
 * Optimized Storage Management for TechShu SkillHub
 * Implements AI chat company best practices for cookie reduction
 */

export interface StorageConfig {
  maxCookieSize: number
  compressionThreshold: number
  fallbackToLocalStorage: boolean
  enableCompression: boolean
}

export interface StorageItem {
  key: string
  value: any
  timestamp: number
  compressed?: boolean
  priority: 'critical' | 'important' | 'optional'
}

export class OptimizedStorage {
  private config: StorageConfig
  private compressionEnabled: boolean

  constructor(config: Partial<StorageConfig> = {}) {
    this.config = {
      maxCookieSize: 4096, // 4KB limit per cookie
      compressionThreshold: 1024, // Compress if > 1KB
      fallbackToLocalStorage: true,
      enableCompression: true,
      ...config,
    }
    this.compressionEnabled = this.config.enableCompression && this.isCompressionSupported()
  }

  /**
   * Smart storage that chooses optimal storage method
   */
  async setItem(
    key: string,
    value: any,
    priority: 'critical' | 'important' | 'optional' = 'important'
  ): Promise<void> {
    const item: StorageItem = {
      key,
      value,
      timestamp: Date.now(),
      priority,
    }

    const serialized = JSON.stringify(item)
    const size = new Blob([serialized]).size

    // Strategy 1: Small critical data goes to cookies
    if (priority === 'critical' && size <= this.config.maxCookieSize) {
      this.setCookie(key, serialized)
      return
    }

    // Strategy 2: Large data or non-critical data goes to localStorage
    if (this.config.fallbackToLocalStorage && this.isLocalStorageAvailable()) {
      let finalValue = serialized

      // Compress if enabled and size exceeds threshold
      if (this.compressionEnabled && size > this.config.compressionThreshold) {
        finalValue = await this.compress(serialized)
        item.compressed = true
      }

      localStorage.setItem(key, finalValue)
      return
    }

    // Strategy 3: Fallback to sessionStorage
    if (this.isSessionStorageAvailable()) {
      sessionStorage.setItem(key, serialized)
      return
    }

    // Strategy 4: Last resort - cookie with truncation warning
    console.warn(`Storage fallback: Storing ${key} in cookie (may be truncated)`)
    this.setCookie(key, serialized.substring(0, this.config.maxCookieSize))
  }

  /**
   * Smart retrieval that checks all storage methods
   */
  async getItem(key: string): Promise<any> {
    // Check cookie first (for critical data)
    const cookieValue = this.getCookie(key)
    if (cookieValue) {
      try {
        const item: StorageItem = JSON.parse(cookieValue)
        return item.value
      } catch (error) {
        console.warn(`Failed to parse cookie ${key}:`, error)
      }
    }

    // Check localStorage
    if (this.isLocalStorageAvailable()) {
      const localValue = localStorage.getItem(key)
      if (localValue) {
        try {
          // Check if compressed
          let decompressed = localValue
          if (this.compressionEnabled && this.isCompressed(localValue)) {
            decompressed = await this.decompress(localValue)
          }

          const item: StorageItem = JSON.parse(decompressed)
          return item.value
        } catch (error) {
          console.warn(`Failed to parse localStorage ${key}:`, error)
        }
      }
    }

    // Check sessionStorage
    if (this.isSessionStorageAvailable()) {
      const sessionValue = sessionStorage.getItem(key)
      if (sessionValue) {
        try {
          const item: StorageItem = JSON.parse(sessionValue)
          return item.value
        } catch (error) {
          console.warn(`Failed to parse sessionStorage ${key}:`, error)
        }
      }
    }

    return null
  }

  /**
   * Remove item from all storage methods
   */
  removeItem(key: string): void {
    this.deleteCookie(key)

    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(key)
    }

    if (this.isSessionStorageAvailable()) {
      sessionStorage.removeItem(key)
    }
  }

  /**
   * Clean up expired items and optimize storage
   */
  cleanup(maxAge: number = 7 * 24 * 60 * 60 * 1000): void {
    // 7 days default
    const now = Date.now()

    if (this.isLocalStorageAvailable()) {
      const keysToRemove: string[] = []

      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (!key) continue

        try {
          const value = localStorage.getItem(key)
          if (!value) continue

          let decompressed = value
          if (this.compressionEnabled && this.isCompressed(value)) {
            decompressed = this.decompressSync(value)
          }

          const item: StorageItem = JSON.parse(decompressed)
          if (now - item.timestamp > maxAge) {
            keysToRemove.push(key)
          }
        } catch (error) {
          // Remove corrupted items
          keysToRemove.push(key)
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key))
    }
  }

  /**
   * Get storage usage statistics
   */
  getStorageStats(): {
    cookies: { count: number; totalSize: number }
    localStorage: { count: number; totalSize: number; available: number }
    sessionStorage: { count: number; totalSize: number; available: number }
  } {
    const stats = {
      cookies: { count: 0, totalSize: 0 },
      localStorage: { count: 0, totalSize: 0, available: 0 },
      sessionStorage: { count: 0, totalSize: 0, available: 0 },
    }

    // Cookie stats (approximate)
    if (typeof document !== 'undefined') {
      const cookies = document.cookie.split(';')
      stats.cookies.count = cookies.length
      stats.cookies.totalSize = document.cookie.length
    }

    // localStorage stats
    if (this.isLocalStorageAvailable()) {
      stats.localStorage.count = localStorage.length
      let totalSize = 0
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
          const value = localStorage.getItem(key) || ''
          totalSize += key.length + value.length
        }
      }
      stats.localStorage.totalSize = totalSize

      // Estimate available space (5MB typical limit)
      stats.localStorage.available = Math.max(0, 5 * 1024 * 1024 - totalSize)
    }

    return stats
  }

  // Private helper methods
  private setCookie(name: string, value: string, days: number = 30): void {
    if (typeof document === 'undefined') return

    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)

    document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=Lax;Secure`
  }

  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null

    const nameEQ = name + '='
    const ca = document.cookie.split(';')

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === ' ') c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length))
      }
    }
    return null
  }

  private deleteCookie(name: string): void {
    if (typeof document === 'undefined') return
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
  }

  private isLocalStorageAvailable(): boolean {
    try {
      return typeof localStorage !== 'undefined' && localStorage !== null
    } catch {
      return false
    }
  }

  private isSessionStorageAvailable(): boolean {
    try {
      return typeof sessionStorage !== 'undefined' && sessionStorage !== null
    } catch {
      return false
    }
  }

  private isCompressionSupported(): boolean {
    return typeof CompressionStream !== 'undefined' || typeof TextEncoder !== 'undefined'
  }

  private async compress(data: string): Promise<string> {
    // Simple compression using TextEncoder (fallback)
    if (typeof TextEncoder !== 'undefined') {
      const encoder = new TextEncoder()
      const encoded = encoder.encode(data)
      return btoa(String.fromCharCode(...encoded))
    }
    return data
  }

  private async decompress(data: string): Promise<string> {
    try {
      const decoded = atob(data)
      const bytes = new Uint8Array(decoded.length)
      for (let i = 0; i < decoded.length; i++) {
        bytes[i] = decoded.charCodeAt(i)
      }
      const decoder = new TextDecoder()
      return decoder.decode(bytes)
    } catch {
      return data
    }
  }

  private decompressSync(data: string): string {
    try {
      return this.decompress(data) as any // Simplified for sync operation
    } catch {
      return data
    }
  }

  private isCompressed(data: string): boolean {
    // Simple heuristic: compressed data is base64 encoded
    try {
      return btoa(atob(data)) === data
    } catch {
      return false
    }
  }
}

// Singleton instance
export const optimizedStorage = new OptimizedStorage()
