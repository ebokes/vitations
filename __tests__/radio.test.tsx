import { render, screen } from '@testing-library/react';
import { Radio, RadioGroup } from '@/components/ui/radio';

describe('Radio', () => {
  it('renders correctly with label', () => {
    render(<Radio label="Option 1" />);
    const radio = screen.getByRole('radio', { name: /option 1/i });
    expect(radio).toBeInTheDocument();
  });

  it('is unchecked by default', () => {
    render(<Radio label="Option 1" />);
    const radio = screen.getByRole('radio', { name: /option 1/i });
    expect(radio).not.toBeChecked();
  });

  it('can be checked', () => {
    render(<Radio label="Option 1" defaultChecked />);
    const radio = screen.getByRole('radio', { name: /option 1/i });
    expect(radio).toBeChecked();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Radio label="Option 1" disabled />);
    const radio = screen.getByRole('radio', { name: /option 1/i });
    expect(radio).toBeDisabled();
  });
});

describe('RadioGroup', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  it('renders all options', () => {
    render(<RadioGroup options={options} />);
    expect(screen.getByRole('radio', { name: /option 1/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /option 2/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /option 3/i })).toBeInTheDocument();
  });

  it('has correct role', () => {
    render(<RadioGroup options={options} />);
    const group = screen.getByRole('radiogroup');
    expect(group).toBeInTheDocument();
  });

  it('shows error message when error is provided', () => {
    render(<RadioGroup options={options} error="Selection required" />);
    const errorMessage = screen.getByText(/selection required/i);
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveAttribute('role', 'alert');
  });

  it('allows selecting an option', () => {
    const handleChange = jest.fn();
    render(<RadioGroup options={options} onChange={handleChange} />);
    
    const option1 = screen.getByRole('radio', { name: /option 1/i });
    option1.click();
    
    expect(handleChange).toHaveBeenCalledWith('option1');
  });

  it('shows selected option', () => {
    render(<RadioGroup options={options} value="option2" />);
    
    const option1 = screen.getByRole('radio', { name: /option 1/i });
    const option2 = screen.getByRole('radio', { name: /option 2/i });
    
    expect(option1).not.toBeChecked();
    expect(option2).toBeChecked();
  });
});
