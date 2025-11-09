import { render, screen } from '@testing-library/react';
import { ProductSpecifications } from '../ProductSpecifications';
import type { ProductSpecs } from '@/types';

const mockSpecs: ProductSpecs = {
  screen: '6.7"',
  resolution: '2796 x 1290',
  processor: 'A17 Pro',
  mainCamera: '48 MP',
  selfieCamera: '12 MP',
  battery: '4422 mAh',
  os: 'iOS 17',
  screenRefreshRate: '120 Hz',
};

describe('ProductSpecifications', () => {
  it('should render specifications title', () => {
    render(
      <ProductSpecifications
        specs={mockSpecs}
        brand="Apple"
        name="iPhone 15 Pro"
        description="The most advanced iPhone ever"
      />
    );

    expect(screen.getByText('Specifications')).toBeInTheDocument();
  });

  it('should render brand, name and description when provided', () => {
    render(
      <ProductSpecifications
        specs={mockSpecs}
        brand="Apple"
        name="iPhone 15 Pro"
        description="The most advanced iPhone ever"
      />
    );

    expect(screen.getByText('Brand')).toBeInTheDocument();
    expect(screen.getByText('Apple')).toBeInTheDocument();

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();

    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(
      screen.getByText('The most advanced iPhone ever')
    ).toBeInTheDocument();
  });

  it('should render description when provided', () => {
    render(
      <ProductSpecifications
        specs={mockSpecs}
        brand="Apple"
        name="iPhone 15 Pro"
        description="The most advanced iPhone ever"
      />
    );

    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(
      screen.getByText('The most advanced iPhone ever')
    ).toBeInTheDocument();
  });

  it('should not render description when not provided', () => {
    render(
      <ProductSpecifications
        specs={mockSpecs}
        brand="Apple"
        name="iPhone 15 Pro"
      />
    );

    expect(screen.queryByText('Description')).not.toBeInTheDocument();
  });

  it('should render camera specifications', () => {
    render(
      <ProductSpecifications
        specs={mockSpecs}
        brand="Apple"
        name="iPhone 15 Pro"
      />
    );

    expect(screen.getByText('Main Camera')).toBeInTheDocument();
    expect(screen.getByText('48 MP')).toBeInTheDocument();

    expect(screen.getByText('Selfie Camera')).toBeInTheDocument();
    expect(screen.getByText('12 MP')).toBeInTheDocument();
  });

  it('should render battery and OS information', () => {
    render(
      <ProductSpecifications
        specs={mockSpecs}
        brand="Apple"
        name="iPhone 15 Pro"
      />
    );

    expect(screen.getByText('Battery')).toBeInTheDocument();
    expect(screen.getByText('4422 mAh')).toBeInTheDocument();

    expect(screen.getByText('OS')).toBeInTheDocument();
    expect(screen.getByText('iOS 17')).toBeInTheDocument();
  });

  it('should render refresh rate when available', () => {
    render(
      <ProductSpecifications
        specs={mockSpecs}
        brand="Apple"
        name="iPhone 15 Pro"
      />
    );

    expect(screen.getByText('Refresh Rate')).toBeInTheDocument();
    expect(screen.getByText('120 Hz')).toBeInTheDocument();
  });

  it('should render resolution when available', () => {
    render(
      <ProductSpecifications
        specs={mockSpecs}
        brand="Apple"
        name="iPhone 15 Pro"
      />
    );

    expect(screen.getByText('Resolution')).toBeInTheDocument();
    expect(screen.getByText('2796 x 1290')).toBeInTheDocument();
  });

  it('should handle partial specs data', () => {
    const partialSpecs: ProductSpecs = {
      screen: '6.1"',
      processor: 'A16',
    };

    render(
      <ProductSpecifications
        specs={partialSpecs}
        brand="Apple"
        name="iPhone 14"
      />
    );

    expect(screen.getByText('6.1"')).toBeInTheDocument();
    expect(screen.getByText('A16')).toBeInTheDocument();
    expect(screen.queryByText('Battery')).not.toBeInTheDocument();
  });
});
