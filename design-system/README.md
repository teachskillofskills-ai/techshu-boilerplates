# 🎨 Design System Boilerplate

A complete, production-ready design system with contextual themes, beautiful gradients, design tokens, and React hooks for consistent UI across your application.

## ✨ Features

- ✅ **Contextual Themes** - 5 pre-built themes (Admin, Learning, Course, Success, Brand)
- ✅ **Design Tokens** - Complete token system for colors, spacing, shadows, borders
- ✅ **Gradient Generator** - Beautiful, harmonious gradients
- ✅ **React Hooks** - Easy-to-use hooks for accessing design system
- ✅ **Color Palettes** - 11-shade palettes for each color
- ✅ **CSS Variables** - Automatic CSS variable generation
- ✅ **TypeScript** - Full type safety
- ✅ **Customizable** - Easy to customize and extend
- ✅ **Responsive** - Mobile-first design
- ✅ **Accessible** - WCAG compliant color contrasts

## 📦 Installation

### 1. Copy Files

```bash
# Copy the design system to your project
cp -r boilerplates/design-system/lib ./src/lib/design-system
```

### 2. Install Dependencies

```bash
npm install react
# No additional dependencies required!
```

### 3. Import in Your App

```typescript
import { useTheme, useGradient } from '@/lib/design-system/hooks'
```

## 📁 File Structure

```
design-system/
├── README.md
├── lib/
│   ├── tokens.ts          # Design tokens and color palettes
│   ├── themes.ts          # Theme generation
│   ├── gradients.ts       # Gradient generator
│   ├── config.ts          # Configuration system
│   └── hooks.ts           # React hooks
├── examples/
│   ├── basic-usage.tsx
│   ├── custom-theme.tsx
│   ├── gradient-buttons.tsx
│   └── hero-section.tsx
└── types/
    └── index.ts           # TypeScript types
```

## 🚀 Quick Start

### Basic Usage

```typescript
import { useTheme, useGradient } from '@/lib/design-system/hooks'

function MyComponent() {
  // Get theme for a context
  const theme = useTheme('learning')
  
  // Get gradient styles
  const gradient = useGradient('learning', 'primary')
  
  return (
    <div style={gradient.style}>
      <h1 style={{ color: theme.primary[500] }}>
        Hello Design System!
      </h1>
    </div>
  )
}
```

### Using Contextual Themes

```typescript
import { useTheme, useContextColors } from '@/lib/design-system/hooks'

function AdminButton() {
  const colors = useContextColors('admin')
  
  return (
    <button style={{
      background: colors.main,
      color: colors.contrast
    }}>
      Admin Action
    </button>
  )
}

function LearningButton() {
  const colors = useContextColors('learning')
  
  return (
    <button style={{
      background: colors.main,
      color: colors.contrast
    }}>
      Start Learning
    </button>
  )
}
```

### Gradient Buttons

```typescript
import { useGradient } from '@/lib/design-system/hooks'

function GradientButton({ context, children }) {
  const gradient = useGradient(context, 'primary')
  
  return (
    <button 
      style={{
        ...gradient.style,
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        border: 'none',
        cursor: 'pointer'
      }}
    >
      {children}
    </button>
  )
}

// Usage
<GradientButton context="learning">Enroll Now</GradientButton>
<GradientButton context="admin">Manage Users</GradientButton>
<GradientButton context="success">Complete</GradientButton>
```

### Hero Section

```typescript
import { useHeroStyles } from '@/lib/design-system/hooks'

function HeroSection() {
  const heroStyles = useHeroStyles('brand')
  
  return (
    <section style={heroStyles}>
      <h1>Welcome to Our Platform</h1>
      <p>Start your learning journey today</p>
    </section>
  )
}
```

### Card Styles

```typescript
import { useCardStyles } from '@/lib/design-system/hooks'

function CourseCard({ course }) {
  const cardStyles = useCardStyles('course')
  
  return (
    <div style={cardStyles}>
      <h3>{course.title}</h3>
      <p>{course.description}</p>
    </div>
  )
}
```

## 🎨 Available Contexts

### 1. Admin Context (Red/Orange)
```typescript
const theme = useTheme('admin')
// Primary: Red (#ef4444)
// Secondary: Orange (#f97316)
// Use for: Admin panels, management interfaces
```

### 2. Learning Context (Pink/Rose)
```typescript
const theme = useTheme('learning')
// Primary: Pink (#ff3968) - TechShu brand
// Secondary: Rose (#ff6b47) - TechShu coral
// Use for: Learning actions, student features
```

### 3. Course Context (Blue/Indigo)
```typescript
const theme = useTheme('course')
// Primary: Blue (#3b82f6)
// Secondary: Indigo (#6366f1)
// Use for: Course content, educational materials
```

### 4. Success Context (Green/Teal)
```typescript
const theme = useTheme('success')
// Primary: Emerald (#10b981)
// Secondary: Teal (#14b8a6)
// Use for: Completion states, achievements
```

### 5. Brand Context (Brand Colors)
```typescript
const theme = useTheme('brand')
// Primary: Pink (#ff3968)
// Secondary: Rose (#ff6b47)
// Use for: Marketing, landing pages
```

## 🎯 React Hooks API

### useDesignTokens()
Get all design tokens
```typescript
const tokens = useDesignTokens()
console.log(tokens.brand.name) // "TechShu SkillHub"
console.log(tokens.global.borderRadius.md) // "0.5rem"
```

### useTheme(context)
Get theme for specific context
```typescript
const theme = useTheme('learning')
console.log(theme.primary[500]) // "#ff3968"
```

### useGradient(context, type)
Get gradient styles
```typescript
const gradient = useGradient('admin', 'primary')
// Returns: { className: string, style: CSSProperties }
```

### useContextColors(context)
Get color shortcuts
```typescript
const colors = useContextColors('course')
// Returns: { primary, secondary, main, light, dark, contrast }
```

### useButtonStyles(context)
Get button styles
```typescript
const buttonStyles = useButtonStyles('learning')
// Returns: { primary, secondary, outline }
```

### useCardStyles(context)
Get card styles
```typescript
const cardStyles = useCardStyles('course')
```

### useHeroStyles(context)
Get hero section styles
```typescript
const heroStyles = useHeroStyles('brand')
```

### useTextColors(context)
Get text color variants
```typescript
const textColors = useTextColors('admin')
// Returns: { primary, secondary, muted, light, contrast, onPrimary, onSecondary }
```

### useAnimationStyles(context)
Get animation styles
```typescript
const animations = useAnimationStyles('success')
// Returns: { pulse, bounce, glow }
```

## 🔧 Customization

### Create Custom Theme

```typescript
import { DesignSystemConfig } from './lib/config'

const customConfig: DesignSystemConfig = {
  name: 'My App',
  version: '1.0.0',
  theme: 'custom',
  contexts: {
    admin: {
      name: 'Admin',
      primaryColor: '#8b5cf6', // Purple
      secondaryColor: '#ec4899', // Pink
      intensity: 'vibrant',
      style: 'modern'
    },
    // ... other contexts
  }
}
```

### Generate Custom Gradients

```typescript
import { GradientGenerator } from './lib/gradients'
import { colorPalettes } from './lib/tokens'

const customGradient = GradientGenerator.createHarmoniousGradient(
  colorPalettes.learningPink,
  colorPalettes.courseBlue,
  'intense',
  'to-br'
)

const cssStyle = GradientGenerator.toCSSStyle(customGradient)
```

### Extend Color Palettes

```typescript
import { ColorPalette } from './lib/tokens'

const myCustomPalette: ColorPalette = {
  50: '#faf5ff',
  100: '#f3e8ff',
  200: '#e9d5ff',
  300: '#d8b4fe',
  400: '#c084fc',
  500: '#a855f7', // Base color
  600: '#9333ea',
  700: '#7e22ce',
  800: '#6b21a8',
  900: '#581c87',
  950: '#3b0764'
}
```

## 📊 Design Tokens

### Colors
- 11-shade palettes (50-950)
- 8 color palettes included
- Harmonious color relationships

### Spacing
```typescript
xs: '0.5rem'   // 8px
sm: '1rem'     // 16px
md: '1.5rem'   // 24px
lg: '2rem'     // 32px
xl: '3rem'     // 48px
```

### Border Radius
```typescript
sm: '0.375rem' // 6px
md: '0.5rem'   // 8px
lg: '0.75rem'  // 12px
xl: '1rem'     // 16px
```

### Shadows
```typescript
sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)'
md: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)'
```

## 🎨 Gradient Types

- **primary** - Main action gradients
- **secondary** - Less prominent actions
- **subtle** - Background gradients
- **intense** - Hero sections
- **hero** - Hero backgrounds
- **card** - Card backgrounds

## 🔒 Best Practices

1. **Consistency** - Use contextual themes consistently
2. **Accessibility** - Check color contrast ratios
3. **Performance** - Use useMemo for expensive calculations
4. **Responsive** - Test on all screen sizes
5. **Dark Mode** - Consider dark mode variants

## 🐛 Troubleshooting

**Issue**: Colors not showing
- **Solution**: Ensure you've imported the hooks correctly
- Check that Tailwind CSS is configured if using className

**Issue**: Gradients not rendering
- **Solution**: Use the `style` property, not `className` for inline styles
- For Tailwind, use `className` property

**Issue**: TypeScript errors
- **Solution**: Ensure all types are imported
- Check that context names are correct

## 📈 Performance Tips

1. **Use hooks at component level** - Not inside loops
2. **Memoize expensive calculations** - Hooks already use useMemo
3. **Avoid inline style objects** - Use hooks to generate styles once
4. **CSS Variables** - Consider using CSS variables for better performance

## 📚 Examples

Check the `examples/` folder for:
- Basic usage examples
- Custom theme creation
- Gradient button components
- Hero section implementation
- Card styling
- Animation examples

## 🔄 Migration Guide

### From Tailwind CSS

```typescript
// Before (Tailwind)
<div className="bg-gradient-to-r from-pink-500 to-rose-500">

// After (Design System)
const gradient = useGradient('learning', 'primary')
<div style={gradient.style}>
```

### From CSS-in-JS

```typescript
// Before (styled-components)
const Button = styled.button`
  background: linear-gradient(to right, #ff3968, #ff6b47);
`

// After (Design System)
const gradient = useGradient('learning', 'primary')
<button style={gradient.style}>
```

## 📖 Resources

- [Design Tokens Specification](https://design-tokens.github.io/community-group/)
- [Color Theory Guide](https://www.interaction-design.org/literature/topics/color-theory)
- [Gradient Design Tips](https://www.smashingmagazine.com/2022/01/css-gradient-design/)

---

**Need help?** Check the examples folder for complete implementations.

