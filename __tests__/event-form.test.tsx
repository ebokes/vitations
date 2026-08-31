import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EventForm } from '@/components/event-form';

describe('EventForm', () => {
  it('renders correctly with all fields', () => {
    const handleSubmit = jest.fn();
    render(<EventForm onSubmit={handleSubmit} />);
    
    expect(screen.getByLabelText(/celebrant name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/event title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/event date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/event time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/event venue/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/event description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save event details/i })).toBeInTheDocument();
  });

  it('shows validation errors for required fields', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();
    render(<EventForm onSubmit={handleSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /save event details/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/celebrant name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/event title must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/event date is required/i)).toBeInTheDocument();
    });
    
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();
    render(<EventForm onSubmit={handleSubmit} />);
    
    await user.type(screen.getByLabelText(/celebrant name/i), 'Adaeze Okafor');
    await user.type(screen.getByLabelText(/event title/i), 'Wedding Celebration');
    await user.type(screen.getByLabelText(/event date/i), '2024-12-25');
    
    const submitButton = screen.getByRole('button', { name: /save event details/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
      // React Hook Form passes (data, event) - check first argument is the form data
      const firstCall = handleSubmit.mock.calls[0];
      expect(firstCall[0]).toMatchObject({
        celebrantName: 'Adaeze Okafor',
        eventTitle: 'Wedding Celebration',
        eventDate: '2024-12-25',
      });
    });
  });

  it('shows loading state when isLoading is true', () => {
    const handleSubmit = jest.fn();
    render(<EventForm onSubmit={handleSubmit} isLoading={true} />);
    
    const submitButton = screen.getByRole('button', { name: /save event details/i });
    expect(submitButton).toBeDisabled();
    expect(submitButton.querySelector('svg')).toBeInTheDocument();
  });
});
