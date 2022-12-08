import { HorizontalScrollProps } from './types';

export function scrollToItem(
  index: number,
  wrapperRef: React.MutableRefObject<HTMLDivElement | null>,
  activeDataAttribute: HorizontalScrollProps['activeDataAttribute']
) {
  if (wrapperRef?.current && typeof wrapperRef.current.scrollTo === 'function') {
    const scrollItem = wrapperRef.current.children.item(index);

    if (scrollItem) {
      // needs to be calulated here because offset prop can be every unit of measurement and we need pixels here
      const paddingWrapper = parseFloat(window.getComputedStyle(wrapperRef.current).paddingLeft);
      // reset active
      if (activeDataAttribute !== undefined) {
        const items = wrapperRef.current.querySelectorAll(`[${activeDataAttribute}]`);
        items.forEach((item) => {
          item.setAttribute(activeDataAttribute, 'false');
        });
        scrollItem.setAttribute(activeDataAttribute, 'true');
      }
      // calculate offset left
      const offsetLeft = (scrollItem as HTMLElement).offsetLeft - paddingWrapper;
      wrapperRef.current.scrollTo({ left: offsetLeft });
    }
  }
}
