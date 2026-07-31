export const VEGA_DEFAULT_SAVE_SLOT_COUNT = 200;
export const VEGA_SAVE_PAGE_SIZE = 10;

export const vegaShellSaveSlotNames = (
  _saves: readonly { readonly slot: string }[],
): readonly string[] =>
  Array.from(
    { length: VEGA_DEFAULT_SAVE_SLOT_COUNT },
    (_, index) => String(index + 1),
  );

export const vegaShellSavePage = (
  slots: readonly string[],
  requestedPage: number,
): {
  readonly page: number;
  readonly pageCount: number;
  readonly slots: readonly string[];
} => {
  const pageCount = Math.max(1, Math.ceil(slots.length / VEGA_SAVE_PAGE_SIZE));
  const page = Math.min(
    pageCount - 1,
    Math.max(0, Number.isSafeInteger(requestedPage) ? requestedPage : 0),
  );
  const start = page * VEGA_SAVE_PAGE_SIZE;
  return {
    page,
    pageCount,
    slots: slots.slice(start, start + VEGA_SAVE_PAGE_SIZE),
  };
};
