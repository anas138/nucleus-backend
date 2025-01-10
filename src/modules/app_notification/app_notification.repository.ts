import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Repository } from 'typeorm';
import { AppNotification } from 'src/entities/app-notification.entity';

@Injectable()
export class AppNotificationRepository extends BaseAbstractRepository<AppNotification> {
  constructor(
    @InjectRepository(AppNotification)
    private repo: Repository<AppNotification>,
  ) {
    super(repo);
  }

  async findNotifications(user) {
    const limit = 50;
    const offset = 0;
    // `SELECT * FROM app_notification ap
    //      LEFT JOIN  trouble_ticket t ON t.id=ap.related_id
    //      WHERE ap.user_id=${user.id} OR ap.sub_department_id=${user.sub_department_id} OR t.created_by =${user.id}
    // `;
    const query = await this.repo.query(`SELECT * FROM app_notification ap
         WHERE ap.user_id=${user.id}
         order by ap.id DESC
         limit ${limit}
         
    `);

    const updateQuery = {
      count: query.length,
      limit: limit,
      offset: offset,
      notifications: query,
    };
    return updateQuery;
  }

  async getUnseenMessages(user) {
    const query = await this.repo
      .query(`SELECT count(ap.id) as count FROM app_notification ap
         LEFT JOIN  trouble_ticket t ON t.id=ap.related_id
         WHERE ( ap.user_id=${user.id})
         and is_seen=false    
         
    `);
    return query[0];
  }

  async updateIsSeen(user) {
    return this.repo.update({ user_id: user.id }, { is_seen: true });
  }
}
