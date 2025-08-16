/**
 * Tests for App component behaviors introduced/modified in the PR:
 * - Auth modal open/close state and mode via buttons and window custom events
 * - Conditional rendering for authenticated vs unauthenticated users
 *
 * Framework & library:
 * - React Testing Library for rendering and assertions
 * - Vitest for test runner and mocking (replace vi with jest if using Jest)
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Use Vitest style mocking by default; if project uses Jest, swap to jest.mock and jest.fn.
import { vi } from 'vitest'

// IMPORTANT: Adjust import path for App if it's different in your repo.
import App from './App'

// We will mock useAuth hook and UI components that are not under test to stabilize rendering and control behavior.
vi.mock('./hooks/useAuth', () => {
  // The tests will override this default export via vi.mocked when needed
  return {
    useAuth: vi.fn(() => ({ user: null }))
  }
})

// Stub heavy UI components to minimal renderables, while preserving props for assertions.
vi.mock('./components/AuthModal', () => {
  const AuthModal = ({ isOpen, onClose, initialMode }: any) => {
    // Expose props to DOM for easy assertions
    return (
      <div data-testid="auth-modal" data-open={isOpen ? 'true' : 'false'} data-mode={initialMode}>
        {isOpen && (
          <button type="button" onClick={onClose} aria-label="Close Auth Modal">
            Close
          </button>
        )}
      </div>
    )
  }
  return { default: AuthModal }
})

vi.mock('./components/UserMenu', () => {
  const UserMenu = () => <div data-testid="user-menu">User Menu</div>
  return { default: UserMenu }
})

vi.mock('./components/InteractiveDemo', () => {
  const InteractiveDemo = () => <div data-testid="interactive-demo">Interactive Demo</div>
  return { default: InteractiveDemo }
})

// Icons are not relevant for behavior; stub them to simple spans
vi.mock('lucide-react', () => {
  const makeIcon = (name: string) => (props: any) => <span data-testid={`icon-${name}`} {...props} />
  return {
    BookOpen: makeIcon('BookOpen'),
    Zap: makeIcon('Zap'),
    ArrowRight: makeIcon('ArrowRight'),
    Upload: makeIcon('Upload'),
    Download: makeIcon('Download'),
    CheckCircle: makeIcon('CheckCircle'),
    Palette: makeIcon('Palette'),
    FileText: makeIcon('FileText'),
    Share2: makeIcon('Share2'),
    Globe: makeIcon('Globe'),
    TrendingUp: makeIcon('TrendingUp')
  }
})

describe('App - unauthenticated user flows', () => {
  const { useAuth } = vi.mocked(require('./hooks/useAuth'), true)

  beforeEach(() => {
    vi.clearAllMocks()
    // @ts-expect-error runtime override
    useAuth.mockReturnValue({ user: null })
  })

  test('renders key marketing content and unauthenticated CTAs', () => {
    render(<App />)

    // Headline presence
    expect(screen.getByText('Professional Book')).toBeInTheDocument()
    expect(screen.getByText('Formatting Made Simple')).toBeInTheDocument()

    // Top nav CTA button when logged out
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument()

    // Hero CTA
    expect(screen.getByRole('button', { name: 'Start Free Trial' })).toBeInTheDocument()

    // Pricing CTA
    expect(screen.getAllByRole('button', { name: 'Start Free Trial' }).length).toBeGreaterThanOrEqual(1)

    // Auth modal initially closed, default mode "signin"
    const modal = screen.getByTestId('auth-modal')
    expect(modal).toHaveAttribute('data-open', 'false')
    expect(modal).toHaveAttribute('data-mode', 'signin')
  })

  test('clicking "Get Started" opens AuthModal in signup mode', async () => {
    render(<App />)
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: 'Get Started' }))

    const modal = screen.getByTestId('auth-modal')
    expect(modal).toHaveAttribute('data-open', 'true')
    expect(modal).toHaveAttribute('data-mode', 'signup')
  })

  test('clicking "Start Free Trial" opens AuthModal in signup mode', async () => {
    render(<App />)
    const user = userEvent.setup()

    const ctas = screen.getAllByRole('button', { name: 'Start Free Trial' })
    // Click the first "Start Free Trial" found (hero or pricing)
    await user.click(ctas[0])

    const modal = screen.getByTestId('auth-modal')
    expect(modal).toHaveAttribute('data-open', 'true')
    expect(modal).toHaveAttribute('data-mode', 'signup')
  })

  test('window custom event "openAuth" opens AuthModal with requested mode (signin)', () => {
    render(<App />)

    // Dispatch custom event
    const event = new CustomEvent('openAuth', { detail: { mode: 'signin' } })
    window.dispatchEvent(event)

    const modal = screen.getByTestId('auth-modal')
    expect(modal).toHaveAttribute('data-open', 'true')
    expect(modal).toHaveAttribute('data-mode', 'signin')
  })

  test('window custom event "openAuth" opens AuthModal with requested mode (signup)', () => {
    render(<App />)

    const event = new CustomEvent('openAuth', { detail: { mode: 'signup' } })
    window.dispatchEvent(event)

    const modal = screen.getByTestId('auth-modal')
    expect(modal).toHaveAttribute('data-open', 'true')
    expect(modal).toHaveAttribute('data-mode', 'signup')
  })

  test('AuthModal onClose closes the modal and resets mode to signin', async () => {
    render(<App />)
    const user = userEvent.setup()

    // Open via signup button
    await user.click(screen.getByRole('button', { name: 'Get Started' }))
    const modal = screen.getByTestId('auth-modal')
    expect(modal).toHaveAttribute('data-open', 'true')
    expect(modal).toHaveAttribute('data-mode', 'signup')

    // Click close (calls closeAuthModal -> isOpen:false, mode:signin)
    await user.click(screen.getByRole('button', { name: 'Close Auth Modal' }))
    expect(modal).toHaveAttribute('data-open', 'false')
    expect(modal).toHaveAttribute('data-mode', 'signin')
  })

  test('effect registers and cleans up openAuth event listener', () => {
    const addSpy = vi.spyOn(window, 'addEventListener')
    const removeSpy = vi.spyOn(window, 'removeEventListener')

    const { unmount } = render(<App />)
    expect(addSpy).toHaveBeenCalledWith('openAuth', expect.any(Function))

    unmount()
    expect(removeSpy).toHaveBeenCalledWith('openAuth', expect.any(Function))
  })
})

describe('App - authenticated user flows', () => {
  const { useAuth } = vi.mocked(require('./hooks/useAuth'), true)

  beforeEach(() => {
    vi.clearAllMocks()
    // @ts-expect-error runtime override
    useAuth.mockReturnValue({ user: { id: 'u1', name: 'Test User' } })
  })

  test('renders user-specific actions and not the signup CTAs', () => {
    render(<App />)

    // User menu shows up
    expect(screen.getByTestId('user-menu')).toBeInTheDocument()

    // Authenticated-specific buttons should exist
    expect(screen.getAllByRole('button', { name: 'Upload Manuscript' }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole('button', { name: 'Access Dashboard' })).toBeInTheDocument()

    // Public signup CTAs should be absent
    expect(screen.queryByRole('button', { name: 'Get Started' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Start Free Trial' })).not.toBeInTheDocument()
  })

  test('custom event still opens modal when authenticated (sign in mode)', () => {
    render(<App />)
    const event = new CustomEvent('openAuth', { detail: { mode: 'signin' } })
    window.dispatchEvent(event)

    const modal = screen.getByTestId('auth-modal')
    expect(modal).toHaveAttribute('data-open', 'true')
    expect(modal).toHaveAttribute('data-mode', 'signin')
  })
})