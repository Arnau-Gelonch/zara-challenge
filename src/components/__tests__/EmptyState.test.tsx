import { render, screen } from '@testing-library/react';
import { EmptyState } from '../EmptyState';

describe('EmptyState', () => {
  it('should render with default message', () => {
    render(<EmptyState />);

    expect(screen.getByText('No products found.')).toBeInTheDocument();
  });

  it('should render with custom message', () => {
    render(<EmptyState message="Custom empty message" />);

    expect(screen.getByText('Custom empty message')).toBeInTheDocument();
  });

  it('should not render default message when custom message is provided', () => {
    render(<EmptyState message="Custom empty message" />);

    expect(screen.queryByText('No products found.')).not.toBeInTheDocument();
  });
});
