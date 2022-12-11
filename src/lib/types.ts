export type HorizontalScrollProps = {
  /**
   * the children of the scroll wrapper
   */
  children: React.ReactNode;
  /**
   * the offset left and right to give the items some space to the container
   *
   * @default 0
   */
  offset?: string | number;
  /**
   * a flex gap value to give the flex items some space
   *
   * @default 0
   */
  gap?: string | number;
  /**
   * initial scroll to an item with the given index (starting with 0)
   *
   * @default 0
   */
  scrollToItemIndex?: number;
  /**
   * a data attribute for the active item
   * the value will be set to true if the item is active
   * the value will be set to false if the item is inactive
   */
  activeDataAttribute?: string;
  /**
   * layout option to render the scroller
   * SCROLL -> renders the items in a row with a scroll
   * FLOAT -> renders the items in float layout without scroll
   *
   * @default 'SCROLL'
   */
  layout?: 'SCROLL' | 'FLOAT';
};

export type HorizontalScrollHandle = {
  /**
   * handler function to scroll to a given index starting at 0
   */
  scrollToIndex: (index: number) => void;
  /**
   * handler function to evaluate if the scroller has overflowing content
   *
   * can be used in combination with window.resize to toggle a showAll button for example
   */
  hasScrollContent: () => boolean;
};
