import { render, screen } from '@testing-library/react';
import { ErrorState } from '../ErrorState';

describe('ErrorState', () => {
  it('should render with default message', () => {
    render(<ErrorState />);

    expect(
      screen.getByText('Something went wrong. Please try again.')
    ).toBeInTheDocument();
  });

  it('should render with custom message', () => {
    render(<ErrorState message="Custom error message" />);

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('should not render default message when custom message is provided', () => {
    render(<ErrorState message="Custom error message" />);

    expect(
      screen.queryByText('Something went wrong. Please try again.')
    ).not.toBeInTheDocument();
  });
});
