import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import InteractiveDemo from '../InteractiveDemo.test'; // Component is currently implemented in a .test.tsx file
import { vi } from 'vitest';

// Mock useAuth from AuthContext to control authentication state
vi.mock('../../contexts/AuthContext', () => {
  return {
    useAuth: vi.fn(() => ({ user: null })),
  };
});

const useAuthMock = require('../../contexts/AuthContext').useAuth as jest.Mock | ReturnType<typeof vi.fn>;

describe('InteractiveDemo', () => {
  // Ensure all timers are using fake timers to control setTimeout-driven flow
  beforeEach(() => {
    // Support both Jest and Vitest fake timers API
    if (typeof vi !== 'undefined' && vi.useFakeTimers) {
      vi.useFakeTimers();
    }
    // jest.useFakeTimers may exist under jest environment, but TS may not know
    // @ts-ignore
    if (typeof jest !== 'undefined' && jest.useFakeTimers) {
      // @ts-ignore
      jest.useFakeTimers();
    }
  });

  afterEach(() => {
    // Clear any timers
    if (typeof vi !== 'undefined' && vi.clearAllTimers) {
      vi.clearAllTimers();
      vi.useRealTimers();
    }
    // @ts-ignore
    if (typeof jest !== 'undefined' && jest.clearAllTimers) {
      // @ts-ignore
      jest.clearAllTimers();
      // @ts-ignore
      jest.useRealTimers();
    }
  });

  test('renders initial state with Raw Manuscript and placeholder output', () => {
    useAuthMock.mockReturnValue({ user: null });

    render(<InteractiveDemo />);

    expect(screen.getByText('Raw Manuscript')).toBeInTheDocument();
    expect(screen.getByText('Professional Format')).toBeInTheDocument();

    // CTA reflects unauthenticated state
    expect(screen.getByRole('button', { name: /Try Demo \(Sign up required\)/i })).toBeInTheDocument();

    // Output placeholder is visible before processing
    expect(screen.getByText(/Formatted result will appear here/i)).toBeInTheDocument();
  });

  test('unauthenticated user clicking Try Demo shows auth prompt modal', () => {
    useAuthMock.mockReturnValue({ user: null });

    render(<InteractiveDemo />);

    fireEvent.click(screen.getByRole('button', { name: /Try Demo \(Sign up required\)/i }));

    // Auth prompt modal appears
    expect(screen.getByText(/Sign Up to Try Demo/i)).toBeInTheDocument();
    expect(screen.getByText(/Create a free account/i)).toBeInTheDocument();

    // Cancel closes modal
    fireEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(screen.queryByText(/Sign Up to Try Demo/i)).not.toBeInTheDocument();
  });

  test('unauthenticated user clicking Download triggers auth prompt', () => {
    // Start from a state where result is visible by simulating authenticated flow
    useAuthMock.mockReturnValue({ user: { id: 'u1' } });

    render(<InteractiveDemo />);

    // Begin the demo flow as authenticated user to reach "showResult"
    fireEvent.click(screen.getByRole('button', { name: /Transform with AI/i }));
    // advance 2000ms for analyzing
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    // Should show "Applying formatting..."
    expect(screen.getByText(/Applying formatting/i)).toBeInTheDocument();

    // advance another 1500ms for completion
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // Result should be shown now, with download button
    const downloadCTA = screen.getByRole('button', { name: /Download Full Sample/i });
    expect(downloadCTA).toBeInTheDocument();

    // Switch to unauthenticated to test auth prompt on download
    useAuthMock.mockReturnValue({ user: null });

    fireEvent.click(downloadCTA);

    expect(screen.getByText(/Sign Up to Try Demo/i)).toBeInTheDocument();
  });

  test('authenticated user sees "Transform with AI", progresses through steps, and shows result', () => {
    useAuthMock.mockReturnValue({ user: { id: 'user-123', email: 'x@y.z' } });

    render(<InteractiveDemo />);

    const cta = screen.getByRole('button', { name: /Transform with AI/i });
    expect(cta).toBeInTheDocument();

    // Click to start processing
    fireEvent.click(cta);

    // Immediately after clicking: processing starts and shows "Analyzing structure..." at step 1 after setCurrentStep(1)
    // However, the code sets step 1 before the first 2000ms timeout triggers the next step.
    // Verify spinner and first message appear
    expect(screen.getByText(/Analyzing structure/i)).toBeInTheDocument();

    // Advance 2000ms => Should transition to "Applying formatting..."
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(screen.getByText(/Applying formatting/i)).toBeInTheDocument();

    // Advance another 1500ms => Should finish, show result and download button
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // Result pre block contains formatted sample heading "CHAPTER 1"
    expect(screen.getByText('CHAPTER 1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Download Full Sample/i })).toBeInTheDocument();
  });

  test('authenticated user clicking Download shows Email Capture modal and can "Download Sample"', () => {
    useAuthMock.mockReturnValue({ user: { id: 'u2' } });

    // Mock alert to verify calls
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<InteractiveDemo />);

    // drive the flow to completion
    fireEvent.click(screen.getByRole('button', { name: /Transform with AI/i }));
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(screen.getByText(/Applying formatting/i)).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // Click download full sample
    fireEvent.click(screen.getByRole('button', { name: /Download Full Sample/i }));

    // Email capture modal appears (without actual input fields, per current implementation)
    expect(screen.getByText(/Download Formatted Sample/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Download Sample/i })).toBeInTheDocument();

    // Click "Download Sample" should alert and close modal
    fireEvent.click(screen.getByRole('button', { name: /Download Sample/i }));
    expect(alertSpy).toHaveBeenCalledWith('Sample downloaded! Check your downloads folder.');
    expect(screen.queryByText(/Download Formatted Sample/i)).not.toBeInTheDocument();

    alertSpy.mockRestore();
  });

  test('auth prompt "Sign Up Free" dispatches openAuth event with correct detail', () => {
    useAuthMock.mockReturnValue({ user: null });

    const dispatchSpy = vi.spyOn(window, 'dispatchEvent');

    render(<InteractiveDemo />);

    // Trigger auth modal
    fireEvent.click(screen.getByRole('button', { name: /Try Demo \(Sign up required\)/i }));
    expect(screen.getByText(/Sign Up to Try Demo/i)).toBeInTheDocument();

    // Click Sign Up Free button
    fireEvent.click(screen.getByRole('button', { name: /Sign Up Free/i }));

    // Verify CustomEvent dispatch
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    const evt = dispatchSpy.mock.calls[0][0] as CustomEvent;
    expect(evt).toBeInstanceOf(CustomEvent);
    expect(evt.type).toBe('openAuth');
    expect(evt.detail).toEqual({ mode: 'signup' });

    dispatchSpy.mockRestore();
  });

  test('Email capture modal "Cancel" closes modal without alert', () => {
    useAuthMock.mockReturnValue({ user: { id: 'u3' } });

    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<InteractiveDemo />);

    // Drive to result
    fireEvent.click(screen.getByRole('button', { name: /Transform with AI/i }));
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    // Open email capture
    fireEvent.click(screen.getByRole('button', { name: /Download Full Sample/i }));
    expect(screen.getByText(/Download Formatted Sample/i)).toBeInTheDocument();

    // Cancel should close without alert
    fireEvent.click(screen.getByRole('button', { name: /^Cancel$/i }));
    expect(screen.queryByText(/Download Formatted Sample/i)).not.toBeInTheDocument();
    expect(alertSpy).not.toHaveBeenCalled();

    alertSpy.mockRestore();
  });

  test('unauthenticated user attempting to download without result visible still triggers auth prompt gracefully', () => {
    useAuthMock.mockReturnValue({ user: null });

    render(<InteractiveDemo />);

    // No "Download Full Sample" exists until result, but ensure no crash if we try to query
    expect(screen.queryByRole('button', { name: /Download Full Sample/i })).not.toBeInTheDocument();

    // Click Try Demo -> auth modal appears
    fireEvent.click(screen.getByRole('button', { name: /Try Demo \(Sign up required\)/i }));
    expect(screen.getByText(/Sign Up to Try Demo/i)).toBeInTheDocument();
  });
});