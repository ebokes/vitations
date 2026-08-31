import { render, screen } from '@testing-library/react';
import { Input } from '@/components/ui/input';

describe('Input', () => {
  it('renders correctly with label', () => {
    render(<Input label="Email" />);
    const input = screen.getByLabelText(/email/i);
    expect(input).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<Input placeholder="Enter email" />);
    const input = screen.getByPlaceholderText(/enter email/i);
    expect(input).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<Input label="Email" required />);
    const requiredIndicator = screen.getByText('*');
    expect(requiredIndicator).toBeInTheDocument();
  });

  it('shows error message when error is provided', () => {
    render(<Input label="Email" error="Invalid email" />);
    const errorMessage = screen.getByText(/invalid email/i);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-600');
  });

  it('shows hint when hint is provided', () => {
    render(<Input label="Email" hint="We'll never share your email" />);
    const hint = screen.getByText(/we'll never share your email/i);
    expect(hint).toBeInTheDocument();
    expect(hint).toHaveClass('text-neutral-500');
  });

  it('does not show hint when error is present', () => {
    render(<Input label="Email" hint="Hint text" error="Error text" />);
    const hint = screen.queryByText(/hint text/i);
    const error = screen.getByText(/error text/i);
    expect(hint).not.toBeInTheDocument();
    expect(error).toBeInTheDocument();
  });

  it('has correct aria attributes', () => {
    render(<Input label="Email" error="Invalid email" />);
    const input = screen.getByLabelText(/email/i);
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input label="Email" disabled />);
    const input = screen.getByLabelText(/email/i);
    expect(input).toBeDisabled();
  });
});
