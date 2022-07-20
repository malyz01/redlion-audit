export const convertToString = (value: unknown) => (typeof value === 'string' ? value : JSON.stringify(value));
