import { render, screen } from '@testing-library/react';
import { Specifications } from '../Specifications';
import type { ProductSpecs } from '@/types';

describe('Specifications', () => {
  const mockSpecs: ProductSpecs = {
    screen: '6.7 inches',
    resolution: '2796 x 1290 pixels',
    processor: 'A17 Pro Bionic',
    mainCamera: '48MP + 12MP + 12MP',
    selfieCamera: '12MP',
    battery: '4441 mAh',
    os: 'iOS 17',
    screenRefreshRate: '120Hz',
  };

  describe('Rendering', () => {
    it('should render specifications title', () => {
      render(<Specifications specs={mockSpecs} />);

      expect(screen.getByText('Specifications')).toBeInTheDocument();
    });

    it('should render all spec entries as table rows', () => {
      render(<Specifications specs={mockSpecs} />);

      expect(screen.getByText('Screen')).toBeInTheDocument();
      expect(screen.getByText('6.7 inches')).toBeInTheDocument();
      expect(screen.getByText('Resolution')).toBeInTheDocument();
      expect(screen.getByText('2796 x 1290 pixels')).toBeInTheDocument();
      expect(screen.getByText('Processor')).toBeInTheDocument();
      expect(screen.getByText('A17 Pro Bionic')).toBeInTheDocument();
    });

    it('should render camera specifications', () => {
      render(<Specifications specs={mockSpecs} />);

      expect(screen.getByText('Main Camera')).toBeInTheDocument();
      expect(screen.getByText('48MP + 12MP + 12MP')).toBeInTheDocument();
      expect(screen.getByText('Selfie Camera')).toBeInTheDocument();
      expect(screen.getByText('12MP')).toBeInTheDocument();
    });

    it('should render battery and os specifications', () => {
      render(<Specifications specs={mockSpecs} />);

      expect(screen.getByText('Battery')).toBeInTheDocument();
      expect(screen.getByText('4441 mAh')).toBeInTheDocument();
      expect(screen.getByText('OS')).toBeInTheDocument();
      expect(screen.getByText('iOS 17')).toBeInTheDocument();
    });

    it('should render refresh rate', () => {
      render(<Specifications specs={mockSpecs} />);

      expect(screen.getByText('Refresh Rate')).toBeInTheDocument();
      expect(screen.getByText('120Hz')).toBeInTheDocument();
    });
  });

  describe('Optional Props', () => {
    it('should render brand when provided', () => {
      render(<Specifications specs={mockSpecs} brand="Apple" />);

      expect(screen.getByText('Brand')).toBeInTheDocument();
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    it('should render name when provided', () => {
      render(<Specifications specs={mockSpecs} name="iPhone 15 Pro Max" />);

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('iPhone 15 Pro Max')).toBeInTheDocument();
    });

    it('should render description when provided', () => {
      render(
        <Specifications
          specs={mockSpecs}
          description="The most powerful iPhone ever"
        />
      );

      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(
        screen.getByText('The most powerful iPhone ever')
      ).toBeInTheDocument();
    });

    it('should render all optional fields together', () => {
      render(
        <Specifications
          specs={mockSpecs}
          brand="Apple"
          name="iPhone 15 Pro Max"
          description="The most powerful iPhone ever"
        />
      );

      expect(screen.getByText('Brand')).toBeInTheDocument();
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('iPhone 15 Pro Max')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(
        screen.getByText('The most powerful iPhone ever')
      ).toBeInTheDocument();
    });
  });

  describe('Partial Specs', () => {
    it('should only render available specs', () => {
      const partialSpecs: ProductSpecs = {
        screen: '6.1 inches',
        processor: 'Snapdragon 8 Gen 3',
      };

      render(<Specifications specs={partialSpecs} />);

      expect(screen.getByText('Screen')).toBeInTheDocument();
      expect(screen.getByText('6.1 inches')).toBeInTheDocument();
      expect(screen.getByText('Processor')).toBeInTheDocument();
      expect(screen.getByText('Snapdragon 8 Gen 3')).toBeInTheDocument();

      // Should not render labels for missing specs
      expect(screen.queryByText('Resolution')).not.toBeInTheDocument();
      expect(screen.queryByText('Main Camera')).not.toBeInTheDocument();
      expect(screen.queryByText('Battery')).not.toBeInTheDocument();
    });

    it('should filter out specs with undefined values', () => {
      const specsWithUndefined: ProductSpecs = {
        screen: '6.7 inches',
        resolution: undefined,
        processor: 'A17 Pro',
        mainCamera: undefined,
      };

      render(<Specifications specs={specsWithUndefined} />);

      expect(screen.getByText('Screen')).toBeInTheDocument();
      expect(screen.getByText('Processor')).toBeInTheDocument();
      expect(screen.queryByText('Resolution')).not.toBeInTheDocument();
      expect(screen.queryByText('Main Camera')).not.toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('should return null when no specs are available', () => {
      const emptySpecs: ProductSpecs = {};

      const { container } = render(<Specifications specs={emptySpecs} />);

      expect(container.firstChild).toBeNull();
    });

    it('should return null when all specs are undefined', () => {
      const allUndefinedSpecs: ProductSpecs = {
        screen: undefined,
        resolution: undefined,
        processor: undefined,
        mainCamera: undefined,
        selfieCamera: undefined,
        battery: undefined,
        os: undefined,
        screenRefreshRate: undefined,
      };

      const { container } = render(
        <Specifications specs={allUndefinedSpecs} />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should render when only optional props are provided', () => {
      const emptySpecs: ProductSpecs = {};

      render(
        <Specifications specs={emptySpecs} brand="Samsung" name="Galaxy S24" />
      );

      expect(screen.getByText('Brand')).toBeInTheDocument();
      expect(screen.getByText('Samsung')).toBeInTheDocument();
      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Galaxy S24')).toBeInTheDocument();
    });
  });

  describe('Table Structure', () => {
    it('should render specifications in a table', () => {
      const { container } = render(<Specifications specs={mockSpecs} />);

      const table = container.querySelector('table');
      expect(table).toBeInTheDocument();
    });

    it('should have tbody element', () => {
      const { container } = render(<Specifications specs={mockSpecs} />);

      const tbody = container.querySelector('tbody');
      expect(tbody).toBeInTheDocument();
    });

    it('should render each spec in a table row', () => {
      const { container } = render(<Specifications specs={mockSpecs} />);

      const rows = container.querySelectorAll('tr');
      // 8 specs properties
      expect(rows.length).toBe(8);
    });

    it('should render label and value in separate cells', () => {
      const { container } = render(<Specifications specs={mockSpecs} />);

      const firstRow = container.querySelector('tr');
      const cells = firstRow?.querySelectorAll('td');

      expect(cells).toHaveLength(2);
    });
  });

  describe('CSS Classes', () => {
    it('should have correct CSS classes', () => {
      const { container } = render(<Specifications specs={mockSpecs} />);

      expect(container.querySelector('.specifications')).toBeInTheDocument();
      expect(container.querySelector('.title')).toBeInTheDocument();
      expect(container.querySelector('.table')).toBeInTheDocument();
    });

    it('should apply row class to table rows', () => {
      const { container } = render(<Specifications specs={mockSpecs} />);

      const row = container.querySelector('.row');
      expect(row).toBeInTheDocument();
    });

    it('should apply label and value classes to cells', () => {
      const { container } = render(<Specifications specs={mockSpecs} />);

      expect(container.querySelector('.label')).toBeInTheDocument();
      expect(container.querySelector('.value')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle specs with empty string values', () => {
      const specsWithEmptyStrings: ProductSpecs = {
        screen: '',
        processor: 'A17 Pro',
      };

      render(<Specifications specs={specsWithEmptyStrings} />);

      expect(screen.queryByText('Screen')).not.toBeInTheDocument();
      expect(screen.getByText('Processor')).toBeInTheDocument();
    });

    it('should handle special characters in specs', () => {
      const specsWithSpecialChars: ProductSpecs = {
        screen: '6.7" OLED',
        processor: 'A17 Pro & Neural Engine',
        resolution: '2796 x 1290 @ 460ppi',
      };

      render(<Specifications specs={specsWithSpecialChars} />);

      expect(screen.getByText('6.7" OLED')).toBeInTheDocument();
      expect(screen.getByText('A17 Pro & Neural Engine')).toBeInTheDocument();
      expect(screen.getByText('2796 x 1290 @ 460ppi')).toBeInTheDocument();
    });

    it('should handle very long spec values', () => {
      const specsWithLongValues: ProductSpecs = {
        processor:
          'This is a very long processor description that contains a lot of information about the product and its features and capabilities',
      };

      render(
        <Specifications
          specs={specsWithLongValues}
          description="This is a very long description that contains a lot of information about the product and its features and capabilities"
        />
      );

      expect(
        screen.getByText(/This is a very long processor description/)
      ).toBeInTheDocument();
      expect(
        screen.getByText(/This is a very long description that contains/)
      ).toBeInTheDocument();
    });
  });
});
