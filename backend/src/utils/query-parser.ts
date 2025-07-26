import { ParsedQs } from 'qs';

export type FilterType = {
  page: number;
  limit: number;
  query?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
  overdues?: string;
  type?: string;
};

export class QueryParser {
  static parseFilterQuery(query: ParsedQs): FilterType {
    return {
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      query: String(query.query || ''),
      status: String(query.status || ''),
      sortBy: String(query.sortBy || 'createdAt'),
      sortOrder: String(query.sortOrder || 'desc'),
      overdues: String(query?.overdues || 'false'),
      type: String(query.type || '')
    };
  }
}
