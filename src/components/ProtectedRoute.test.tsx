import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProtectedRoute from './ProtectedRoute';

// Mock useAuth from the project's AuthContext
jest.mock('../contexts/AuthContext', () => {
  return {
    useAuth: jest.fn(),
  };
});

// Mock AuthModal to a lightweight component we can assert on
jest.mock('./AuthModal', () => {
  return {
    __esModule: true,
    default: ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => (
      <div data-testid="auth-modal" data-open={isOpen ? 'true' : 'false'}>
        {isOpen ? <button type="button" onClick={onClose}>Close</button> : null}
      </div>
    ),
  };
});

import { useAuth } from '../contexts/AuthContext';

describe('ProtectedRoute', () => {
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  function renderWithChildren(ui: React.ReactNode) {
    return render(<>{ui}</>);
  }

  test('renders loading spinner when loading is true', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: true,
    } as any);

    renderWithChildren(
      <ProtectedRoute>
        <div data-testid="children">Children</div>
      </ProtectedRoute>
    );

    // Spinner container from component markup
    const spinnerContainer = screen.getByRole('status', { hidden: true }) || screen.getByText((_, node) => {
      // Fallback: Verify spinner container by class substring if role isn't present
      return !!node && node instanceof HTMLElement && node.className.includes('min-h-screen');
    });

    // There should NOT be any children or fallback rendered during loading
    expect(screen.queryByTestId('children')).not.toBeInTheDocument();
    expect(spinnerContainer).toBeTruthy();
  });

  test('when unauthenticated and no fallback is provided, prompts to sign in and shows AuthModal when button clicked', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    } as any);

    renderWithChildren(
      <ProtectedRoute>
        <div data-testid="children">Children</div>
      </ProtectedRoute>
    );

    // Heading
    expect(
      screen.getByRole('heading', { name: /sign in to continue/i, level: 2 })
    ).toBeInTheDocument();

    // Supporting text
    expect(
      screen.getByText(/you need to be signed in to access this feature/i)
    ).toBeInTheDocument();

    // Sign In button
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    expect(signInButton).toBeInTheDocument();

    // Modal should be mounted but closed initially
    const modal = screen.getByTestId('auth-modal');
    expect(modal).toHaveAttribute('data-open', 'false');

    // Click to open modal
    fireEvent.click(signInButton);
    expect(modal).toHaveAttribute('data-open', 'true');

    // Click close within mocked modal
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(modal).toHaveAttribute('data-open', 'false');
  });

  test('when unauthenticated and fallback is provided, renders fallback and not the sign-in UI', () => {
    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
    } as any);

    renderWithChildren(
      <ProtectedRoute fallback={<div data-testid="fallback">please login</div>}>
        <div data-testid="children">Children</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('fallback')).toBeInTheDocument();
    // No sign-in heading or button
    expect(
      screen.queryByRole('heading', { name: /sign in to continue/i })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /sign in/i })).not.toBeInTheDocument();

    // Modal should remain closed (but still rendered by the component tree)
    const modal = screen.getByTestId('auth-modal');
    expect(modal).toHaveAttribute('data-open', 'false');
  });

  test('when authenticated, renders children and no sign-in UI', () => {
    mockUseAuth.mockReturnValue({
      user: { id: '123', name: 'Alice' },
      loading: false,
    } as any);

    renderWithChildren(
      <ProtectedRoute>
        <div data-testid="children">Protected content</div>
      </ProtectedRoute>
    );

    expect(screen.getByTestId('children')).toHaveTextContent('Protected content');
    expect(
      screen.queryByRole('heading', { name: /sign in to continue/i })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /sign in/i })).not.toBeInTheDocument();
  });

  test('handles unexpected null children gracefully (renders nothing extra when authenticated)', () => {
    mockUseAuth.mockReturnValue({
      user: { id: 'u1' },
      loading: false,
    } as any);

    const { container } = renderWithChildren(<ProtectedRoute>{null as unknown as React.ReactNode}</ProtectedRoute>);

    // No sign-in UI, no fallback, minimal content
    expect(screen.queryByRole('heading', { name: /sign in to continue/i })).not.toBeInTheDocument();
    expect(container).toBeTruthy();
  });
});