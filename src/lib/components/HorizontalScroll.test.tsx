/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */
import React, { useRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import HorizontalScroll from './HorizontalScroll';

import type { HorizontalScrollHandle } from './types';

import { scrollToItem } from './scrollToItem';

jest.mock('./scrollToItem', () => {
  return {
    __esModule: true,
    scrollToItem: jest.fn().mockName('scrollToItem'),
  };
});

function getContent(count: number): JSX.Element[] {
  return [...Array(count)].map((_, index) => (
    <div key={`index${index.toString()}`} data-testid="content">
      {index}
    </div>
  ));
}

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  jest.resetAllMocks();
});

describe('HorizontalScroll', () => {
  describe('Components & Styling', () => {
    it('should render wrapper with correct styles if HorizontalScroll was called without props', () => {
      const { container } = render(<HorizontalScroll>{getContent(4)}</HorizontalScroll>);

      expect(container).not.toBeEmptyDOMElement();

      const wrapper = container.querySelector('section');

      expect(wrapper).toHaveStyle({
        gap: 0,
        padding: '0 0',
        scrollPaddingInline: 0,
      });
      expect(screen.getAllByTestId('content')).toHaveLength(4);
    });

    it('should render wrapper with correct styles with given offset prop', () => {
      const { container } = render(<HorizontalScroll offset="0.75rem">{getContent(4)}</HorizontalScroll>);

      const wrapper = container.querySelector('section');

      expect(wrapper).toHaveStyle({
        gap: 0,
        padding: '0 0.75rem',
        scrollPaddingInline: '0.75rem',
      });
    });

    it('should render wrapper with correct styles  with given gap prop', () => {
      const { container } = render(<HorizontalScroll gap="2rem">{getContent(4)}</HorizontalScroll>);

      const wrapper = container.querySelector('section');

      expect(wrapper).toHaveStyle({
        gap: '2rem',
        padding: '0 0',
        scrollPaddingInline: '0',
      });
    });

    it('should render wrapper with correct styles with given gap and offset prop', () => {
      const { container } = render(
        <HorizontalScroll gap="2rem" offset="0.75rem">
          {getContent(4)}
        </HorizontalScroll>
      );

      const wrapper = container.querySelector('section');

      expect(wrapper).toHaveStyle({
        gap: '2rem',
        padding: '0 0.75rem',
        scrollPaddingInline: '0.75rem',
      });
    });

    it('should call children with correct prop if HorizontalScroll was called with activeDataAttribute prop', () => {
      render(
        <HorizontalScroll scrollToItemIndex={0} activeDataAttribute="data-test">
          {getContent(4)}
        </HorizontalScroll>
      );

      const content = screen.getAllByTestId('content');

      expect(content[0]).toHaveAttribute('data-test', 'true');
      expect(content[1]).toHaveAttribute('data-test', 'false');
    });

    it('should not render invalid children', () => {
      const { container } = render(
        <HorizontalScroll scrollToItemIndex={2} activeDataAttribute="test">
          <div>Test</div>
          Hello
        </HorizontalScroll>
      );

      expect(container).toHaveTextContent('Test');
    });
  });

  describe('initialScroll', () => {
    it('should not call scrollToItem if scrollToItemIndex is 0', () => {
      render(
        <HorizontalScroll scrollToItemIndex={0} activeDataAttribute="test">
          {getContent(4)}
        </HorizontalScroll>
      );

      expect(scrollToItem).toHaveBeenCalledTimes(0);
    });

    it('should not call scrollToItem if scrollToItemIndex is a negative value', () => {
      render(
        <HorizontalScroll scrollToItemIndex={-1} activeDataAttribute="test">
          {getContent(4)}
        </HorizontalScroll>
      );

      expect(scrollToItem).toHaveBeenCalledTimes(0);
    });

    it('should call scrollToItem if scrollToItemIndex is bigger then 0', () => {
      render(
        <HorizontalScroll scrollToItemIndex={2} activeDataAttribute="data-test">
          {getContent(4)}
        </HorizontalScroll>
      );

      expect(scrollToItem).toHaveBeenCalledTimes(1);
      expect(scrollToItem).toHaveBeenCalledWith(2, expect.any(Object), 'data-test');
    });
  });

  describe('Handler Calls', () => {
    describe('scrollToIndex', () => {
      const buttonId = 'button-test';

      const Helper: React.FC = () => {
        const ref = React.useRef<HorizontalScrollHandle>(null);

        function scrollCb() {
          if (ref && ref.current) {
            ref.current.scrollToIndex(2);
          }
        }

        return (
          <>
            <button data-testid={buttonId} onClick={scrollCb} type="submit">
              test
            </button>
            <HorizontalScroll activeDataAttribute="data-test" ref={ref}>
              {getContent(4)}
            </HorizontalScroll>
          </>
        );
      };

      it('should call scrollToIndex with correct props', () => {
        render(<Helper />);

        expect(scrollToItem).toHaveBeenCalledTimes(0);

        fireEvent.click(screen.getByTestId(buttonId));

        expect(scrollToItem).toHaveBeenCalledTimes(1);
        expect(scrollToItem).toHaveBeenCalledWith(2, expect.any(Object), 'data-test');
      });
    });

    describe('hasScrollContent', () => {
      const mockFn = jest.fn();

      const Helper: React.FC = () => {
        const ref = useRef<HorizontalScrollHandle>(null);

        return (
          <HorizontalScroll activeDataAttribute="data-test" ref={ref}>
            <div
              onClick={() => {
                mockFn(ref!.current!.hasScrollContent());
              }}
              data-testid="button"
            />
          </HorizontalScroll>
        );
      };

      it('hasScrollContent method should return false if clientWidth is equal to scrollwidth', () => {
        jest.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(() => 100);
        jest.spyOn(Element.prototype, 'scrollWidth', 'get').mockImplementation(() => 100);

        render(<Helper />);

        fireEvent.click(screen.getByTestId('button'));

        expect(mockFn).toHaveBeenCalledWith(false);
      });

      it('hasScrollContent method should return false if clientWidth is bigger then scrollwidth', () => {
        jest.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(() => 110);
        jest.spyOn(Element.prototype, 'scrollWidth', 'get').mockImplementation(() => 100);

        render(<Helper />);

        fireEvent.click(screen.getByTestId('button'));

        expect(mockFn).toHaveBeenCalledWith(false);
      });

      it('hasScrollContent method should return false if wrapperRef is not defined', () => {
        jest.spyOn(Element.prototype, 'scrollWidth', 'get').mockImplementation(() => 110);
        jest.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(() => 100);

        // this is working because I use React.useRef in the Componnent and ref as named import in the Helper
        const useRefSpy = jest.spyOn(React, 'useRef').mockReturnValue(null as any);

        render(<Helper />);

        expect(mockFn).toHaveBeenCalledTimes(0);

        jest.spyOn(Element.prototype, 'scrollWidth', 'get').mockImplementation(() => 90);
        jest.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(() => 100);

        fireEvent.click(screen.getByTestId('button'));

        expect(mockFn).toHaveBeenCalledWith(false);

        useRefSpy.mockRestore();
      });

      it('hasScrollContent method should return true if clientWidth is smaller then scrollwidth', () => {
        jest.spyOn(Element.prototype, 'clientWidth', 'get').mockImplementation(() => 100);
        jest.spyOn(Element.prototype, 'scrollWidth', 'get').mockImplementation(() => 110);

        render(<Helper />);

        fireEvent.click(screen.getByTestId('button'));

        expect(mockFn).toHaveBeenCalledWith(true);
      });
    });
  });
});
