# React MUI Simple Horizontal Scroll

This is a simple horizontal scroll React component based on MUI.

The scrolling is native browser scroll, the scrollbar will be hidden by css. It has support for CSS Snapping. You can scroll initialy to a given item index or you cann scroll programmaticly with the use of a reference. You can also set a data attribute by your own. If it is set the active item will have a value of "true" otherwise "false". So you can style the active item by your own.

## Usage

```javascript
import HorizontalScroll from './components/HorizontalScroll';

<HorizontalScroll gap={10} scrollToItemIndex={2} activeDataAttribute="data-active" offset={'2rem'}>
  /** children here */
</HorizontalScroll>;
```

## Props

| Prop                | Description                                                    | Type           | mandatory | default |
| ------------------- | -------------------------------------------------------------- | -------------- | --------- | ------- |
| gap                 | the gap between the items                                      | string, number | false     | 0       |
| offset              | offset of the first and last item to the border of the wrapper | string, number | false     | 0       |
| scrollToItemIndex   | initial scroll to the given item index starting at 0           | number         | false     | 0       |
| activeDataAttribute | a data attribute that can be used to style the active item     | string         | false     |         |

## Usage with ref

The component returns 2 methods to a given ref.

| method           | description                                                                                                                                                 | return value |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| scrollToIndex    | method to scroll programmaticly to an item index                                                                                                            | void         |
| hasScrollContent | handler function to evaluate if the scroller has overflowing content ->can be used in combination with window.resize to toggle a showAll button for example | boolean      |

```javascript
import React from 'react';
import HorizontalScroll from './components/HorizontalScroll';

function Component() {
  const ref = React.useRef < HorizontalScrollHandle > null;
  const [showAll, setShowAll] = React.useState(false);

  React.useEffect(() => {
    const handler = () => {
      if (ref?.current) {
        setShowAll(ref.current.hasScrollContent());
      }
    };

    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('resize', handler);
    };
  }, [ref, setShowAll]);

  function onClickHandler(index: number) {
    if (ref?.current) {
      ref.current.scrollToIndex(index);
    }
  }

  return (
    <>
      {showAll && <button>Show All</button>}
      <HorizontalScroll gap={10} scrollToItemIndex={2} activeDataAttribute="data-active" offset={'2rem'} ref={ref}>
        <div onClick={() => onClickHandler(0)}>1</div>
        <div onClick={() => onClickHandler(1)}>2</div>
        <div onClick={() => onClickHandler(2)}>3</div>
      </HorizontalScroll>
    </>
  );
}
```
