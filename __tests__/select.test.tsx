import { render, screen } from '@testing-library/react';
import { Select } from '@/components/ui/select';

describe('Select', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('renders correctly with label', () => {
    render(<Select label="Choose" options={options} />);
    const select = screen.getByLabelText(/choose/i);
    expect(select).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    render(<Select options={options} placeholder="Select an option" />);
    const placeholder = screen.getByText(/select an option/i);
    expect(placeholder).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<Select options={options} />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('shows required indicator when required', () => {
    render(<Select label="Choose" options={options} required />);
    const requiredIndicator = screen.getByText('*');
    expect(requiredIndicator).toBeInTheDocument();
  });

  it('shows error message when error is provided', () => {
    render(<Select label="Choose" options={options} error="Selection required" />);
    const errorMessage = screen.getByText(/selection required/i);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-600');
  });

  it('shows hint when hint is provided', () => {
    render(<Select label="Choose" options={options} hint="Pick one" />);
    const hint = screen.getByText(/pick one/i);
    expect(hint).toBeInTheDocument();
    expect(hint).toHaveClass('text-neutral-500');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Select label="Choose" options={options} disabled />);
    const select = screen.getByLabelText(/choose/i);
    expect(select).toBeDisabled();
  });
});
