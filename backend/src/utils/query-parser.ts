import { ParsedQs } from "qs";

export type FilterType = {
  page: number;
  limit: number;
  query?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
  type?: string;
};

type FilterBuilderOptions = {
  searchText?: string;
  searchFields?: string[];
  additionalFilters?: Record<string, any>;
};

export class QueryParser {
  static parseFilterQuery(query: ParsedQs): FilterType {
    return {
      page: query.page !== undefined ? Number(query.page) : 1,
      limit: query.limit !== undefined ? Number(query.limit) : 10,
      query: String(query.query || ""),
      status: String(query.status || ""),
      sortBy: String(query.sortBy || "createdAt"),
      sortOrder: String(query.sortOrder || "desc"),
      type: String(query.type || ""),
    };
  }
  static buildFilter({
    searchText,
    searchFields = [],
    additionalFilters = {},
  }: FilterBuilderOptions): Record<string, unknown> {
    const filter: Record<string, unknown> = { ...additionalFilters };

    if (searchText && searchFields.length > 0) {
      filter.$or = searchFields.map((field) => ({
        [field]: { $regex: searchText, $options: "i" },
      }));
    }

    return filter;
  }
}
