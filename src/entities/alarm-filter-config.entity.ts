import { AppType, NetworkType, RecordStatus } from 'src/common/enums/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AlarmFilterAdvanceCondition } from './alarm-filter-advance-condition.entity';
import { AlarmRecipient } from './alarm-recipient.entity';
import { SubDepartment } from './sub-department.entity';
import { DropDownItem } from './drop-down-item.entity';
import { TroubleTicketCategory } from './trouble-ticket-catagory.entity';
import { User } from './user.entity';
import { AlarmFilterEscalationDevice } from './alarm-filter-escalation-device.entity';

@Entity()
// @Unique(['app_type', 'alarm_name', 'severity'])
export class AlarmFilterConfig {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: AppType })
  app_type: AppType;

  @Column({ type: 'varchar', length: 255 })
  alarm_name: string;

  @Column({ type: 'varchar', length: 50, nullable: false })
  severity: string;

  @Column({ type: 'boolean', default: true })
  is_regional_escalation: boolean;

  @Column({ default: 0, nullable: true })
  email_escalation_delay: number;

  @Column({ default: 0, nullable: true })
  ticket_escalation_delay: number;

  @Column({ type: 'boolean', default: false })
  is_email_escalation: boolean;

  @Column({ type: 'boolean', default: false })
  is_ticket_escalation: boolean;

  @OneToMany(
    () => AlarmFilterAdvanceCondition,
    (alarmFilterAdvanceCondition) =>
      alarmFilterAdvanceCondition.alarm_filter_config,
  )
  alarm_filter_advanced_conditions: AlarmFilterAdvanceCondition[];

  @OneToMany(
    () => AlarmRecipient,
    (alarmRecipient) => alarmRecipient.alarm_filter_config,
  )
  alarm_recipients: AlarmRecipient[];

  @Column({
    type: 'enum',
    enum: RecordStatus,
    default: RecordStatus.ACTIVE,
  })
  record_status: RecordStatus;

  @Column({ nullable: true, default: null })
  created_by: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'updated_by' })
  updatedByUser: User;
  @Column({ nullable: true, default: null })
  updated_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  /**
   * @description Helper getter for network_type against app_type
   * @returns NetworkType
   */
  getNetworkType(): NetworkType {
    switch (this.app_type) {
      case AppType.NCE: {
        return NetworkType.TRANSMISSION;
      }
      case AppType.OBSERVIUM: {
        return NetworkType.IP;
      }
      case AppType.NCE_GPON: {
        return NetworkType.GPON;
      }
      case AppType.NOKIA_TXN: {
        return NetworkType.NOKIA_TXN;
      }
      case AppType.LDI_SOFTSWITCH_EMS: {
        return NetworkType.LDI_SOFTSWITCH_EMS;
      }
    }
  }

  get networkType(): NetworkType {
    return this.getNetworkType();
  }

  @ManyToOne(() => SubDepartment, (subDepartment) => subDepartment.id)
  @JoinColumn({ name: 'ticket_escalation_initial_sub_department' })
  ticketEscalationInitialSubdepartment: SubDepartment;
  @Column({ nullable: true })
  ticket_escalation_initial_sub_department: number;

  @ManyToOne(() => DropDownItem, (dropDownItem) => dropDownItem.id)
  @JoinColumn({ name: 'ticket_escalation_medium' })
  ticketEscalationMedium: DropDownItem;
  @Column({ nullable: true })
  ticket_escalation_medium: number;

  @Column({ nullable: true })
  can_revert_ticket_on_alarm_recovery: boolean;
  @ManyToOne(
    () => TroubleTicketCategory,
    (troubleTicketCategory) => troubleTicketCategory.id,
  )
  @JoinColumn({ name: 'ticket_escalation_category' })
  ticketEscalationCategory: TroubleTicketCategory;
  @Column({ nullable: true })
  ticket_escalation_category: number;

  @Column({ type: 'boolean', default: false })
  is_change_in_display_severity: boolean;

  @Column({ type: 'varchar', default: null })
  conditional_severity: string;

  @Column({ type: 'varchar', default: null })
  severity_to_be_displayed: string;

  @ManyToOne(
    () => TroubleTicketCategory,
    (troubleTicketCategory) => troubleTicketCategory.id,
  )
  @JoinColumn({ name: 'ticket_escalation_sub_category' })
  ticketEscalationSubCategory: TroubleTicketCategory;
  @Column({ nullable: true })
  ticket_escalation_sub_category: number;

  @OneToMany(
    () => AlarmFilterEscalationDevice,
    (AlarmFilterEscalationDevice) =>
      AlarmFilterEscalationDevice.alarmFilterConfig,
  )
  escalationTicketDevices: AlarmFilterEscalationDevice[];

  @Column({ type: 'varchar', default: null })
  description: string;
}
