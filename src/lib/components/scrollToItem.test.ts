import { scrollToItem } from './scrollToItem';

const childrenItemMock = jest.fn().mockName('item');
const scrollToMock = jest.fn().mockName('scrollTo');
const setAttributeMock = jest.fn().mockName('setAttribute');
const setAttributeActiveMock = jest.fn().mockName('setAttribute');
const getComputedStyleSpy = jest.spyOn(window, 'getComputedStyle');

const offsetLeft = 37;
const paddingLeft = '1337';

const itemMock = {
  setAttribute: setAttributeMock,
};
const itemActiveMock = {
  setAttribute: setAttributeActiveMock,
  offsetLeft,
};

const wrapperRefMock = {
  current: {
    children: {
      item: childrenItemMock.mockReturnValue(itemActiveMock),
    },
    scrollTo: scrollToMock,
    querySelectorAll: () => [itemMock, itemMock, itemMock],
  },
};

beforeEach(() => {
  jest.clearAllMocks();
  getComputedStyleSpy.mockReturnValue({
    paddingLeft,
  } as any);

  wrapperRefMock.current.children.item.mockReturnValue(itemActiveMock);
  wrapperRefMock.current.scrollTo = scrollToMock;
});

afterAll(() => {
  jest.resetAllMocks();
  getComputedStyleSpy.mockRestore();
});

describe('scrollToItem', () => {
  describe('do nothing tests', () => {
    it('should do nothing if wrapperRef is null', () => {
      scrollToItem(0, null as any, undefined);

      expect(childrenItemMock).toHaveBeenCalledTimes(0);
    });

    it('should do nothing if wrapperRef.current is null', () => {
      scrollToItem(0, { current: null } as any, undefined);

      expect(childrenItemMock).toHaveBeenCalledTimes(0);
    });

    it('should do nothing if wrapperRef.current is defined but scrollTo is not a function', () => {
      wrapperRefMock.current.scrollTo = null as any;

      scrollToItem(1, wrapperRefMock as any, undefined);

      expect(childrenItemMock).toHaveBeenCalledTimes(0);
    });
  });

  describe('scrollTo tests', () => {
    it('should not call scrollTo if item returns null', () => {
      wrapperRefMock.current.children.item.mockReturnValueOnce(null);

      scrollToItem(1, wrapperRefMock as any, undefined);

      expect(childrenItemMock).toHaveBeenCalledTimes(1);
      expect(childrenItemMock).toHaveBeenCalledWith(1);
      expect(scrollToMock).toHaveBeenCalledTimes(0);
    });

    it('should call scrollTo with correct prop if item returns not null', () => {
      scrollToItem(1, wrapperRefMock as any, undefined);

      expect(scrollToMock).toHaveBeenCalledTimes(1);
      expect(scrollToMock).toHaveBeenCalledWith({ left: offsetLeft - parseFloat(paddingLeft) });
    });
  });

  describe('activeDataAttribute tests', () => {
    it('should not call setAttribute if activeDataAttribute is undefined', () => {
      scrollToItem(1, wrapperRefMock as any, undefined);

      expect(setAttributeMock).toHaveBeenCalledTimes(0);
      expect(setAttributeActiveMock).toHaveBeenCalledTimes(0);
    });

    it('should call setAttribute if activeDataAttribute is defined', () => {
      scrollToItem(1, wrapperRefMock as any, 'data-test');

      expect(setAttributeMock).toHaveBeenCalledTimes(wrapperRefMock.current.querySelectorAll().length);
      expect(setAttributeMock).toHaveBeenCalledWith('data-test', 'false');
      expect(setAttributeActiveMock).toHaveBeenCalledTimes(1);
      expect(setAttributeActiveMock).toHaveBeenCalledWith('data-test', 'true');
    });
  });
});
