import { render } from '@testing-library/react';
import { Loader } from '../Loader';

describe('Loader', () => {
  it('should render loader component', () => {
    const { container } = render(<Loader />);

    const loader = container.querySelector('.loader');
    expect(loader).toBeInTheDocument();
  });

  it('should render spinner element', () => {
    const { container } = render(<Loader />);

    const spinner = container.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
  });
});
