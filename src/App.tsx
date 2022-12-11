import React from 'react';
import HorizontalScroll from './lib/HorizontalScroll';
import type { HorizontalScrollHandle } from './lib/types';

import './app.css';

function App() {
  const ref = React.useRef<HorizontalScrollHandle>(null);
  const [showAll, setShowAll] = React.useState(false);
  const [isShowAllAvailable, setIsShowAllAvailable] = React.useState(false);

  React.useEffect(() => {
    const handler = () => {
      if (ref?.current) {
        setIsShowAllAvailable(ref.current.hasScrollContent());
      }
    };

    handler();
    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('resize', handler);
    };
  }, [ref, setIsShowAllAvailable]);

  function onClickHandler(index: number) {
    if (ref?.current) {
      ref.current.scrollToIndex(index - 1);
    }
  }

  function showAllHandler() {
    setShowAll((prev) => !prev);
  }

  function changeHandler(event: React.ChangeEvent<HTMLInputElement>) {
    onClickHandler(parseInt(event.target.value, 10));
  }
  const content = Array.from({ length: 10 }, (v, i) => i).map((index) => {
    return (
      <div className="contentItem" onClick={() => onClickHandler(index)}>
        {index + 1}
      </div>
    );
  });

  return (
    <div className="app">
      <div className="card">
        <div className="contentWrapper">
          <h1>Simple Horizontal Scroll React Component Demo</h1>
          {isShowAllAvailable && <button onClick={showAllHandler}>{showAll ? 'Show Less' : 'Show All'}</button>}
          {!showAll && (
            <p>
              <label htmlFor="scrollto">Scroll to item</label>
              <input id="scrollto" type="number" min={1} step={1} defaultValue="1" onChange={changeHandler} />
            </p>
          )}
        </div>
        {!showAll ? (
          <HorizontalScroll
            gap={'1rem'}
            scrollToItemIndex={0}
            activeDataAttribute="data-active"
            offset={'2rem'}
            ref={ref}
          >
            {content}
          </HorizontalScroll>
        ) : (
          <div className="showAllWrapper">{content}</div>
        )}
      </div>
    </div>
  );
}

export default App;
