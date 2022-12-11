# React Simple Horizontal Scroll

This is a simple horizontal scroll React component.

The intention to build this component was to have a lightweigt horizontal scroll component with snapping and some basic features for mobile devices. A usual slider or carousel was way to heavy for my needs. It works well on all touch devices and desktop devices who has the ability to scroll horzizontal by mouse or touchpad.

The scrolling is native browser scroll, the scrollbar will be hidden by CSS. It has support for CSS Snapping. You can scroll initialy to a given item index or you can scroll programmaticly with the use of a reference. You can also set a data attribute by your own. The active item will have a value of "true" otherwise "false". So you can style the active item by your own.

## Usage

### Install component

```javascript
npm i react-simple-horizontal-scroll
```

### Use in your component

```javascript
import { HorizontalScroll } from 'react-simple-horizontal-scroll';
import type { HorizontalScrollHandle } from 'react-simple-horizontal-scroll/dist/types';

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

### Methods

| method           | description                                                                                                                                                 | return value |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| scrollToIndex    | method to scroll programmaticly to an item index                                                                                                            | void         |
| hasScrollContent | handler function to evaluate if the scroller has overflowing content ->can be used in combination with window.resize to toggle a showAll button for example | boolean      |

### Sample code

```typescript
import React from 'react';
import { HorizontalScroll } from 'react-simple-horizontal-scroll';
import type { HorizontalScrollHandle } from 'react-simple-horizontal-scroll/dist/types';

function Component() {
  const ref = React.useRef<HorizontalScrollHandle | null>(null);
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

## Usage - for Github only

### Checkout project

```
$ git clone https://github.com/DerWebschreiner/react-simple-horizontal-scroll.git
```

### install

```
$ npm install
```

### start demo

```
$ npm run start
```

### run tests

```
$ npm run test
```
