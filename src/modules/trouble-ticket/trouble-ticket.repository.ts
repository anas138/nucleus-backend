import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Brackets, Repository } from 'typeorm';
import { TroubleTicket } from 'src/entities/trouble-ticket.entity';
import { TroubleTicketFilterModel } from 'src/models/trouble-ticket.model';
import {
  PaginatedResultsModel,
  PaginationCalculatedModel,
} from 'src/models/pagination.model';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { ReportModel } from 'src/models/report.model';
import { AlarmFilterConfig } from 'src/entities/alarm-filter-config.entity';
import { DropDownItem } from 'src/entities/drop-down-item.entity';
import {
  APP_PERMISSIONS,
  DROPDOWN_ITEM_IDS,
  TROUBLE_TICKET_SORT,
} from 'src/common/enums/enums';
import { DataSource } from 'typeorm';
import { Region } from 'src/entities/region.entity';
import { FetchUserModel } from 'src/models/user.model';
import { GetTroubleTicketDashboardModel } from 'src/models/trouble-ticket-dashboard.model';
import { SubDepartment } from 'src/entities/sub-department.entity';
import { TroubleTicketCategory } from 'src/entities/trouble-ticket-catagory.entity';
import { TroubleTicketAssignedRepository } from '../trouble-ticket-assigned/trouble-ticket-assigned.repository';

@Injectable()
export class TroubleTicketRepository extends BaseAbstractRepository<TroubleTicket> {
  constructor(
    @InjectRepository(TroubleTicket)
    private readonly troubleTicketRepository: Repository<TroubleTicket>,
    private helperFunctions: HelperFunctions,
    private readonly troubleTicketAssignedRepository: TroubleTicketAssignedRepository,
    @InjectDataSource() private dataSource: DataSource,
  ) {
    super(troubleTicketRepository);
  }
  async getTroubleTicket(
    queryParam: TroubleTicketFilterModel,
    user: FetchUserModel,
  ): Promise<PaginatedResultsModel> {
    const calculatedPagination: PaginationCalculatedModel =
      this.helperFunctions.calculatePagination(queryParam);
    const { skip, take, orderBy, orderDirection } = calculatedPagination;
    const {
      medium,
      category,
      subDepartment,
      searchColumn,
      toDate,
      fromDate,
      statusColumn,
      pauseRequest,
      appType,
      rcaRequired,
      isOutageOccurred,
      ticket_generation_type,
      priorityLevel,
      overTat,
      alarmFilterConfigIds,
      networkType,
    } = queryParam;

    const tableName = 'trouble_ticket';
    const joinRelation = [
      {
        joinColumn: 'currentStatus',
        alliance: 'drop_down_item',
      },

      {
        joinColumn: 'ticketGenerationType',
        alliance: 'drop_down_item_type',
      },

      {
        joinColumn: 'troubleTicketCategory',
        alliance: 'trouble_ticket_category',
      },
      {
        joinColumn: 'troubleTicketSubCategory',
        alliance: 'trouble_ticket_sub_category',
      },
      {
        joinColumn: 'troubleTicketMedium',
        alliance: 'trouble_ticket_medium',
      },
      {
        joinColumn: 'alarmDetailNce',
        alliance: 'nce_alarm_id',
      },
      {
        joinColumn: 'alarmDetailNCEGpon',
        alliance: 'nce_gpon_alarm',
      },
      {
        joinColumn: 'alarmDetailObservium',
        alliance: 'obs_alarm_id',
      },
      {
        joinColumn: 'alarmDetailNokiaTxn',
        alliance: 'nokia_txn_alarm',
      },

      {
        joinColumn: 'alarmDetailLdiSoftswitch',
        alliance: 'ldi_soft_switch_alarm',
      },

      {
        joinColumn: 'assignedToUser',
        alliance: 'user',
      },
      {
        joinColumn: 'department',
        alliance: 'department',
      },
      {
        joinColumn: 'subDepartment',
        alliance: 'subDepartment',
      },
      {
        joinColumn: 'createdByUser',
        alliance: 'cUser',
      },
      {
        joinColumn: 'troubleTicketPause',
        alliance: 'trouble_ticket_pause',
      },
      {
        joinColumn: 'currentTicketPause',
        alliance: 'current_trouble_ticket_pause',
      },
      {
        joinColumn: 'outageAlarms',
        alliance: 'accumulated_trouble_ticket',
      },
      {
        joinColumn: 'priorityLevel',
        alliance: 'drop_down_item_P',
      },

      {
        joinColumn: 'alarmFilterConfig',
        alliance: 'al',
      },
    ];

    const queryBuilder = await this.troubleTicketRepository.createQueryBuilder(
      'troubleTicketTable',
    );
    if (joinRelation?.length) {
      joinRelation.forEach(({ joinColumn, alliance }) => {
        queryBuilder.leftJoinAndSelect(
          `troubleTicketTable.${joinColumn}`,
          `${alliance}`,
        );
      });
    }
    await this.filterDepartments(queryBuilder, user);
    if (statusColumn) {
      const ttStatus = JSON.parse(statusColumn);
      queryBuilder.andWhere('troubleTicketTable.status IN (:...status)', {
        status: ttStatus,
      });
    }

    if (alarmFilterConfigIds) {
      const ids = JSON.parse(alarmFilterConfigIds);
      queryBuilder.andWhere(
        'troubleTicketTable.alarm_config_id IN (:...alarmConfigId)',
        {
          alarmConfigId: ids,
        },
      );
    }

    if (medium) {
      queryBuilder.andWhere(`troubleTicketTable.medium = :medium`, {
        medium: medium,
      });
    }

    if (category) {
      queryBuilder.andWhere(
        `troubleTicketTable.trouble_ticket_category_id = :catId`,
        {
          catId: category,
        },
      );
    }

    if (subDepartment) {
      queryBuilder.andWhere(
        `troubleTicketTable.sub_department_id = :subDepartment`,
        {
          subDepartment: subDepartment,
        },
      );
    }

    if (priorityLevel) {
      queryBuilder.andWhere(
        `troubleTicketTable.priority_level = :priorityLevel`,
        {
          priorityLevel: priorityLevel,
        },
      );
    }

    if (overTat) {
      queryBuilder.andWhere(`troubleTicketTable.over_tat = :overTat`, {
        overTat: +overTat,
      });
    }

    if (toDate && fromDate) {
      queryBuilder
        .andWhere(`troubleTicketTable.created_at >= :fromDate`, {
          fromDate: fromDate,
        })
        .andWhere(`troubleTicketTable.created_at <= :toDate`, {
          toDate: toDate,
        });
    }

    if (pauseRequest) {
      queryBuilder
        .leftJoin('troubleTicketTable.currentTicketPause', 'p')
        .andWhere('p.is_approved = :isApproved', { isApproved: false })
        .andWhere('troubleTicketTable.status != :completedStatus', {
          completedStatus: DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.COMPLETED,
        })
        .andWhere('troubleTicketTable.status != :cancelStatus', {
          cancelStatus: DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.CANCELLED,
        })
        .andWhere('troubleTicketTable.status != :resolvedStatus', {
          resolvedStatus: DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.RESOLVED,
        });
    }

    if (rcaRequired) {
      queryBuilder
        .andWhere('troubleTicketTable.is_rca_required = :is_rca_required', {
          is_rca_required: true,
        })
        .andWhere('troubleTicketTable.status != :completedStatus', {
          completedStatus: DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.COMPLETED,
        })
        .andWhere('troubleTicketTable.status != :cancelStatus', {
          cancelStatus: DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.CANCELLED,
        });
    }

    if (appType) {
      queryBuilder.andWhere(`troubleTicketTable.app_type = :appType`, {
        appType: appType,
      });
    }
    if (networkType) {
      queryBuilder.andWhere(`troubleTicketTable.network_type = :networkType`, {
        networkType: networkType,
      });
    }

    if (isOutageOccurred) {
      queryBuilder.andWhere(
        `troubleTicketTable.is_outage_occurred = :isOutageOccurred`,
        {
          isOutageOccurred: +isOutageOccurred,
        },
      );
    }

    if (ticket_generation_type) {
      queryBuilder.andWhere(
        `troubleTicketTable.ticket_generation_type = :ticket_generation_type`,
        {
          ticket_generation_type,
        },
      );
    }

    if (searchColumn) {
      const userColumnNames = [
        'case_title',
        'network_type',
        'ticket_number',
        'is_outage_occurred',
      ];
      queryBuilder.andWhere(
        new Brackets((searchBrackets) => {
          const searchConditions: string[] = userColumnNames.map(
            (columnName) => {
              return `troubleTicketTable.${columnName} LIKE :search`;
            },
          );
          const updatedSearchCondtion = [
            ...searchConditions,
            'drop_down_item.label LIKE:search',
            'nce_alarm_id.native_probable_cause LIKE:search',
            'obs_alarm_id.device_hostname LIKE:search',
          ];
          // Add the search condition if at least one userColumn matches
          if (updatedSearchCondtion.length > 0) {
            searchBrackets.where(updatedSearchCondtion.join(' OR '), {
              search: `%${searchColumn}%`,
            });
          }
        }),
      );
    }

    queryBuilder.orderBy('troubleTicketTable.updated_at', 'DESC');

    if (orderBy) {
      const direction = orderDirection || 'DESC';
      queryBuilder.orderBy(`troubleTicketTable.${orderBy}`, direction);
      switch (orderBy) {
        case TROUBLE_TICKET_SORT.STATUS: {
          queryBuilder.orderBy(`drop_down_item.sequence`, direction);
          break;
        }

        case TROUBLE_TICKET_SORT.ALARM_NAME: {
          queryBuilder
            .orderBy(`obs_alarm_id.alert_message`, direction)
            .addOrderBy(`nce_alarm_id.native_probable_cause`, direction);
          break;
        }

        case TROUBLE_TICKET_SORT.DEVICE: {
          queryBuilder
            .orderBy('obs_alarm_id.device_hostname', direction)
            .addOrderBy('nce_alarm_id.ne_name', direction);

          break;
        }
      }
    }

    const [entities, total] = await queryBuilder
      .skip(skip)
      .take(take)
      .getManyAndCount();

    let updatedList = [];
    entities.filter((li: any) => {
      if (li.alarm_config_id === li.alarmDetailNce?.alarm_filter_config_id) {
        const list = {
          ...li,
          alarm_detail: li.alarmDetailNce,
        };
        delete list.alarmDetailObservium;
        delete list.alarmDetailNce;
        delete list.alarmDetailNCEGpon;
        delete list.alarmDetailLdiSoftswitch;
        updatedList = [...updatedList, list];
        return;
      }
      if (
        li.alarm_config_id === li.alarmDetailNCEGpon?.alarm_filter_config_id
      ) {
        const list = {
          ...li,
          alarm_detail: li.alarmDetailNCEGpon,
        };
        delete list.alarmDetailObservium;
        delete list.alarmDetailNce;
        delete list.alarmDetailNCEGpon;
        delete list.alarmDetailNokiaTxn;
        delete list.alarmDetailLdiSoftswitch;
        updatedList = [...updatedList, list];
        return;
      }
      if (
        li.alarm_config_id === li.alarmDetailObservium?.alarm_filter_config_id
      ) {
        const list = {
          ...li,
          alarm_detail: li.alarmDetailObservium,
        };
        delete list.alarmDetailObservium;
        delete list.alarmDetailNce;
        delete list.alarmDetailNCEGpon;
        delete list.alarmDetailNokiaTxn;
        delete list.alarmDetailLdiSoftswitch;
        updatedList = [...updatedList, list];
        return;
      }
      if (
        li.alarm_config_id === li.alarmDetailNokiaTxn?.alarm_filter_config_id
      ) {
        const list = {
          ...li,
          alarm_detail: li.alarmDetailNokiaTxn,
        };
        delete list.alarmDetailObservium;
        delete list.alarmDetailNce;
        delete list.alarmDetailNCEGpon;
        delete list.alarmDetailNokiaTxn;
        delete list.alarmDetailLdiSoftswitch;
        updatedList = [...updatedList, list];
        return;
      }

      if (
        li.alarm_config_id ===
        li.alarmDetailLdiSoftswitch?.alarm_filter_config_id
      ) {
        const list = {
          ...li,
          alarm_detail: li.alarmDetailLdiSoftswitch,
        };
        delete list.alarmDetailObservium;
        delete list.alarmDetailNce;
        delete list.alarmDetailNCEGpon;
        delete list.alarmDetailNokiaTxn;
        delete list.alarmDetailLdiSoftswitch;
        updatedList = [...updatedList, list];
        return;
      }

      if (
        li.alarm_config_id !== li.alarmDetailNce?.alarm_filter_config_id &&
        li.alarm_config_id !==
          li.alarmDetailObservium?.alarm_filter_config_id &&
        li.alarm_config_id !== li.alarmDetailNCEGpon?.alarm_filter_config_id &&
        li.alarm_config_id !== li.alarmDetailNokiaTxn?.alarm_filter_config_id
      ) {
        const list = {
          ...li,
          alarm_detail: null,
        };
        delete list.alarmDetailObservium;
        delete list.alarmDetailNce;
        delete list.alarmDetailNCEGpon;
        delete list.alarmDetailLdiSoftswitch;
        updatedList = [...updatedList, list];
        return;
      }
    });
    const limit = take;
    const page = skip / take + 1;
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page + 1 > totalPages ? false : true;
    const hasPrevPage = page - 1 < 1 ? false : true;
    return {
      total,
      totalPages,
      hasNextPage,
      hasPrevPage,
      list: updatedList,
    };
  }

  async generateReport(queryParam: ReportModel, user: FetchUserModel) {
    let skip: number = null;
    let take: number = null;
    const {
      fromDate,
      toDate,
      appType = null,
      status,
      category,
      subDepartment,
      medium,
      search,
      ticketGenerationType,
      resolveBySubDepartment,
      rcaSubmitted,
      networkType,
      
    } = queryParam;
    if (queryParam.limit && queryParam.page) {
      const calculatedPagination: PaginationCalculatedModel =
        this.helperFunctions.calculatePagination(queryParam);
      //const { skip, take } = calculatedPagination;
      skip = calculatedPagination.skip;
      take = calculatedPagination.take;
    }
    const permissionConditions = await this.filterDepartmentsRawSql(user);
    //    dm.label AS medium,
    //   t.network_type,
    //   tc.name as ticket_category,
    //   ts.name as ticket_sub_category,

    //  DATE_FORMAT(t.resolved_Date_Time,'%Y-%m-%d:%H:%i:%s') AS resolved_date,

    //  uc.full_name AS created_by,
    //  case
    //   when t.trouble_ticket_sub_category_id IS not null then CONCAT(t.total_tat," ",ts.tat_uom )
    //   when t.trouble_ticket_sub_category_id IS NULL  then CONCAT(t.total_tat," ",tc.tat_uom )
    //  END  AS turn_out_time,

    //  t.completed_time AS completed_duration_in_min,
    //  TIMESTAMPDIFF(MINUTE,t.created_at, t.completed_Date_Time) AS total_escalate_time_in_min,

    //  t.rca_start_time,
    //  t.rca_end_time,
    //  t.rca_reason,
    //  t.corrective_action,
    //  t.preventive_step

    let queryBuilder = `SELECT 
    distinct t.ticket_number,
    di.label AS status,
    tc.name as ticket_category,
    ts.name as ticket_sub_category,
    CASE 
        WHEN nc.native_probable_cause IS NOT NULL THEN nc.native_probable_cause    
        WHEN ob.device_hostname IS NOT NULL THEN ob.alert_message
        WHEN gp.native_probable_cause  IS NOT NULL THEN gp.native_probable_cause
        WHEN nt.alarm_name IS NOT NULL THEN nt.alarm_name
        WHEN ldiAlarm.alarm_filter_config_id IS NOT NULL THEN alarmConfig.alarm_name
    END AS alarm_name,
     CASE 
        WHEN nc.probable_cause IS NOT NULL THEN nc.ne_name    
        WHEN ob.device_hostname IS NOT NULL THEN  CONCAT(ob.device_hostname,ob.entity_description)
        WHEN gp.ne_name  IS NOT NULL THEN gp.ne_name
        WHEN nt.ne_name IS NOT NULL THEN nt.ne_name
        WHEN ldiAlarm.alarm_filter_config_id IS NOT NULL THEN ldiAlarm.trunk_group
    END AS device_name,
    s.name AS assigned_to_dept,
    DATE_FORMAT(t.created_at,'%Y-%m-%d:%H:%i:%s') AS ticket_open_date,
    DATE_FORMAT(t.completed_Date_Time,'%Y-%m-%d:%H:%i:%s') AS completed_date,
    case
		  when t.resolved_Date_Time <= t.tat_end_time then 'NO'
      when t.completed_Date_Time <= t.tat_end_time then 'NO'
      when t.resolved_Date_Time is NULL AND CURRENT_TIMESTAMP < t.tat_end_time then 'NO'
      when t.resolved_Date_Time >= t.tat_end_time then 'YES'
      when t.resolved_Date_Time is NULL AND CURRENT_TIMESTAMP > t.tat_end_time then 'YES'
      when t.completed_Date_Time > t.tat_end_time then 'YES' 
	 END AS TAT,

    case
		  when t.resolved_Date_Time <= t.tat_end_time then null
      when t.completed_Date_Time <= t.tat_end_time then null
    when t.resolved_Date_Time >= t.tat_end_time then TIMEDIFF(CURRENT_TIMESTAMP , t.tat_end_time)
    when t.resolved_Date_Time is NULL AND CURRENT_TIMESTAMP > t.tat_end_time then TIMEDIFF(CURRENT_TIMESTAMP , t.tat_end_time)
    when t.completed_Date_Time > t.tat_end_time then TIMEDIFF(CURRENT_TIMESTAMP , t.tat_end_time) 
	 END AS tat_exceed_time,
   t.resolved_time AS resolved_duration_in_min,
   FLOOR(t.total_pause_duration_in_sec/60) AS pause_time_in_min,
   rs.name AS resolved_by_sub_department,
   t.rca_start_time,
   t.rca_end_time,
   t.rca_reason,
   CASE
   when (t.rca_submitted = true AND t.is_rca_awaited = false) OR (t.is_rca_awaited=false) then "NO"
   when (t.rca_submitted = false AND t.is_rca_awaited = true) OR (t.is_rca_awaited=true) then  "YES"
   END AS RCA_Awaited,
   Case
   when t.rca_submitted = true then "YES"
   when (t.rca_submitted is NULL OR t.rca_submitted=false) then "NO"
   END AS rca_submitted


FROM 
    trouble_ticket t
LEFT JOIN 
    drop_down_item di ON t.status = di.id
LEFT JOIN 
    drop_down_item dm ON t.medium = dm.id
LEFT JOIN 
    trouble_ticket_category tc ON t.trouble_ticket_category_id = tc.id
LEFT JOIN  
    trouble_ticket_category ts ON t.trouble_ticket_sub_category_id = ts.id
LEFT JOIN 
    sub_department s ON t.sub_department_id = s.id
LEFT JOIN 
    nce_alarm nc ON t.alarm_id = nc.id AND t.alarm_config_id = nc.alarm_filter_config_id
LEFT JOIN 
    observium_alert ob ON t.alarm_id = ob.id AND t.alarm_config_id = ob.alarm_filter_config_id

LEFT JOIN 
    nce_gpon_alarm gp ON t.alarm_id = gp.id AND t.alarm_config_id = gp.alarm_filter_config_id
    
LEFT JOIN 
    nokia_txn_alarm nt ON t.alarm_id = nt.id AND t.alarm_config_id = nt.alarm_filter_config_id     
LEFT JOIN ldi_softswitch_ems_alarm ldiAlarm ON t.alarm_id = ldiAlarm.id AND t.alarm_config_id = ldiAlarm.alarm_filter_config_id
LEFT JOIN alarm_filter_config alarmConfig ON t.alarm_config_id = alarmConfig.id
LEFT JOIN 
     user uc ON t.created_by = uc.id
     
LEFT JOIN  sub_department rs ON  t.resolved_by_sub_department = rs.id

${permissionConditions}
	  
AND  DATE_FORMAT(t.created_at,'%Y-%m-%d %H:%i:%s') BETWEEN DATE_FORMAT('${fromDate}','%Y-%m-%d %H:%i:%s') AND DATE_FORMAT('${toDate}','%Y-%m-%d %H:%i:%s')
`;

    let countQueryBuilder = `
    select count(t.id) as total 
    FROM 
    trouble_ticket t
LEFT JOIN 
    drop_down_item di ON t.status = di.id
LEFT JOIN 
    drop_down_item dm ON t.medium = dm.id
LEFT JOIN 
    trouble_ticket_category tc ON t.trouble_ticket_category_id = tc.id
LEFT JOIN  
    trouble_ticket_category ts ON t.trouble_ticket_sub_category_id = ts.id
LEFT JOIN 
    sub_department s ON t.sub_department_id = s.id
LEFT JOIN 
    nce_alarm nc ON t.alarm_id = nc.id AND t.alarm_config_id = nc.alarm_filter_config_id
LEFT JOIN 
    observium_alert ob ON t.alarm_id = ob.id AND t.alarm_config_id = ob.alarm_filter_config_id
LEFT JOIN 
     user uc ON t.created_by = uc.id
     
LEFT JOIN  sub_department rs ON  t.resolved_by_sub_department = rs.id
LEFT JOIN 
    nce_gpon_alarm gp ON t.alarm_id = gp.id AND t.alarm_config_id = gp.alarm_filter_config_id
LEFT JOIN 
    nokia_txn_alarm nt ON t.alarm_id = nt.id AND t.alarm_config_id = nt.alarm_filter_config_id      
${permissionConditions}	  
AND  DATE_FORMAT(t.created_at,'%Y-%m-%d %H:%i:%s') BETWEEN DATE_FORMAT('${fromDate}','%Y-%m-%d %H:%i:%s') AND DATE_FORMAT('${toDate}','%Y-%m-%d %H:%i:%s')
    `;

    if (appType) {
      queryBuilder += `AND( t.app_type = '${appType}')`;
      countQueryBuilder += `AND( t.app_type = '${appType}')`;
    }

    if (networkType) {
      queryBuilder += `AND( t.network_type = '${networkType}')`;
      countQueryBuilder += `AND( t.network_type = '${networkType}')`;
    }

    if (status) {
      queryBuilder += `AND( t.status = '${status}')`;
      countQueryBuilder += `AND( t.status = '${status}')`;
    }

    if (category) {
      queryBuilder += `AND( t.trouble_ticket_category_id = '${category}')`;
      countQueryBuilder += `AND( t.trouble_ticket_category_id = '${category}')`;
    }

    if (subDepartment) {
      queryBuilder += `AND( t.sub_department_id = '${subDepartment}')`;
      countQueryBuilder += `AND( t.sub_department_id = '${subDepartment}')`;
    }

    if (medium) {
      queryBuilder += `AND( t.medium = '${medium}')`;
      countQueryBuilder += `AND( t.medium = '${medium}')`;
    }
    if (ticketGenerationType) {
      queryBuilder += `AND( t.ticket_generation_type = '${ticketGenerationType}')`;
      countQueryBuilder += `AND( t.ticket_generation_type = '${ticketGenerationType}')`;
    }

    if (resolveBySubDepartment) {
      queryBuilder += `AND( rs.id = '${resolveBySubDepartment}')`;
      countQueryBuilder += `AND( rs.id = '${resolveBySubDepartment}')`;
    }
    if (rcaSubmitted) {
      queryBuilder += `AND( t.rca_submitted = '${rcaSubmitted}')`;
      countQueryBuilder += `AND( t.rca_submitted = '${rcaSubmitted}')`;
    }
    if (search) {
      const searchCondition = `(t.ticket_number LIKE '%${search}%' OR
                           t.case_title LIKE '%${search}%' OR
                           status LIKE '%${search}%' OR
                           (nc.probable_cause IS NOT NULL AND nc.native_probable_cause LIKE '%${search}%') OR
                           (ob.device_hostname IS NOT NULL AND ob.alert_message LIKE '%${search}%') OR
                           (nc.probable_cause IS NOT NULL AND nc.ne_name LIKE '%${search}%') OR
                           (ob.device_hostname IS NOT NULL AND CONCAT(ob.device_hostname, ob.entity_description) LIKE '%${search}%') OR
                           dm.label LIKE '%${search}%' OR
                           t.network_type LIKE '%${search}%' OR
                           tc.name LIKE '%${search}%' OR
                           ts.name LIKE '%${search}%' OR
                           s.name LIKE '%${search}%' OR
                           DATE_FORMAT(t.created_at,'%Y-%m-%d:%H:%i:%s') LIKE '%${search}%' OR
                           DATE_FORMAT(t.resolved_Date_Time,'%Y-%m-%d:%H:%i:%s') LIKE '%${search}%' OR
                           DATE_FORMAT(t.completed_Date_Time,'%Y-%m-%d:%H:%i:%s') LIKE '%${search}%' OR
                           rs.name LIKE '%${search}%' OR
                           uc.full_name LIKE '%${search}%' OR
                           t.total_tat LIKE '%${search}%' OR
                           t.app_type LIKE '%${search}%' OR
                           di.label LIKE '%${search}%' OR
                           t.trouble_ticket_category_id LIKE '%${search}%' OR
                           t.sub_department_id LIKE '%${search}%' OR
                           t.medium LIKE '%${search}%' OR
                           t.is_rca_awaited LIKE '%${search}%' OR
                           t.rca_submitted LIKE '%${search}%' OR
                           t.rca_start_time LIKE '%${search}%' OR
                           t.rca_end_time LIKE '%${search}%' OR
                           t.rca_reason LIKE '%${search}%' OR
                           t.corrective_action LIKE '%${search}%' OR
                           t.preventive_step LIKE '%${search}%'
                           )`;

      queryBuilder += ` AND ${searchCondition}`;
      countQueryBuilder += ` AND ${searchCondition}`;
    }

    //ADD LIMITS
    if (skip !== null && take !== null) {
      queryBuilder += `
    LIMIT ${take}
    OFFSET ${skip}`;
      const query = await this.dataSource.query(`${queryBuilder}`);
      const count = await this.dataSource.query(`${countQueryBuilder}`);
      const total = count[0].total;
      const limit = take;
      const page = skip / take + 1;
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page + 1 > totalPages ? false : true;
      const hasPrevPage = page - 1 < 1 ? false : true;
      return {
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
        list: query,
      };
    }

    const query = await this.dataSource.query(queryBuilder);
    return query;
  }

  async getStats(user: FetchUserModel) {
    const queryBuilder = await this.troubleTicketRepository.createQueryBuilder(
      'troubleTicketTable',
    );
    queryBuilder
      .select('COUNT(DISTINCT(troubleTicketTable.ticket_number))', 'count')
      .addSelect('d.label', 'label')
      .addSelect('d.id', 'id')
      .leftJoin('drop_down_item', 'd', 'd.id = troubleTicketTable.status')
      .groupBy('d.id')
      .orderBy('d.sequence', 'ASC');
    await this.filterDepartments(queryBuilder, user);

    const data = await queryBuilder.getRawMany();
    return data;
  }

  async initialConditionTrends(
    param: { from_date: string; to_date: string },
    user: FetchUserModel,
  ) {
    const { from_date, to_date } = param;

    const queryBuilder =
      this.troubleTicketRepository.createQueryBuilder('troubleTicketTable');
    if (from_date && to_date) {
      queryBuilder.where(
        'DATE_FORMAT(troubleTicketTable.created_at, "%Y-%m-%d") BETWEEN :from_date AND :to_date',
        { from_date, to_date },
      );
    }

    await this.filterDepartments(queryBuilder, user);
    return queryBuilder;
  }

  async getTroubleTicketTrendsByAlarms(
    query: GetTroubleTicketDashboardModel,
    user: FetchUserModel,
  ) {
    const queryBuilder = await this.initialConditionTrends(query, user);
    queryBuilder
      .select(['COUNT(DISTINCT(troubleTicketTable.id)) count'])
      .addSelect('af.alarm_name', 'alarm_name')
      .leftJoin(
        AlarmFilterConfig,
        'af',
        'troubleTicketTable.alarm_config_id = af.id',
      )
      // .andWhere('troubleTicketTable.app_type = :appType', {
      //   appType: `${query.type}`,
      // })
      .groupBy('af.alarm_name');

    return queryBuilder.getRawMany();
  }

  // async getTroubleTicketTrendsByDevices(
  //   query: GetTroubleTicketDashboardModel,
  //   user: FetchUserModel,
  // ) {
  //   const permissionConditions = await this.filterDepartmentsRawSql(user);
  //   const queryBuilder = await this.troubleTicketRepository.query(`
  //       SELECT oa.device_sysname AS device_name, COUNT((oa.device_id)) AS  device_count
  //       FROM trouble_ticket t
  //       LEFT JOIN observium_alert oa ON oa.id = t.alarm_id
  //       LEFT JOIN observium_device od ON od.device_id = oa.device_id
  //       ${permissionConditions}
  //       AND t.app_type = "${query.type}" AND oa.device_sysname IS NOT null AND (DATE_FORMAT(t.created_at, "%Y-%m-%d") BETWEEN DATE_FORMAT("${query.from_date}", "%Y-%m-%d") AND DATE_FORMAT("${query.to_date}", "%Y-%m-%d"))
  //       GROUP BY oa.device_id

  //       UNION

  //      SELECT na.ne_name AS device_name, COUNT((na.ne_name)) AS device_count
  //      FROM  trouble_ticket t
  //      LEFT JOIN nce_alarm na ON na.id = t.alarm_id
  //      ${permissionConditions}
  //      AND t.app_type = "${query.type}" AND na.ne_name IS NOT null AND (DATE_FORMAT(t.created_at, "%Y-%m-%d") BETWEEN DATE_FORMAT("${query.from_date}", "%Y-%m-%d") AND DATE_FORMAT("${query.to_date}", "%Y-%m-%d"))
  //      GROUP BY na.ne_name
  //     `);

  //   return queryBuilder;
  // }

  async getTroubleTicketTrendsByStatus(
    query: GetTroubleTicketDashboardModel,
    user,
  ) {
    const queryBuilder = await this.initialConditionTrends(query, user);
    queryBuilder
      .select(['COUNT(DISTINCT(troubleTicketTable.id)) count'])
      .addSelect('d.label', 'status')
      .leftJoin(DropDownItem, 'd', 'd.id = troubleTicketTable.status')
      // .andWhere('troubleTicketTable.app_type = :appType', {
      //   appType: `${query.type}`,
      // })
      .andWhere('troubleTicketTable.status != :cancelStatus', {
        cancelStatus: DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.CANCELLED,
      })
      .groupBy('troubleTicketTable.status');

    const q = await queryBuilder.getRawMany();
    return q;
  }

  async getTroubleTicketTrendsByRegion(
    query: GetTroubleTicketDashboardModel,
    user,
  ) {
    const queryBuilder = await this.initialConditionTrends(query, user);
    queryBuilder
      .select(['COUNT(DISTINCT(troubleTicketTable.region_id)) count'])
      .addSelect('d.name', 'name')
      .leftJoin(Region, 'd', 'd.id = troubleTicketTable.region_id')
      // .andWhere('troubleTicketTable.app_type = :appType', {
      //   appType: `${query.type}`,
      // })
      .andWhere('d.name is not null')
      .groupBy('troubleTicketTable.region_id');

    const q = await queryBuilder.getRawMany();
    return q;
  }

  async getTicketBySubDepartment(query: GetTroubleTicketDashboardModel, user) {
    //const queryBuilder = await this.initialConditionTrends(query, user);
    const queryBuilder =
      this.troubleTicketRepository.createQueryBuilder('troubleTicketTable');
    queryBuilder
      .select('COUNT(Distinct(troubleTicketTable.id))', 'count')
      .addSelect('s.name', 'name')
      .leftJoin(
        SubDepartment,
        's',
        's.id = troubleTicketTable.sub_department_id',
      )
      .andWhere('troubleTicketTable.status != :status', {
        status: DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.CANCELLED,
      })
      .groupBy('troubleTicketTable.sub_department_id');

    const q = await queryBuilder.getRawMany();
    return q;
  }

  async getTicketByNetwork(query: GetTroubleTicketDashboardModel, user) {
    const queryBuilder = await this.initialConditionTrends(query, user);
    queryBuilder
      .select('COUNT(Distinct(troubleTicketTable.id))', 'count')
      .addSelect('troubleTicketTable.network_type', 'name')

      .andWhere('troubleTicketTable.status != :status', {
        status: DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.CANCELLED,
      })
      .groupBy('troubleTicketTable.network_type');

    const q = await queryBuilder.getRawMany();
    return q;
  }

  async getTicketByCategory(query: GetTroubleTicketDashboardModel, user) {
    const queryBuilder = await this.initialConditionTrends(query, user);
    queryBuilder
      .select('COUNT(Distinct(troubleTicketTable.id))', 'count')
      .addSelect('c.name', 'name')
      .leftJoin(
        TroubleTicketCategory,
        'c',
        'c.id = troubleTicketTable.trouble_ticket_category_id',
      )
      .andWhere('troubleTicketTable.status != :status', {
        status: DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.CANCELLED,
      })
      .groupBy('troubleTicketTable.trouble_ticket_category_id');

    const q = await queryBuilder.getRawMany();
    return q;
  }

  async getTicketByPriority(query: GetTroubleTicketDashboardModel, user) {
    const queryBuilder = await this.initialConditionTrends(query, user);
    queryBuilder
      .select('COUNT(DISTINCT(troubleTicketTable.id))', 'count')
      .addSelect('d.label', 'name')
      .leftJoin(DropDownItem, 'd', 'd.id = troubleTicketTable.priority_level')
      .andWhere('troubleTicketTable.status != :status', {
        status: DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.CANCELLED,
      })
      .groupBy('troubleTicketTable.priority_level');

    const q = await queryBuilder.getRawMany();
    return q;
  }

  async getRegions(ticketId: number) {
    const queryBuilder = await this.troubleTicketRepository.query(`
    SELECT  od.region_id AS regionId
    FROM observium_alert oa
    LEFT JOIN observium_device od ON od.device_id = oa.device_id
    WHERE oa.id = '${ticketId}'
    UNION 
    SELECT ne.region_id AS regionId
    FROM nce_alarm nc
    LEFT JOIN nce_network_element ne ON nc.ne_resource_id = ne.resource_id
    WHERE nc.id= '${ticketId}'
    `);
    return queryBuilder[0];
  }

  async findTicketByCircuitId(circuitId: number, alarmConfigId: number) {
    return this.troubleTicketRepository
      .createQueryBuilder('t')
      .leftJoinAndSelect('t.alarmDetailObservium', 'oa')
      .andWhere('oa.nms_circuit_id = :circuitId', { circuitId })
      .andWhere('oa.alarm_filter_config_id =:alarmConfigId', {
        alarmConfigId,
      })
      .andWhere(
        't.status != :status  AND t.status != :cancelledStatus AND t.status !=:completedStatus',
        {
          status: `${DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.RESOLVED}`,
          cancelledStatus: `${DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.CANCELLED}`,
          completedStatus: `${DROPDOWN_ITEM_IDS.TROUBLE_TICKET_STATUS.COMPLETED}`,
        },
      )
      .andWhere('t.alarm_config_id =:alarmConfigId', { alarmConfigId })
      .getOne();
  }

  async getTroubleTicketAlarm(id: number) {
    return this.troubleTicketRepository.createQueryBuilder(`
        SELECT t.id 
        FROM trouble_ticket t
        LEFT JOIN observium_alert oa ON oa.id = t.alarm_id
        WHERE t.status!= 35 AND t.status != 39 AND t.alarm_id='${id}'
        UNION
        SELECT t.id 
        FROM trouble_ticket t
        LEFT JOIN nce_alarm ne ON ne.id = t.alarm_id
        WHERE t.status!= 35 AND t.status != 39 AND t.alarm_id = '${id}'
      `);
  }

  async filterDepartments(queryBuilder, user: FetchUserModel) {
    const userRegion = user.regions?.map((region) => region.id);
    const viewAllPermission = user.checkPermission(
      APP_PERMISSIONS.TROUBLE_TICKET.VIEW_ALL,
    );
    if (!viewAllPermission) {
      const permission = [
        'assignedUser.to_sub_department_id=:subDepartment',
        'assignedUser.from_sub_department_id=:subDepartment',
        'tCreated.sub_department_id=:subDepartment',
        'troubleTicketTable.sub_department_id=:subDepartment',
      ];
      queryBuilder
        .leftJoin('troubleTicketTable.assignedLog', 'assignedUser')
        .leftJoin('troubleTicketTable.createdByUser', 'tCreated')
        .andWhere(
          new Brackets((searchBrackets) => {
            const updatedSearchCondtion = [...permission];
            if (updatedSearchCondtion.length > 0) {
              searchBrackets.where(updatedSearchCondtion.join(' OR '), {
                subDepartment: user.sub_department_id,
              });
            }
          }),
        );
    }

    //handle region permissions

    const regionPermission = [
      'troubleTicketTable.region_id IN (:...regionId)',
      '(troubleTicketTable.region_id IS NULL)',
    ];

    queryBuilder.andWhere(
      new Brackets((searchBrackets) => {
        const updatedSearchCondtion = [...regionPermission];
        if (updatedSearchCondtion.length > 0) {
          searchBrackets.where(updatedSearchCondtion.join(' OR '), {
            regionId: userRegion,
          });
        }
      }),
    );
  }

  async filterDepartmentsRawSql(user: FetchUserModel) {
    const userRegion = user.regions?.map((region) => region.id);
    const regionIds = userRegion.length > 0 ? userRegion.join(',') : 'NULL';

    // check view all permission
    const viewAllPermission = user.checkPermission(
      APP_PERMISSIONS.TROUBLE_TICKET.VIEW_ALL,
    );

    let permissionString = ``;
    if (!viewAllPermission) {
      permissionString = `
      LEFT JOIN  trouble_ticket_assigned troubleTicketAssigned ON  troubleTicketAssigned.trouble_ticket_id=t.id
      LEFT JOIN user u ON u.id = t.created_by
    

      WHERE (troubleTicketAssigned.from_sub_department_id = ${user.sub_department_id}
      OR troubleTicketAssigned.to_sub_department_id=${user.sub_department_id}
      OR u.sub_department_id=${user.sub_department_id}
      OR t.sub_department_id=${user.sub_department_id})
      AND (t.region_id IN (${regionIds}) OR t.region_id IS NULL)
      `;
    } else {
      permissionString = `
      where (t.region_id IN (${regionIds}) OR t.region_id IS NULL)
      `;
    }

    return permissionString;
  }
}
