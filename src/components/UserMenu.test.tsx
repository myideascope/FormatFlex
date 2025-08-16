/**
 * Tests for UserMenu component
 * Framework/Libraries: React Testing Library with Jest/Vitest (aligns with project setup).
 * This suite covers:
 *  - Rendering when no user (returns null)
 *  - Toggling the dropdown open/closed
 *  - Displays expected user info and menu items when open
 *  - Clicking outside closes the dropdown
 *  - Sign out triggers useAuth.signOut and closes the dropdown
 *  - Robustness with unusual emails and missing email edge cases
 */

import React from 'react';
import { render, screen, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserMenu from './UserMenu';

// Support both jest and vitest environments by using whichever global is available
const mocker: any = (globalThis as any).vi ?? (globalThis as any).jest;

// Mock the AuthContext hook used by UserMenu
mocker.mock('../contexts/AuthContext', () => {
  return {
    useAuth: mocker.fn(),
  };
});

import { useAuth } from '../contexts/AuthContext';

type MockedUseAuth = jest.Mock | ReturnType<typeof vi.fn>;

const setUseAuthReturn = (value: any) => {
  (useAuth as unknown as MockedUseAuth).mockReturnValue(value);
};

describe('UserMenu', () => {
  afterEach(() => {
    (useAuth as unknown as MockedUseAuth).mockReset?.();
    (useAuth as unknown as MockedUseAuth).mockClear?.();
  });

  test('renders nothing when user is not authenticated', () => {
    setUseAuthReturn({ user: null, signOut: mocker.fn() });

    const { container } = render(<UserMenu />);
    // When user is null, component returns null. Container should be empty.
    expect(container.firstChild).toBeNull();
  });

  test('renders the trigger button with user initial (email prefix) and toggles menu open', async () => {
    const user = userEvent.setup();

    setUseAuthReturn({
      user: { email: 'alice@example.com' },
      signOut: mocker.fn().mockResolvedValue(undefined),
    });

    render(<UserMenu />);

    // The button should include the email prefix (before @)
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('alice')).toBeInTheDocument();

    // Dropdown content should not be visible initially
    expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();

    // Click to open
    await user.click(screen.getByRole('button'));

    // Now dropdown content should be visible
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
    expect(screen.getByText('My Documents')).toBeInTheDocument();
    expect(screen.getByText('Account Settings')).toBeInTheDocument();

    // Header shows full email and the trial banner
    expect(screen.getByText('alice@example.com')).toBeInTheDocument();
    expect(screen.getByText('Free Trial Active')).toBeInTheDocument();
  });

  test('clicking outside closes the menu', async () => {
    const user = userEvent.setup();

    setUseAuthReturn({
      user: { email: 'bob@example.com' },
      signOut: mocker.fn().mockResolvedValue(undefined),
    });

    render(<UserMenu />);

    // Open dropdown
    await user.click(screen.getByRole('button'));
    const signOutItem = await screen.findByText('Sign Out');
    expect(signOutItem).toBeInTheDocument();

    // Click outside (document body)
    await act(async () => {
      // Using mouseDown to match the event listener in the component
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
  });

  test('clicking "Sign Out" invokes signOut and closes the menu', async () => {
    const user = userEvent.setup();

    const signOut = mocker.fn().mockResolvedValue(undefined);
    setUseAuthReturn({
      user: { email: 'carol@example.com' },
      signOut,
    });

    render(<UserMenu />);

    // Open dropdown
    await user.click(screen.getByRole('button'));
    const dropdown = screen.getByText('Sign Out').closest('div')?.parentElement?.parentElement;
    // Sanity check dropdown items via "within"
    const menu =
      screen.getByText('Sign Out').closest('div')?.parentElement?.parentElement ?? document.body;
    expect(within(menu).getByText('Sign Out')).toBeInTheDocument();

    // Click Sign Out
    await user.click(screen.getByText('Sign Out'));
    expect(signOut).toHaveBeenCalledTimes(1);

    // After sign out, menu should be closed
    // Allow any pending promises to resolve
    await act(async () => {});
    expect(screen.queryByText('Sign Out')).not.toBeInTheDocument();
  });

  test('handles user without an email gracefully (edge case)', async () => {
    const user = userEvent.setup();

    setUseAuthReturn({
      user: { email: undefined },
      signOut: mocker.fn().mockResolvedValue(undefined),
    });

    render(<UserMenu />);

    // There is still a trigger button (icon-only)
    const trigger = screen.getByRole('button');
    expect(trigger).toBeInTheDocument();

    // Email prefix should not render any text if email missing
    // Ensure clicking still toggles the menu
    await user.click(trigger);
    expect(screen.getByText('My Documents')).toBeInTheDocument();
    expect(screen.getByText('Account Settings')).toBeInTheDocument();

    // Header area should not break; it tries to render user.email which may be undefined
    // We assert that it doesn't crash and the menu is present
    // "Free Trial Active" should still appear
    expect(screen.getByText('Free Trial Active')).toBeInTheDocument();
  });

  test('renders email prefixes correctly for various email formats', async () => {
    const cases = [
      'john.doe+tag@example.com',
      'UPPERCASE@EXAMPLE.ORG',
      'weird_chars-._%+@domain.co',
    ];
    for (const email of cases) {
      setUseAuthReturn({
        user: { email },
        signOut: mocker.fn().mockResolvedValue(undefined),
      });

      const { unmount } = render(<UserMenu />);
      // Prefix is substring before '@'
      const expectedPrefix = (email || '').split('@')[0];
      if (expectedPrefix) {
        expect(screen.getByText(expectedPrefix)).toBeInTheDocument();
      }

      unmount();
    }
  });
});