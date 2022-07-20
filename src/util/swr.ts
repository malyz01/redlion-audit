import { PaginationType } from '../../typings/shared';

export const mkSWRPath = (
  baseURL: string,
  pagination: PaginationType,
  query?: Record<string, string | number> | null,
) => {
  let path = `${baseURL}?page=${pagination.currentPage}&size=${pagination.pageSize}`;

  if (query) {
    path += Object.entries(query).reduce((acc, val, idx) => (acc += `${idx > 0 ? '&' : ''}${val[0]}=${val[1]}`), '');
  }

  return path;
};
