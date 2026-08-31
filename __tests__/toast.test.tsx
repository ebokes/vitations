import { render, screen, act } from '@testing-library/react';
import { ToastProvider, useToast } from '@/components/ui/toast';

function TestComponent() {
  const { addToast, toasts } = useToast();
  
  return (
    <div>
      <button onClick={() => addToast({ title: 'Test toast', variant: 'default' })}>
        Add toast
      </button>
      <div data-testid="toast-count">{toasts.length}</div>
    </div>
  );
}

describe('Toast', () => {
  it('provides toast context', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const count = screen.getByTestId('toast-count');
    expect(count).toHaveTextContent('0');
  });

  it('adds a toast', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );
    
    const addButton = screen.getByRole('button', { name: /add toast/i });
    act(() => {
      addButton.click();
    });
    
    const count = screen.getByTestId('toast-count');
    expect(count).toHaveTextContent('1');
  });

  it('renders toast with correct title', () => {
    function TestComponentWithToast() {
      const { addToast } = useToast();
      
      return (
        <button onClick={() => addToast({ title: 'Success message', variant: 'success' })}>
          Add toast
        </button>
      );
    }

    render(
      <ToastProvider>
        <TestComponentWithToast />
      </ToastProvider>
    );
    
    const addButton = screen.getByRole('button', { name: /add toast/i });
    act(() => {
      addButton.click();
    });
    
    expect(screen.getByText(/success message/i)).toBeInTheDocument();
  });
});

describe('Toast variants', () => {
  it('renders success toast with correct styling', () => {
    function TestComponentWithToast() {
      const { addToast } = useToast();
      
      return (
        <button onClick={() => addToast({ title: 'Success', variant: 'success' })}>
          Add toast
        </button>
      );
    }

    render(
      <ToastProvider>
        <TestComponentWithToast />
      </ToastProvider>
    );
    
    const addButton = screen.getByRole('button', { name: /add toast/i });
    act(() => {
      addButton.click();
    });
    
    const toast = screen.getByText(/success/i).closest('[role="status"]');
    expect(toast).toHaveClass('bg-green-50');
  });

  it('renders error toast with correct styling', () => {
    function TestComponentWithToast() {
      const { addToast } = useToast();
      
      return (
        <button onClick={() => addToast({ title: 'Error', variant: 'error' })}>
          Add toast
        </button>
      );
    }

    render(
      <ToastProvider>
        <TestComponentWithToast />
      </ToastProvider>
    );
    
    const addButton = screen.getByRole('button', { name: /add toast/i });
    act(() => {
      addButton.click();
    });
    
    const toast = screen.getByText(/error/i).closest('[role="status"]');
    expect(toast).toHaveClass('bg-red-50');
  });
});
