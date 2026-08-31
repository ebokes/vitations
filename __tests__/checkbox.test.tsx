import { render, screen } from '@testing-library/react';
import { Checkbox } from '@/components/ui/checkbox';

describe('Checkbox', () => {
  it('renders correctly with label', () => {
    render(<Checkbox label="Accept terms" />);
    const checkbox = screen.getByRole('checkbox', { name: /accept terms/i });
    expect(checkbox).toBeInTheDocument();
  });

  it('is unchecked by default', () => {
    render(<Checkbox label="Accept terms" />);
    const checkbox = screen.getByRole('checkbox', { name: /accept terms/i });
    expect(checkbox).not.toBeChecked();
  });

  it('can be checked', () => {
    render(<Checkbox label="Accept terms" defaultChecked />);
    const checkbox = screen.getByRole('checkbox', { name: /accept terms/i });
    expect(checkbox).toBeChecked();
  });

  it('shows error message when error is provided', () => {
    render(<Checkbox label="Accept terms" error="You must accept" />);
    const errorMessage = screen.getByText(/you must accept/i);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-600');
  });

  it('shows hint when hint is provided', () => {
    render(<Checkbox label="Accept terms" hint="Required to proceed" />);
    const hint = screen.getByText(/required to proceed/i);
    expect(hint).toBeInTheDocument();
    expect(hint).toHaveClass('text-neutral-500');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Checkbox label="Accept terms" disabled />);
    const checkbox = screen.getByRole('checkbox', { name: /accept terms/i });
    expect(checkbox).toBeDisabled();
  });

  it('has correct aria attributes', () => {
    render(<Checkbox label="Accept terms" error="Error message" />);
    const checkbox = screen.getByRole('checkbox', { name: /accept terms/i });
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveAttribute('aria-describedby');
  });
});
