// Common reusable types and utility functions

export type StoreOption = { label: string; value: string };

export const toNumber = (val: unknown): number => Number(val || 0);
