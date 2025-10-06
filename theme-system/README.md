# 🎨 Theme System Boilerplate

A complete theme system with dark/light mode, user preferences, accessibility features, and persistent settings.

## ✨ Features

- ✅ Dark/Light/Auto theme modes
- ✅ System preference detection
- ✅ Font size control (Small/Medium/Large)
- ✅ High contrast mode
- ✅ Reduced motion support
- ✅ Compact mode
- ✅ Persistent user preferences
- ✅ Real-time theme switching
- ✅ CSS variable-based theming
- ✅ Supabase integration for syncing

## 📦 Installation

### 1. Install Dependencies

```bash
npm install
# No additional dependencies needed - uses React built-ins
```

### 2. Environment Variables

Uses existing Supabase configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup (Optional)

If you want to persist preferences to database:

```bash
psql -f database/user_preferences_table.sql
```

## 📁 File Structure

```
theme-system/
├── README.md
├── providers/
│   └── ThemeProvider.tsx       # Main theme context provider
├── components/
│   ├── ThemeToggle.tsx         # Theme switcher button
│   ├── ThemeSettings.tsx       # Full settings panel
│   └── AccessibilitySettings.tsx # A11y controls
├── hooks/
│   ├── useTheme.tsx            # Theme hook
│   └── useUserPreferences.ts   # Preferences hook
├── lib/
│   └── theme-utils.ts          # Theme utilities
├── styles/
│   ├── themes.css              # CSS variables for themes
│   └── accessibility.css       # A11y styles
├── database/
│   └── user_preferences_table.sql
└── examples/
    ├── basic-usage.tsx
    └── advanced-usage.tsx
```

## 🚀 Quick Start

### 1. Wrap Your App with ThemeProvider

```tsx
// app/layout.tsx
import { ThemeProvider } from '@/boilerplates/theme-system/providers/ThemeProvider'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### 2. Add Theme Toggle

```tsx
// components/Header.tsx
import { ThemeToggle } from '@/boilerplates/theme-system/components/ThemeToggle'

export function Header() {
  return (
    <header>
      <nav>
        {/* Your navigation */}
        <ThemeToggle />
      </nav>
    </header>
  )
}
```

### 3. Use Theme in Components

```tsx
'use client'

import { useTheme } from '@/boilerplates/theme-system/hooks/useTheme'

export function MyComponent() {
  const { theme, setTheme, fontSize, setFontSize } = useTheme()

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
      <button onClick={() => setTheme('light')}>Light Mode</button>
      <button onClick={() => setFontSize('large')}>Large Text</button>
    </div>
  )
}
```

## 🎨 Theme Configuration

### Available Themes

- **light** - Light mode with bright colors
- **dark** - Dark mode with muted colors
- **auto** - Follows system preference

### Font Sizes

- **small** - 14px base
- **medium** - 16px base (default)
- **large** - 18px base

### Accessibility Options

- **reducedMotion** - Disables animations
- **highContrast** - Increases contrast ratios
- **compactMode** - Reduces spacing

## 🎯 Advanced Usage

### Full Settings Panel

```tsx
import { ThemeSettings } from '@/boilerplates/theme-system/components/ThemeSettings'

export function SettingsPage() {
  return (
    <div>
      <h1>Settings</h1>
      <ThemeSettings />
    </div>
  )
}
```

### Programmatic Theme Control

```tsx
'use client'

import { useTheme } from '@/boilerplates/theme-system/hooks/useTheme'
import { useEffect } from 'react'

export function AutoThemeComponent() {
  const { setTheme } = useTheme()

  useEffect(() => {
    // Set theme based on time of day
    const hour = new Date().getHours()
    if (hour >= 18 || hour < 6) {
      setTheme('dark')
    } else {
      setTheme('light')
    }
  }, [setTheme])

  return <div>Theme auto-adjusted</div>
}
```

### Load User Preferences

```tsx
'use client'

import { useTheme } from '@/boilerplates/theme-system/hooks/useTheme'
import { useEffect } from 'react'

export function UserPreferencesLoader({ userId }) {
  const { loadUserPreferences } = useTheme()

  useEffect(() => {
    if (userId) {
      loadUserPreferences(userId)
    }
  }, [userId, loadUserPreferences])

  return null
}
```

## 🎨 CSS Variables

The theme system uses CSS variables that you can use in your styles:

```css
/* Light theme */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  /* ... more variables */
}

/* Dark theme */
[data-theme="dark"] {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --secondary: 217.2 32.6% 17.5%;
  /* ... more variables */
}

/* Usage in your components */
.my-component {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}
```

## 🔧 Customization

### Add Custom Theme

```tsx
// lib/theme-utils.ts
export const themes = {
  light: { /* ... */ },
  dark: { /* ... */ },
  custom: {
    background: '#f0f0f0',
    foreground: '#333333',
    primary: '#ff6b6b',
    // ... more colors
  }
}
```

### Custom Font Sizes

```tsx
// providers/ThemeProvider.tsx
const fontSizes = {
  small: '14px',
  medium: '16px',
  large: '18px',
  xlarge: '20px', // Add custom size
}
```

## 📊 Theme Persistence

### Local Storage

Preferences are automatically saved to localStorage:

```typescript
// Saved keys:
// - theme-preference
// - font-size-preference
// - reduced-motion-preference
// - high-contrast-preference
// - compact-mode-preference
```

### Database Sync

If user is authenticated, preferences sync to Supabase:

```sql
-- user_preferences table
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY,
  theme TEXT,
  font_size TEXT,
  reduced_motion BOOLEAN,
  high_contrast BOOLEAN,
  compact_mode BOOLEAN,
  updated_at TIMESTAMPTZ
);
```

## 🎯 Accessibility Features

### Reduced Motion

Respects `prefers-reduced-motion` and allows manual override:

```tsx
const { reducedMotion, setReducedMotion } = useTheme()

<div className={reducedMotion ? 'no-animation' : 'with-animation'}>
  Content
</div>
```

### High Contrast

Increases contrast for better readability:

```tsx
const { highContrast } = useTheme()

<div className={highContrast ? 'high-contrast' : ''}>
  Content
</div>
```

### Keyboard Navigation

All theme controls are keyboard accessible:
- `Tab` - Navigate between controls
- `Space/Enter` - Activate buttons
- `Arrow keys` - Navigate radio groups

## 🧪 Testing

### Test Theme Switching

```typescript
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from './providers/ThemeProvider'

test('theme switches correctly', () => {
  render(
    <ThemeProvider>
      <YourComponent />
    </ThemeProvider>
  )
  
  // Test theme switching logic
})
```

### Test Persistence

```typescript
test('theme persists to localStorage', () => {
  const { result } = renderHook(() => useTheme(), {
    wrapper: ThemeProvider
  })
  
  act(() => {
    result.current.setTheme('dark')
  })
  
  expect(localStorage.getItem('theme-preference')).toBe('dark')
})
```

## 🐛 Troubleshooting

### Issue: Theme flickers on page load

**Solution**: Add theme script to `<head>`:

```html
<script>
  (function() {
    const theme = localStorage.getItem('theme-preference') || 'light'
    document.documentElement.setAttribute('data-theme', theme)
  })()
</script>
```

### Issue: System theme not detected

**Solution**: Check browser support for `prefers-color-scheme`:

```typescript
const supportsColorScheme = window.matchMedia('(prefers-color-scheme)').media !== 'not all'
```

### Issue: Preferences not syncing

**Solution**: Verify Supabase connection and RLS policies

## 📚 API Reference

### useTheme Hook

```typescript
const {
  theme,              // 'light' | 'dark' | 'auto'
  setTheme,           // (theme: Theme) => void
  fontSize,           // 'small' | 'medium' | 'large'
  setFontSize,        // (size: FontSize) => void
  reducedMotion,      // boolean
  setReducedMotion,   // (reduced: boolean) => void
  highContrast,       // boolean
  setHighContrast,    // (contrast: boolean) => void
  compactMode,        // boolean
  setCompactMode,     // (compact: boolean) => void
  loadUserPreferences // (userId: string) => void
} = useTheme()
```

## 🎓 Examples

Check the `examples/` folder for:
- Basic theme switching
- Advanced customization
- Integration with forms
- Server-side rendering
- Accessibility features

## 📈 Performance

- Minimal re-renders with React Context
- CSS variables for instant theme switching
- LocalStorage for fast persistence
- Debounced database updates

## 🔄 Migration

### From other theme systems

1. Replace theme provider
2. Update CSS variables
3. Migrate preference storage
4. Test all components

## 📖 Resources

- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)

---

**Need help?** Check the examples folder for complete implementations.

