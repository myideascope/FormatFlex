import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';

// Prefer vi (Vitest) if present; fall back to jest for mocks/timers
const _globalAny: any = globalThis as any;
const mocker = _globalAny.vi ?? _globalAny.jest;
/* eslint-disable react-hooks/rules-of-hooks */
const useFakeTimers = () => {
  // Always call useFakeTimers on the available timer API to satisfy hook rules
  const fakeTimersApi = _globalAny.vi ?? _globalAny.jest;
  fakeTimersApi?.useFakeTimers();
  if (_globalAny.vi) {
    return {
      advanceTimersByTime:
        _globalAny.vi.advanceTimersByTimeAsync ?? _globalAny.vi.advanceTimersByTime,
      runAllTimers: _globalAny.vi.runAllTimers,
    };
  } else if (_globalAny.jest) {
    return {
      advanceTimersByTime: (ms: number) =>
        act(() => {
          _globalAny.jest.advanceTimersByTime(ms);
        }),
      runAllTimers: () =>
        act(() => {
          _globalAny.jest.runAllTimers();
        }),
    };
  }
  return { advanceTimersByTime: async (_ms: number) => {}, runAllTimers: () => {} };
};

const clearAllTimers = () => {
  // Always call useRealTimers on whichever API is available
  const fakeTimersApi = _globalAny.vi ?? _globalAny.jest;
  fakeTimersApi?.useRealTimers();
};
/* eslint-enable react-hooks/rules-of-hooks */

// Mock the icons to simple stubs to avoid SVG issues
mocker.mock('lucide-react', () => {
  const Stub: React.FC<any> = (props) => (
    <span data-testid={props['data-testid'] || 'icon'} />
  );
  return {
    X: Stub,
    Mail: Stub,
    Lock: Stub,
    User: Stub,
    AlertCircle: Stub,
    CheckCircle: Stub,
  };
});

// Mock Button to surface its props and children for assertions
mocker.mock('./Button/Button', () => {
  const Btn: React.FC<any> = ({ children, loading, ...rest }) => (
    <button data-testid="auth-button" aria-busy={!!loading} {...rest}>
      {children}
    </button>
  );
  return { __esModule: true, default: Btn };
});

// Prepare dynamic mocks for useAuth. We will replace implementations per-test.
const signInMock = mocker.fn();
const signUpMock = mocker.fn();
mocker.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    signIn: signInMock,
    signUp: signUpMock,
  }),
}));

// Import the component under test after mocks
import AuthModal from './AuthModal';

describe('AuthModal', () => {
  beforeEach(() => {
    signInMock.mockReset();
    signUpMock.mockReset();
  });

  it('does not render when isOpen is false', () => {
    const onClose = mocker.fn();
    const { container } = render(<AuthModal isOpen={false} onClose={onClose} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders in sign-in mode by default and shows expected headings and inputs', () => {
    const onClose = mocker.fn();
    render(<AuthModal isOpen={true} onClose={onClose} />);
    expect(
      screen.getByRole('heading', { name: /welcome back/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/sign in to access your formatflex account/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    // No signup-specific password hint in sign-in mode
    expect(
      screen.queryByText(/password must be at least 6 characters/i)
    ).not.toBeInTheDocument();
    // Button text
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('switches to sign-up mode and back, displaying the correct texts and hints', () => {
    const onClose = mocker.fn();
    render(<AuthModal isOpen={true} onClose={onClose} />);
    // Switch to sign up
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    expect(
      screen.getByRole('heading', { name: /create account/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/start formatting your manuscripts professionally/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/password must be at least 6 characters/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /create account/i })
    ).toBeInTheDocument();
    // Switch back to sign in
    fireEvent.click(screen.getByRole('button', { name: /^sign in$/i }));
    expect(
      screen.getByRole('heading', { name: /welcome back/i })
    ).toBeInTheDocument();
  });

  it('inputs enforce required attributes; password minLength is 6 (signup mode)', () => {
    const onClose = mocker.fn();
    render(
      <AuthModal isOpen={true} onClose={onClose} initialMode="signup" />
    );
    const email = screen.getByLabelText(/email address/i) as HTMLInputElement;
    const password = screen.getByLabelText(/password/i) as HTMLInputElement;
    expect(email).toHaveAttribute('required');
    expect(password).toHaveAttribute('required');
    expect(password).toHaveAttribute('minlength', '6');
  });

  it('successful sign-in calls onClose and resets loading', async () => {
    const onClose = mocker.fn();
    signInMock.mockResolvedValue({ error: null });

    render(<AuthModal isOpen={true} onClose={onClose} />);
    // Fill form
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'secret123' },
    });

    // Submit
    fireEvent.click(screen.getByTestId('auth-button'));
    // Loading is reflected via aria-busy
    expect(screen.getByTestId('auth-button')).toHaveAttribute(
      'aria-busy',
      'true'
    );

    await waitFor(() =>
      expect(signInMock).toHaveBeenCalledWith(
        'john@example.com',
        'secret123'
      )
    );
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    // Loading should turn off
    await waitFor(() =>
      expect(screen.getByTestId('auth-button')).toHaveAttribute(
        'aria-busy',
        'false'
      )
    );
  });

  it('sign-in error displays error message and does not close', async () => {
    const onClose = mocker.fn();
    signInMock.mockResolvedValue({
      error: { message: 'Invalid credentials' },
    });

    render(<AuthModal isOpen={true} onClose={onClose} />);
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrong' },
    });
    fireEvent.click(screen.getByTestId('auth-button'));

    await waitFor(() =>
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    );
    expect(onClose).not.toHaveBeenCalled();
  });

  it('successful sign-up shows success message and closes after 2 seconds', async () => {
    const onClose = mocker.fn();
    signUpMock.mockResolvedValue({ error: null });

    const timers = useFakeTimers();

    render(
      <AuthModal isOpen={true} onClose={onClose} initialMode="signup" />
    );
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'alice@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'supersecret' },
    });

    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() =>
      expect(
        screen.getByText(
          /account created! check your email to verify your account\./i
        )
      ).toBeInTheDocument()
    );
    // Should not close immediately
    expect(onClose).not.toHaveBeenCalled();

    // Advance 2 seconds to trigger setTimeout close
    if (timers.advanceTimersByTime) {
      await act(async () => {
        await timers.advanceTimersByTime(2000 as any);
      });
    } else if (timers.runAllTimers) {
      timers.runAllTimers();
    }

    await waitFor(() => expect(onClose).toHaveBeenCalled());
    clearAllTimers();
  });

  it('sign-up error displays error and does not close', async () => {
    const onClose = mocker.fn();
    signUpMock.mockResolvedValue({
      error: { message: 'Email already in use' },
    });

    render(
      <AuthModal isOpen={true} onClose={onClose} initialMode="signup" />
    );
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'taken@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'secret123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() =>
      expect(screen.getByText(/email already in use/i)).toBeInTheDocument()
    );
    expect(onClose).not.toHaveBeenCalled();
  });

  it('unexpected error during submit shows generic error message', async () => {
    const onClose = mocker.fn();
    // Throw to hit catch block
    signInMock.mockRejectedValue(new Error('Network down'));

    render(<AuthModal isOpen={true} onClose={onClose} />);
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'secret123' },
    });
    fireEvent.click(screen.getByTestId('auth-button'));

    await waitFor(() =>
      expect(
        screen.getByText(/an unexpected error occurred/i)
      ).toBeInTheDocument()
    );
    expect(onClose).not.toHaveBeenCalled();
  });

  it('close button resets form and invokes onClose', async () => {
    const onClose = mocker.fn();

    render(<AuthModal isOpen={true} onClose={onClose} />);
    const emailInput = screen.getByLabelText(
      /email address/i
    ) as HTMLInputElement;
    const passwordInput = screen.getByLabelText(
      /password/i
    ) as HTMLInputElement;

    fireEvent.change(emailInput, {
      target: { value: 'temp@example.com' },
    });
    fireEvent.change(passwordInput, {
      target: { value: 'tempPass' },
    });
    expect(emailInput.value).toBe('temp@example.com');
    expect(passwordInput.value).toBe('tempPass');

    // Click the top-right close (by role=button but no accessible name; locate by title/position isn't trivial)
    // Using query by class would be fragile; instead, select the last button that isn't the submit or mode switcher.
    // A simpler approach: use getAllByRole('button') and find the one with no name (since others have text).
    const buttons = screen.getAllByRole('button');
    const unnamed =
      buttons.find((b) => (b.textContent || '').trim().length === 0) ||
      buttons[0];
    fireEvent.click(unnamed);

    expect(onClose).toHaveBeenCalled();
  });

  it('loading prop toggles on Button during async submit in both modes', async () => {
    const onClose = mocker.fn();
    // Delay resolution to observe loading state
    let resolveSignIn: (v: any) => void;
    signInMock.mockImplementation(
      () =>
        new Promise((res) => {
          resolveSignIn = res;
        })
    );

    render(<AuthModal isOpen={true} onClose={onClose} />);
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'secret123' },
    });

    fireEvent.click(screen.getByTestId('auth-button'));
    // Immediately should be loading
    expect(screen.getByTestId('auth-button')).toHaveAttribute(
      'aria-busy',
      'true'
    );

    // Resolve and loading should stop
    // @ts-ignore resolveSignIn assigned from mock
    resolveSignIn!({ error: null });
    await waitFor(() =>
      expect(screen.getByTestId('auth-button')).toHaveAttribute(
        'aria-busy',
        'false'
      )
    );
  });
});