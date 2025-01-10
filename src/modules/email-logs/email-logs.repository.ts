import { InjectRepository } from '@nestjs/typeorm';
import { EmailLogs } from 'src/entities/email-logs.entity';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Brackets, Repository } from 'typeorm';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { PaginationCalculatedModel } from 'src/models/pagination.model';

export class EmailLogsRepository extends BaseAbstractRepository<EmailLogs> {
  constructor(
    @InjectRepository(EmailLogs)
    private readonly emailLogs: Repository<EmailLogs>,
    private readonly helperFunctions: HelperFunctions,
  ) {
    super(emailLogs);
  }

  async findAllPaginated(calculatedPagination: PaginationCalculatedModel) {
    const { take, skip, search, orderBy, orderDirection, ...attributes } =
      calculatedPagination;

    const queryBuilder = this.emailLogs.createQueryBuilder('email-logs');
    const userColumnNames = ['subject', 'to'];
    if (search) {
      queryBuilder.andWhere(
        new Brackets((searchBrackets) => {
          const searchConditions: string[] = userColumnNames.map(
            (columnName) => {
              return `email-logs.${columnName} LIKE :search`;
            },
          );
          const updatedSearchCondtion = [...searchConditions];
          // Add the search condition if at least one userColumn matches
          if (updatedSearchCondtion.length > 0) {
            searchBrackets.where(updatedSearchCondtion.join(' OR '), {
              search: `%${search}%`,
            });
          }
        }),
      );
    }

    if (orderBy && orderDirection && userColumnNames.includes(orderBy)) {
      queryBuilder.addOrderBy(`email-logs.${orderBy}`, orderDirection);
    }

    const [entities, total] = await queryBuilder
      .skip(skip)
      .take(take)
      .orderBy('id', 'DESC')
      .getManyAndCount();

    //meta-pagination-information
    const basicPaginationProps =
      this.helperFunctions.calculatPaginationProperties(total, take, skip);

    return {
      ...basicPaginationProps,
      list: entities,
    };
  }
}
