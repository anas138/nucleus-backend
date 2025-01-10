import { Order } from 'src/common/enums/enums';

export class PaginationQueryModel {
  limit: number;
  page: number;
  search?: string;
  orderBy?: string;
  orderDirection?: Order;
}

export class PaginationCalculatedModel {
  take?: number;
  skip?: number;
  search?: string;
  orderBy?: string;
  orderDirection?: Order;
}

export class PaginatedResultsModel {
  queryBuilder?: any;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  list: any[];
}
//   column: string;
//   order: Order;
// }
