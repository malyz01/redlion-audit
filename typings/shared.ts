export type PaginationType = {
  currentPage: number;
  pageSize: number;
};

export type ActionCreatorType<T> = {
  type: T;
  payload?: unknown;
};

export type InitialStatePageType<Q, D> = {
  pagination: PaginationType;
  query: Q | null;
  data: D | null;
};
