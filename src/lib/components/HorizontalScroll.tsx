import React from 'react';
import { scrollToItem } from './scrollToItem';
import { HorizontalScrollHandle, HorizontalScrollProps } from './types';

import './HorizontalScroll.styles.css';

const HorizontalScrollComponent: React.ForwardRefRenderFunction<HorizontalScrollHandle, HorizontalScrollProps> = (
  { offset = 0, gap = 0, scrollToItemIndex = 0, activeDataAttribute, children },
  ref
) => {
  const wrapperRef = React.useRef<HTMLDivElement | null>(null);
  React.useEffect(() => {
    if (scrollToItemIndex > 0) {
      scrollToItem(scrollToItemIndex, wrapperRef, activeDataAttribute);
    }
  }, [scrollToItemIndex, wrapperRef, activeDataAttribute]);

  React.useImperativeHandle(ref, () => ({
    scrollToIndex(index: number) {
      scrollToItem(index, wrapperRef, activeDataAttribute);
    },
    hasScrollContent(): boolean {
      return wrapperRef?.current ? wrapperRef.current.clientWidth < wrapperRef.current.scrollWidth : false;
    },
  }));

  return (
    <section
      ref={wrapperRef}
      className="horizontalScrollWrapper"
      style={{ gap, padding: `0 ${offset}`, scrollPaddingInline: offset }}
    >
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          const props = { ...child.props };
          if (activeDataAttribute !== undefined) {
            props[activeDataAttribute] = `${index === 0}`;
          }
          return React.cloneElement(child, props);
        }
        return null;
      })}
    </section>
  );
};

export default React.forwardRef(HorizontalScrollComponent);
