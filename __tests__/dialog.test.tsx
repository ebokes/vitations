import { render, screen } from '@testing-library/react';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter, DialogClose } from '@/components/ui/dialog';

describe('Dialog', () => {
  it('renders children when open', () => {
    render(
      <Dialog open={true} onOpenChange={() => {}}>
        <div>Dialog content</div>
      </Dialog>
    );
    expect(screen.getByText(/dialog content/i)).toBeInTheDocument();
  });

  it('does not render children when closed', () => {
    render(
      <Dialog open={false} onOpenChange={() => {}}>
        <div>Dialog content</div>
      </Dialog>
    );
    expect(screen.queryByText(/dialog content/i)).not.toBeInTheDocument();
  });
});

describe('DialogHeader', () => {
  it('renders correctly', () => {
    render(
      <DialogHeader>
        <div>Header content</div>
      </DialogHeader>
    );
    expect(screen.getByText(/header content/i)).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <DialogHeader className="custom-header">
        <div>Header</div>
      </DialogHeader>
    );
    const header = screen.getByText(/header/i).parentElement;
    expect(header).toHaveClass('custom-header');
  });
});

describe('DialogTitle', () => {
  it('renders correctly', () => {
    render(<DialogTitle>Dialog Title</DialogTitle>);
    expect(screen.getByRole('heading', { name: /dialog title/i })).toBeInTheDocument();
  });
});

describe('DialogContent', () => {
  it('renders correctly', () => {
    render(<DialogContent>Content</DialogContent>);
    expect(screen.getByText(/content/i)).toBeInTheDocument();
  });
});

describe('DialogFooter', () => {
  it('renders correctly', () => {
    render(<DialogFooter>Footer</DialogFooter>);
    expect(screen.getByText(/footer/i)).toBeInTheDocument();
  });
});

describe('DialogClose', () => {
  it('calls onClose when clicked', () => {
    const handleClose = jest.fn();
    render(<DialogClose onClose={handleClose} />);
    const closeButton = screen.getByRole('button', { name: /close/i });
    closeButton.click();
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
