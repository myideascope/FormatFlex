# Modal Component

A flexible modal dialog component for displaying content in an overlay with proper focus management and accessibility.

### Purpose

The Modal component provides a standardized way to display content in a dialog overlay. It handles focus management, keyboard interactions, and provides a consistent user experience for confirmations, forms, and detailed content views.

**Primary use cases:**
- Confirmation dialogs
- Form overlays
- Image galleries
- Settings panels
- Alert messages

**Design system role:**
- Overlay content container
- Focus management system
- Accessibility compliance layer

### Props/Parameters

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| isOpen | `boolean` | Yes | - | Controls modal visibility |
| onClose | `() => void` | Yes | - | Callback when modal should close |
| title | `string` | No | - | Modal title for accessibility |
| size | `'sm' \| 'md' \| 'lg' \| 'xl' \| 'full'` | No | `'md'` | Modal size variant |
| closeOnOverlayClick | `boolean` | No | `true` | Whether clicking overlay closes modal |
| closeOnEscape | `boolean` | No | `true` | Whether Escape key closes modal |
| showCloseButton | `boolean` | No | `true` | Whether to show X close button |
| children | `ReactNode` | No | - | Modal content |
| className | `string` | No | `''` | Additional CSS classes for modal content |
| overlayClassName | `string` | No | `''` | Additional CSS classes for overlay |

### Usage Examples

#### Basic Usage
```tsx
import { useState } from 'react';
import Modal from '@/components/Modal/Modal';

const [isOpen, setIsOpen] = useState(false);

<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  title="Confirm Action"
>
  <p>Are you sure you want to delete this item?</p>
  <div className="flex gap-2 mt-4">
    <Button variant="destructive">Delete</Button>
    <Button variant="outline" onClick={() => setIsOpen(false)}>
      Cancel
    </Button>
  </div>
</Modal>
```

#### Different Sizes
```tsx
<Modal isOpen={isOpen} onClose={onClose} size="sm">
  <p>Small modal content</p>
</Modal>

<Modal isOpen={isOpen} onClose={onClose} size="lg">
  <div>Large modal with more content</div>
</Modal>

<Modal isOpen={isOpen} onClose={onClose} size="full">
  <div>Full screen modal</div>
</Modal>
```

#### Form Modal
```tsx
<Modal 
  isOpen={isFormOpen} 
  onClose={() => setIsFormOpen(false)}
  title="Edit Profile"
  closeOnOverlayClick={false}
>
  <form onSubmit={handleSubmit}>
    <div className="space-y-4">
      <input 
        type="text" 
        placeholder="Name"
        className="w-full p-2 border rounded"
      />
      <input 
        type="email" 
        placeholder="Email"
        className="w-full p-2 border rounded"
      />
    </div>
    <div className="flex gap-2 mt-6">
      <Button type="submit">Save Changes</Button>
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => setIsFormOpen(false)}
      >
        Cancel
      </Button>
    </div>
  </form>
</Modal>
```

#### Custom Styling
```tsx
<Modal 
  isOpen={isOpen} 
  onClose={onClose}
  className="bg-gradient-to-br from-blue-50 to-purple-50"
  overlayClassName="bg-black/70"
>
  <div className="text-center">
    <h2 className="text-2xl font-bold mb-4">Custom Styled Modal</h2>
    <p>This modal has custom styling applied.</p>
  </div>
</Modal>
```

### Accessibility Considerations

- **Keyboard Navigation**: 
  - Tab cycles through focusable elements within modal
  - Escape key closes modal (unless disabled)
  - Focus trapped within modal when open
- **Screen Readers**: 
  - Uses `role="dialog"` and `aria-modal="true"`
  - `aria-labelledby` connects to title
  - `aria-describedby` for content description
- **Focus Management**: 
  - Focus moves to modal when opened
  - Focus returns to trigger element when closed
  - First focusable element receives focus
- **Color Contrast**: Overlay provides sufficient contrast
- **Motion**: Respects `prefers-reduced-motion` for animations

### Edge Cases & Error Handling

- **Empty States**: Modal renders correctly with no children
- **Loading States**: Can contain loading spinners or skeleton content
- **Error States**: Can display error messages and retry actions
- **Nested Modals**: Supports modal stacking with proper z-index management
- **Mobile Viewport**: Adapts to small screens with appropriate sizing
- **Long Content**: Scrollable content area when content exceeds viewport

### Styling & Theming

#### CSS Classes
```css
/* Modal overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 50;
}

/* Modal content container */
.modal-content {
  position: relative;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

/* Size variants */
.modal-sm { max-width: 24rem; }
.modal-md { max-width: 32rem; }
.modal-lg { max-width: 48rem; }
.modal-xl { max-width: 64rem; }
.modal-full { width: 100vw; height: 100vh; }
```

#### CSS Variables
```css
:root {
  --modal-overlay-bg: rgba(0, 0, 0, 0.5);
  --modal-content-bg: #ffffff;
  --modal-border-radius: 0.5rem;
  --modal-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  --modal-z-index: 50;
}
```

#### Responsive Behavior
- Full width on mobile devices
- Appropriate margins on larger screens
- Touch-friendly close button sizing
- Scrollable content on small viewports

#### Dark Mode
```css
@media (prefers-color-scheme: dark) {
  .modal-content {
    background-color: #1f2937;
    color: #f9fafb;
  }
  
  .modal-overlay {
    background-color: rgba(0, 0, 0, 0.8);
  }
}
```

### Performance Considerations

- **Rendering**: Only renders when `isOpen` is true
- **Memory Usage**: Unmounts content when closed
- **Bundle Size**: ~3KB gzipped including focus management
- **Optimization Tips**:
  - Use `React.lazy()` for heavy modal content
  - Implement virtual scrolling for long lists
  - Debounce rapid open/close actions

### Testing

#### Unit Tests
```tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

describe('Modal', () => {
  it('renders when open', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });
  
  it('calls onClose when escape is pressed', async () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <p>Content</p>
      </Modal>
    );
    
    await userEvent.keyboard('{Escape}');
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
  
  it('traps focus within modal', async () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()}>
        <button>First</button>
        <button>Second</button>
      </Modal>
    );
    
    const firstButton = screen.getByText('First');
    const secondButton = screen.getByText('Second');
    
    firstButton.focus();
    await userEvent.tab();
    expect(secondButton).toHaveFocus();
  });
});
```

#### Integration Tests
- Test modal within different page contexts
- Verify proper stacking with multiple modals
- Test with form validation and submission

### Related Components

- **Dialog**: Simpler dialog without overlay
- **Drawer**: Side-sliding panel alternative
- **Popover**: Smaller contextual overlays
- **Toast**: Non-blocking notification alternative

### Changelog

| Version | Date | Changes |
|---------|------|---------|
| 2.1.0 | 2025-01-15 | Added size variants and improved mobile support |
| 2.0.0 | 2025-01-10 | Complete rewrite with better accessibility |
| 1.2.0 | 2025-01-05 | Added focus trap and keyboard navigation |
| 1.0.0 | 2025-01-01 | Initial implementation |

### Migration Guide

#### From v1.x to v2.x
Breaking changes in v2.0:
- `visible` prop renamed to `isOpen`
- `onCancel` prop renamed to `onClose`
- Removed `width` prop in favor of `size` variants

```tsx
// Before (v1.x)
<Modal 
  visible={isOpen} 
  onCancel={() => setIsOpen(false)}
  width={600}
>
  Content
</Modal>

// After (v2.x)
<Modal 
  isOpen={isOpen} 
  onClose={() => setIsOpen(false)}
  size="lg"
>
  Content
</Modal>
```

---

**Last Updated**: January 15, 2025  
**Maintainer**: UI Team  
**Status**: Stable