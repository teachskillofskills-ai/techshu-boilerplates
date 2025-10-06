# 📝 Form Components Boilerplate

Complete form component library with validation, error handling, and accessibility.

## ✨ Features

- ✅ **Form Inputs** - Text, email, password
- ✅ **Select Dropdowns** - Single/multi-select
- ✅ **Checkboxes** - Checkbox groups
- ✅ **Radio Buttons** - Radio groups
- ✅ **File Upload** - File input
- ✅ **Date Picker** - Date selection
- ✅ **Validation** - Form validation
- ✅ **Error Messages** - Error display
- ✅ **Loading States** - Submit loading
- ✅ **Accessibility** - ARIA labels

## 📦 Installation

```bash
npm install react-hook-form zod lucide-react
cp -r boilerplates/form-components/components ./src/components/forms
```

## 🚀 Quick Start

```typescript
import { Form, Input, Button } from '@/components/forms'

function MyForm() {
  return (
    <Form onSubmit={handleSubmit}>
      <Input
        name="email"
        type="email"
        label="Email"
        required
      />
      <Button type="submit">Submit</Button>
    </Form>
  )
}
```

## 💡 Use Cases

### Login Form

```typescript
<Form onSubmit={handleLogin}>
  <Input name="email" type="email" label="Email" />
  <Input name="password" type="password" label="Password" />
  <Button type="submit">Login</Button>
</Form>
```

---

**Need help?** Check the examples folder for complete implementations.

