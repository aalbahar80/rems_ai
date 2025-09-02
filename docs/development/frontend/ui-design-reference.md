# REMS Frontend UI Design & Styling Reference

**Last Updated**: September 2, 2025  
**Version**: 1.0  
**Tech Stack**: Next.js 15 + Tailwind CSS v4 + TypeScript

---

## 🎨 Design System Overview

### **Design Philosophy**

The REMS frontend implements a modern **glassmorphism design system** with the following principles:

1. **Multi-Tenant Theming**: Portal-specific color schemes for different user roles
2. **Glassmorphism Aesthetics**: Transparent backgrounds with blur effects for modern appearance
3. **Accessibility First**: High contrast ratios and proper focus management
4. **Responsive Design**: Mobile-first approach with adaptive layouts
5. **Professional Appearance**: Clean, minimalist design suitable for business applications

### **Color Palette & Theming**

#### **Base Colors**

```css
/* Primary Brand Colors */
primary: {
  50: '#f0f9ff',
  100: '#e0f2fe',
  500: '#0ea5e9',
  600: '#0284c7',
  700: '#0369a1',
  800: '#075985',
  900: '#0c4a6e',
}
```

#### **Portal-Specific Themes**

```css
/* Admin Portal Theme */
.theme-admin {
  --primary: 38 92% 50%; /* Amber/Orange */
  --primary-foreground: 38 92% 98%;
  --accent: 38 92% 96%;
}

/* Accountant Portal Theme */
.theme-accountant {
  --primary: 158 64% 52%; /* Green */
  --primary-foreground: 158 64% 98%;
  --accent: 158 64% 96%;
}

/* Owner Portal Theme */
.theme-owner {
  --primary: 322 87% 55%; /* Pink/Magenta */
  --primary-foreground: 322 87% 98%;
  --accent: 322 87% 96%;
}

/* Tenant Portal Theme */
.theme-tenant {
  --primary: 258 90% 66%; /* Purple */
  --primary-foreground: 258 90% 98%;
  --accent: 258 90% 96%;
}
```

#### **Semantic Colors**

```css
success: {
  50: '#f0fdf4',
  500: '#22c55e',
  600: '#16a34a',
}
warning: {
  50: '#fffbeb',
  500: '#f59e0b',
  600: '#d97706',
}
error: {
  50: '#fef2f2',
  500: '#ef4444',
  600: '#dc2626',
}
```

---

## 🪟 Glassmorphism Design System

### **Core Glassmorphism Components**

#### **1. Modal Backgrounds**

```css
/* Standard Modal Background */
.modal-background {
  @apply bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-lg shadow-xl border;
}
```

**Implementation Example:**

```typescript
// Modal Component (src/components/ui/modal.tsx)
<div className="relative w-full mx-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-lg shadow-xl border">
  {children}
</div>
```

#### **2. Dropdown Menus**

```css
/* Standard Dropdown Background */
.dropdown-background {
  @apply bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border rounded-md shadow-lg;
}
```

**Implementation Examples:**

```typescript
// Header User Dropdown
<div className="absolute right-0 mt-2 w-48 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border rounded-md shadow-lg z-50">

// Firm Selector Dropdown
<div className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border rounded-md shadow-lg z-50">

// Action Menu Dropdown
<div className="absolute right-0 top-full mt-1 w-48 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border rounded-md shadow-lg z-20">
```

#### **3. Mobile Menu Interface**

```css
/* Mobile Menu Background */
.mobile-menu-background {
  @apply bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t;
}
```

### **Glassmorphism Standards**

#### **Opacity Standards**

- **Primary Backgrounds**: 95% opacity (`bg-white/95`, `dark:bg-slate-900/95`)
- **Secondary Backgrounds**: 90% opacity for less prominent elements
- **Overlay Backgrounds**: 50% opacity (`bg-black/50`) for modal backdrops

#### **Blur Effects**

- **Standard Blur**: `backdrop-blur-md` (8px blur radius)
- **Light Blur**: `backdrop-blur-sm` (4px blur radius) for subtle effects
- **Heavy Blur**: `backdrop-blur-lg` (16px blur radius) for strong effects

#### **Shadow System**

- **Modal Shadows**: `shadow-xl` for prominent modals
- **Dropdown Shadows**: `shadow-lg` for dropdown menus
- **Card Shadows**: `shadow-md` for standard card components

---

## 🎭 Component Architecture

### **Form Components**

#### **FormField Component Pattern**

```typescript
// Optimized FormField Pattern (Prevents Re-rendering Issues)
const FormField = ({
  label,
  required = false,
  children,
  error
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}) => (
  <div className="space-y-2">
    <label className="text-sm font-medium text-foreground">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-xs text-red-600">{error}</p>
    )}
  </div>
);

// CRITICAL: Define FormField OUTSIDE main component to prevent re-creation
export function MyModal() {
  // Use FormField here - it won't be recreated on re-render
  return <FormField>...</FormField>;
}
```

### **Modal Components**

#### **Standard Modal Structure**

```typescript
// Modal Component Structure
<Modal isOpen={isOpen} onClose={onClose} title="Modal Title" size="lg">
  <ModalBody>
    <div className="space-y-4">
      {/* Content */}
    </div>
  </ModalBody>

  <ModalFooter>
    <Button variant="outline" onClick={onClose}>Cancel</Button>
    <Button type="submit">Submit</Button>
  </ModalFooter>
</Modal>
```

#### **Modal Sizes**

```typescript
const sizeClasses = {
  sm: 'max-w-md', // Small modals
  md: 'max-w-lg', // Default size
  lg: 'max-w-2xl', // Large modals (forms)
  xl: 'max-w-4xl', // Extra large (complex interfaces)
};
```

### **Button Variants**

#### **Button Component System**

```typescript
// Button Variant Classes
const buttonVariants = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
};

// Button Sizes
const buttonSizes = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-10 px-4 py-2',
  lg: 'h-11 px-8 text-lg',
};
```

---

## 📐 Layout System

### **Grid System**

#### **Standard Grid Patterns**

```css
/* Dashboard Grid */
.dashboard-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6;
}

/* Form Grid */
.form-grid {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6;
}

/* Content Grid */
.content-grid {
  @apply grid grid-cols-1 lg:grid-cols-2 gap-6;
}
```

#### **Responsive Breakpoints**

```css
/* Tailwind Breakpoints Used */
sm: '640px',   /* Small devices */
md: '768px',   /* Medium devices */
lg: '1024px',  /* Large devices */
xl: '1280px',  /* Extra large devices */
2xl: '1536px', /* 2X extra large devices */
```

### **Layout Components**

#### **Portal-Specific Layouts**

```typescript
// Layout Structure
<Layout portal="admin">  {/* or "accountant", "owner", "tenant" */}
  <Header />
  <div className="flex">
    <Sidebar portal={portal} />
    <main className="flex-1 overflow-y-auto bg-background">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {children}
      </div>
    </main>
  </div>
</Layout>
```

#### **Header Component**

```typescript
// Header with Glassmorphism
<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="container flex h-16 items-center justify-between px-4">
    {/* Header content */}
  </div>
</header>
```

---

## 🔧 CSS Architecture

### **Global Styles** (`src/app/globals.css`)

#### **CSS Custom Properties**

```css
:root {
  /* Light Theme Variables */
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --primary-foreground: 210 40% 98%;
  --muted: 210 40% 96%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96%;
  --accent-foreground: 222.2 84% 4.9%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 222.2 84% 4.9%;
  --radius: 0.5rem;
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark Theme Variables */
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... other dark theme variables */
  }
}
```

#### **Utility Classes**

```css
/* Custom Glassmorphism Utility */
.glassmorphism {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Card Hover Effects */
.card-hover {
  transition: all 0.3s ease;
}
.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Gradient Background */
.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Scrollbar Utilities */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
```

### **Tailwind Configuration** (`tailwind.config.ts`)

#### **Extended Theme Configuration**

```typescript
export default {
  theme: {
    extend: {
      colors: {
        // Portal-specific colors
        admin: { 50: '#fef3c7', 500: '#f59e0b', 600: '#d97706' },
        accountant: { 50: '#ecfdf5', 500: '#10b981', 600: '#059669' },
        owner: { 50: '#fdf2f8', 500: '#ec4899', 600: '#db2777' },
        tenant: { 50: '#f3e8ff', 500: '#8b5cf6', 600: '#7c3aed' },

        // CSS custom property colors
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: 'hsl(var(--primary))',
        // ... other custom properties
      },

      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },

      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
};
```

---

## 🎯 Best Practices

### **Component Development**

#### **1. Prevent Re-rendering Issues**

```typescript
// ❌ BAD: Component defined inside parent
function ParentComponent() {
  const ChildComponent = () => <div>Child</div>; // Recreated on every render!
  return <ChildComponent />;
}

// ✅ GOOD: Component defined outside parent
const ChildComponent = () => <div>Child</div>; // Stable reference

function ParentComponent() {
  return <ChildComponent />;
}
```

#### **2. Glassmorphism Implementation**

```typescript
// ✅ RECOMMENDED: Explicit color values
className = 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md';

// ❌ AVOID: CSS custom properties with opacity (can cause issues)
className = 'bg-background/95 backdrop-blur-md';
```

#### **3. Accessibility Standards**

```typescript
// ✅ GOOD: High contrast, proper ARIA labels
<button
  className="bg-white/95 dark:bg-slate-900/95" // 95% opacity for readability
  aria-label="Close modal"
  onClick={onClose}
>
  <X className="h-4 w-4" />
</button>
```

### **Styling Guidelines**

#### **1. Consistent Spacing**

```css
/* Use Tailwind spacing scale */
space-y-2    /* 0.5rem - Small spacing */
space-y-4    /* 1rem - Standard spacing */
space-y-6    /* 1.5rem - Large spacing */
space-y-8    /* 2rem - Extra large spacing */
```

#### **2. Typography Hierarchy**

```css
/* Heading Sizes */
text-3xl font-bold    /* Page titles */
text-2xl font-bold    /* Section titles */
text-xl font-semibold /* Subsection titles */
text-lg font-medium   /* Component titles */

/* Body Text */
text-base             /* Standard body text */
text-sm               /* Secondary text */
text-xs               /* Helper text, labels */
```

#### **3. Color Usage**

```css
/* Text Colors */
text-foreground           /* Primary text */
text-muted-foreground     /* Secondary text */
text-primary              /* Brand/accent text */

/* Background Colors */
bg-background             /* Page backgrounds */
bg-card                   /* Card backgrounds */
bg-muted                  /* Subtle backgrounds */
```

---

## 📱 Responsive Design

### **Mobile-First Approach**

#### **Standard Responsive Patterns**

```css
/* Mobile-first responsive grid */
.responsive-grid {
  @apply grid grid-cols-1 gap-4;
  @apply md:grid-cols-2 md:gap-6;
  @apply lg:grid-cols-3 lg:gap-8;
  @apply xl:grid-cols-4;
}

/* Responsive text sizing */
.responsive-heading {
  @apply text-xl font-bold;
  @apply md:text-2xl;
  @apply lg:text-3xl;
}
```

#### **Mobile Navigation**

```typescript
// Mobile menu with glassmorphism
{showMobileMenu && (
  <div className="md:hidden border-t bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
    <div className="px-4 py-2 space-y-2">
      {/* Mobile menu items */}
    </div>
  </div>
)}
```

### **Component Responsiveness**

#### **Modal Responsiveness**

```typescript
// Responsive modal sizes
const sizeClasses = {
  sm: 'max-w-md mx-2 md:mx-4', // Smaller margins on mobile
  md: 'max-w-lg mx-2 md:mx-4',
  lg: 'max-w-2xl mx-2 md:mx-4',
  xl: 'max-w-4xl mx-2 md:mx-4',
};
```

---

## 🔧 Development Tools

### **VS Code Extensions Recommended**

- **Tailwind CSS IntelliSense**: Auto-completion for Tailwind classes
- **PostCSS Language Support**: CSS syntax highlighting
- **TypeScript Hero**: Enhanced TypeScript support
- **Prettier**: Code formatting with Tailwind class sorting

### **Tailwind CSS Utilities**

```json
// .vscode/settings.json
{
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
```

### **CSS Organization**

```
src/app/globals.css          // Global styles, theme variables
src/components/ui/           // Reusable UI components
tailwind.config.ts          // Tailwind configuration
```

---

## 📋 Quality Checklist

### **Before Implementing New Components**

- [ ] Check existing component library for similar patterns
- [ ] Ensure glassmorphism background follows 95% opacity standard
- [ ] Implement both light and dark mode variants
- [ ] Test component at all responsive breakpoints
- [ ] Verify accessibility standards (contrast ratios, focus management)
- [ ] Follow React best practices (stable component references)

### **Before Committing UI Changes**

- [ ] Test glassmorphism effects in both light and dark themes
- [ ] Verify text readability across all backgrounds
- [ ] Check responsive behavior on mobile devices
- [ ] Ensure proper keyboard navigation
- [ ] Validate against design system standards
- [ ] Test component re-rendering behavior

---

**Documentation Complete**: This reference covers the core UI design and styling patterns used
throughout the REMS frontend application. For specific implementation details, refer to the
component source code and continue following the established patterns.
