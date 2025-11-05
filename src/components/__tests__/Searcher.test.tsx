import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Searcher } from '../Searcher';

describe('Searcher', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should render search input with default placeholder', () => {
    render(<Searcher value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Search for a smartphone...');
    expect(input).toBeInTheDocument();
  });

  it('should render search input with custom placeholder', () => {
    render(
      <Searcher
        value=""
        onChange={mockOnChange}
        placeholder="Custom placeholder"
      />
    );

    const input = screen.getByPlaceholderText('Custom placeholder');
    expect(input).toBeInTheDocument();
  });

  it('should display current value', () => {
    render(<Searcher value="iPhone" onChange={mockOnChange} />);

    const input = screen.getByDisplayValue('iPhone');
    expect(input).toBeInTheDocument();
  });

  it('should call onChange when typing', async () => {
    const user = userEvent.setup();
    render(<Searcher value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Search for a smartphone...');
    await user.type(input, 'test');

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('should not show clear button when value is empty', () => {
    render(<Searcher value="" onChange={mockOnChange} />);

    const clearButton = screen.queryByLabelText('Clear search');
    expect(clearButton).not.toBeInTheDocument();
  });

  it('should show clear button when value is not empty', () => {
    render(<Searcher value="test" onChange={mockOnChange} />);

    const clearButton = screen.getByLabelText('Clear search');
    expect(clearButton).toBeInTheDocument();
  });

  it('should clear input when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(<Searcher value="test" onChange={mockOnChange} />);

    const clearButton = screen.getByLabelText('Clear search');
    await user.click(clearButton);

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: '' }),
      })
    );
  });

  it('should have spellcheck disabled', () => {
    render(<Searcher value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText(
      'Search for a smartphone...'
    ) as HTMLInputElement;
    expect(input).toHaveAttribute('spellcheck', 'false');
  });
});
