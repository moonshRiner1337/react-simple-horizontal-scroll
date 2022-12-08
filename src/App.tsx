import React from 'react';
import HorizontalScroll from './lib/components/HorizontalScroll';
import type { HorizontalScrollHandle } from './lib/components/types';

function App() {
  const ref = React.useRef<HorizontalScrollHandle>(null);
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
    <div className="App" style={{ backgroundColor: '#eee', width: '100vw', height: '100vh' }}>
      <div style={{ width: '80vw', margin: 'auto', overflow: 'hidden', padding: '2rem 0', backgroundColor: '#333' }}>
        {showAll && <button>Show All</button>}
        <HorizontalScroll gap={'1rem'} scrollToItemIndex={2} activeDataAttribute="data-active" offset={'2rem'}>
          {Array.from({ length: 10 }, (v, i) => i).map((index) => {
            return (
              <div
                style={{
                  width: '20vw',
                  height: '20vw',
                  backgroundColor: '#eee',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flex: '0 0 20vw',
                }}
                onClick={() => onClickHandler(index)}
              >
                {index + 1}
              </div>
            );
          })}
        </HorizontalScroll>
      </div>
    </div>
  );
}

export default App;
