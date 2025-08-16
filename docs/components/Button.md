# Button Component

A versatile button component with multiple variants, sizes, and states for consistent user interactions.

### Purpose

The Button component provides a standardized way to create interactive elements throughout the application. It supports multiple visual styles, loading states, and accessibility features to ensure consistent user experience across all interfaces.

**Primary use cases:**
- Form submissions and actions
- Navigation triggers
- Modal confirmations
- Call-to-action elements

**Design system role:**
- Core interactive element
- Maintains visual consistency
- Provides semantic meaning through variants

### Props/Parameters

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| variant | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive'` | No | `'primary'` | Visual style variant of the button |
| size | `'sm' \| 'md' \| 'lg'` | No | `'md'` | Size of the button |
| loading | `boolean` | No | `false` | Shows loading spinner and disables interaction |
| leftIcon | `ReactNode` | No | - | Icon displayed before button text |
| rightIcon | `ReactNode` | No | - | Icon displayed after button text |
| fullWidth | `boolean` | No | `false` | Makes button take full width of container |
| children | `ReactNode` | No | - | Button text or content |
| className | `string` | No | `''` | Additional CSS classes |
| disabled | `boolean` | No | `false` | Disables button interaction |

*Inherits all standard HTML button attributes*

### Usage Examples

#### Basic Usage
```tsx
import Button from '@/components/Button/Button';

<Button>Click me</Button>
```

#### Different Variants
```tsx
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="outline">Outline Button</Button>
<Button variant="ghost">Ghost Button</Button>
<Button variant="destructive">Delete Item</Button>
```

#### With Icons
```tsx
import { Plus, Download, ArrowRight } from 'lucide-react';

<Button leftIcon={<Plus />}>Add Item</Button>
<Button rightIcon={<Download />}>Download</Button>
<Button rightIcon={<ArrowRight />}>Continue</Button>
```

#### Loading State
```tsx
const [isLoading, setIsLoading] = useState(false);

<Button 
  loading={isLoading}
  onClick={() => {
    setIsLoading(true);
    // Perform async action
  }}
>
  Save Changes
</Button>
```

#### Form Integration
```tsx
<form onSubmit={handleSubmit}>
  <Button 
    type="submit" 
    variant="primary" 
    size="lg"
    fullWidth
    loading={isSubmitting}
  >
    Submit Form
  </Button>
</form>
```

### Accessibility Considerations

- **Keyboard Navigation**: Fully keyboard accessible with Tab and Enter/Space
- **Screen Readers**: 
  - Uses semantic `<button>` element
  - Loading state announced as "Loading" or "Busy"
  - Disabled state properly communicated
- **Focus Management**: 
  - Clear focus indicators with ring outline
  - Focus trapped when disabled
  - Maintains focus after state changes
- **Color Contrast**: All variants meet WCAG AA standards (4.5:1 ratio)
- **Motion**: Loading spinner respects `prefers-reduced-motion`

### Edge Cases & Error Handling

- **Empty States**: Button renders correctly with no children (icon-only)
- **Loading States**: 
  - Prevents multiple clicks during loading
  - Maintains button dimensions during loading
  - Icons replaced with spinner
- **Error States**: Can be combined with form validation states
- **Long Text**: Text wraps appropriately, button expands vertically
- **Network Issues**: Loading state persists until resolved

### Styling & Theming

#### CSS Classes
```css
/* Base classes always applied */
.btn-base { /* base button styles */ }

/* Variant-specific classes */
.btn-primary { /* primary variant styles */ }
.btn-outline { /* outline variant styles */ }

/* Size classes */
.btn-sm { /* small size styles */ }
.btn-lg { /* large size styles */ }
```

#### CSS Variables
```css
:root {
  --btn-primary-bg: #2563eb;
  --btn-primary-hover: #1d4ed8;
  --btn-border-radius: 0.5rem;
  --btn-transition: all 0.2s ease;
}
```

#### Responsive Behavior
- Maintains consistent sizing across breakpoints
- Touch targets meet minimum 44px requirement on mobile
- Full-width option available for mobile layouts

#### Dark Mode
```css
@media (prefers-color-scheme: dark) {
  .btn-ghost {
    color: #f3f4f6;
    background-color: transparent;
  }
  
  .btn-ghost:hover {
    background-color: #374151;
  }
}
```

### Performance Considerations

- **Rendering**: Only re-renders when props change
- **Memory Usage**: Minimal memory footprint
- **Bundle Size**: ~2KB gzipped including dependencies
- **Optimization Tips**:
  - Use `React.memo()` for buttons in lists
  - Avoid creating new objects in props
  - Use stable references for event handlers

### Testing

#### Unit Tests
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
  it('renders with required props', () => {
    render(<Button>Test Button</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Test Button');
  });
  
  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  
  it('shows loading state correctly', () => {
    render(<Button loading>Loading Button</Button>);
    
    expect(screen.getByRole('button')).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
  
  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    
    expect(screen.getByRole('button')).toHaveClass('bg-red-600');
  });
});
```

#### Integration Tests
- Test button within forms and modal contexts
- Verify proper event bubbling
- Test with different state management solutions

### Related Components

- **IconButton**: For icon-only buttons
- **LinkButton**: For navigation buttons that look like links
- **ButtonGroup**: For grouping related buttons
- **DropdownButton**: Button with dropdown menu

### Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.2.0 | 2025-01-15 | Added fullWidth prop and improved accessibility |
| 1.1.0 | 2025-01-10 | Added loading state and icon support |
| 1.0.0 | 2025-01-01 | Initial implementation with basic variants |

### Migration Guide

#### From v1.1.x to v1.2.x
- No breaking changes
- New `fullWidth` prop available
- Improved focus indicators (automatic upgrade)

#### From v1.0.x to v1.1.x
- `isLoading` prop renamed to `loading`
- Added `leftIcon` and `rightIcon` props

```tsx
// Before (v1.0.x)
<Button isLoading={true}>Save</Button>

// After (v1.1.x+)
<Button loading={true}>Save</Button>
```

---

**Last Updated**: January 15, 2025  
**Maintainer**: UI Team  
**Status**: Stable