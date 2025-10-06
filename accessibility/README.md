# ♿ Accessibility Components Boilerplate

Complete accessibility toolkit for WCAG compliance and inclusive design.

## ✨ Features

- ✅ **ARIA Labels** - Screen reader support
- ✅ **Keyboard Navigation** - Full keyboard support
- ✅ **Focus Management** - Focus indicators
- ✅ **Skip Links** - Skip to content
- ✅ **Color Contrast** - WCAG AA/AAA
- ✅ **Screen Reader** - Announcements
- ✅ **Alt Text** - Image descriptions
- ✅ **Form Labels** - Proper labeling
- ✅ **Error Messages** - Accessible errors
- ✅ **Live Regions** - Dynamic updates

## 📦 Installation

```bash
npm install @radix-ui/react-accessible-icon
cp -r boilerplates/accessibility/components ./src/components/a11y
cp -r boilerplates/accessibility/lib ./src/lib/a11y
```

## 🚀 Quick Start

```typescript
import { SkipLink, FocusTrap, ScreenReaderOnly } from '@/components/a11y'

function App() {
  return (
    <>
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <nav>...</nav>
      <main id="main-content">
        <FocusTrap>
          <Modal>...</Modal>
        </FocusTrap>
      </main>
    </>
  )
}
```

## 💡 Use Cases

### Accessible Button

```typescript
<button
  aria-label="Close dialog"
  aria-pressed={isPressed}
  onClick={handleClick}
>
  <X aria-hidden="true" />
  <ScreenReaderOnly>Close</ScreenReaderOnly>
</button>
```

### Accessible Form

```typescript
<form>
  <label htmlFor="email">Email</label>
  <input
    id="email"
    type="email"
    aria-required="true"
    aria-invalid={hasError}
    aria-describedby="email-error"
  />
  {hasError && (
    <span id="email-error" role="alert">
      Please enter a valid email
    </span>
  )}
</form>
```

---

**Need help?** Check the examples folder for complete implementations.

