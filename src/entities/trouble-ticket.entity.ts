import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import {
  EscalationLevel,
  NetworkType,
  RecordStatus,
  TatUot,
} from 'src/common/enums/enums';
import { TroubleTicketCategory } from './trouble-ticket-catagory.entity';
import { AlarmFilterConfig } from './alarm-filter-config.entity';
import { DropDownItem } from './drop-down-item.entity';
import { User } from './user.entity';
import { Department } from './department.entity';
import { SubDepartment } from './sub-department.entity';
import { TroubleTicketStatusLog } from './trouble-ticket-status-log.entity';
import { TroubleTicketAssigned } from './trouble-ticket-assigned.entity';
import { ActivityLog } from './activity-log.entity';
import { CommentLog } from './comment-log.entity';
import { ObserviumAlert } from './obs-alert.entity';
import { NceAlarm } from './nce-alarm.entity';
import { UploadFileMap } from './upload-file-map.entity';
import { TroubleTicketPause } from './trouble-ticket-pause.entity';
import { Region } from './region.entity';
import { AccumulatedTroubleTicket } from './accumulated-trouble-ticket.entity';
import { NceGponAlarm } from './nce-gpon-alarm.entity';
import { NokiaTxnAlarm } from './nokia-txn-alarm.entity';
import { LdiSoftswitchEmsAlarm } from './ldi-softswitch-alarm.entity';

@Entity()
export class TroubleTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true, unique: true, default: null })
  ticket_number: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  case_title: string;

  @Column({ nullable: true })
  description: string;

  @ManyToOne(
    () => TroubleTicketCategory,
    (troubleTicketCategory) => troubleTicketCategory.id,
  )
  @JoinColumn({ name: 'trouble_ticket_category_id' })
  troubleTicketCategory: TroubleTicketCategory;
  @Column()
  trouble_ticket_category_id: number;

  @ManyToOne(
    () => TroubleTicketCategory,
    (troubleTicketCategory) => troubleTicketCategory.id,
  )
  @JoinColumn({ name: 'trouble_ticket_sub_category_id' })
  troubleTicketSubCategory: TroubleTicketCategory;
  @Column()
  trouble_ticket_sub_category_id: number;

  @ManyToOne(() => DropDownItem, (dropDownItem) => dropDownItem.id)
  @JoinColumn({ name: 'medium' })
  troubleTicketMedium: DropDownItem;
  @Column()
  medium: number;

  @ManyToOne(() => DropDownItem, (dropDownItem) => dropDownItem.id)
  @JoinColumn({ name: 'status' })
  currentStatus: DropDownItem;
  @Column({ nullable: true, default: null })
  status: number;

  @OneToMany(
    () => TroubleTicketStatusLog,
    (TroubleTicketStatusLog) => TroubleTicketStatusLog.troubleTicket,
  )
  statusLog: TroubleTicketStatusLog[];

  @OneToMany(
    () => TroubleTicketAssigned,
    (troubleTicketAssigned) => troubleTicketAssigned.troubleTicket,
  )
  assignedLog: TroubleTicketAssigned[];

  @Column({ type: 'boolean', nullable: false, default: false })
  is_assigned: boolean;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'assigned_to_id' })
  assignedToUser: User;
  @Column({ type: 'number', nullable: true, default: null })
  assigned_to_id: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'assigned_from_id' })
  assignedFromUser: User;
  @Column({ type: 'number', nullable: true, default: null })
  assigned_from_id: number;

  @Column({ type: 'enum', enum: EscalationLevel, default: null })
  esclationLevel: EscalationLevel;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'esclation_role_id' })
  esclationRole: User;
  @Column({ nullable: true, default: null })
  esclation_role_id: number;

  @ManyToOne(() => ObserviumAlert, (observiumAlert) => observiumAlert.id)
  @JoinColumn({ name: 'alarm_id' })
  alarmDetailObservium: ObserviumAlert | null;

  @ManyToOne(() => NceAlarm, (nceAlarm) => nceAlarm.id)
  @JoinColumn({ name: 'alarm_id' })
  alarmDetailNce: NceAlarm | null;

  @ManyToOne(() => NceGponAlarm, (nceGponAlarm) => nceGponAlarm.id)
  @JoinColumn({ name: 'alarm_id' })
  alarmDetailNCEGpon: NceGponAlarm | null;

  @ManyToOne(() => NokiaTxnAlarm, (nokiaTxnAlarm) => nokiaTxnAlarm.id)
  @JoinColumn({ name: 'alarm_id' })
  alarmDetailNokiaTxn: NokiaTxnAlarm | null;

  @ManyToOne(
    () => LdiSoftswitchEmsAlarm,
    (ldiSoftswitchEmsAlarm) => ldiSoftswitchEmsAlarm.id,
  )
  @JoinColumn({ name: 'alarm_id' })
  alarmDetailLdiSoftswitch: LdiSoftswitchEmsAlarm | null;

  get alarmDetails() {
    return this.alarmDetailObservium || this.alarmDetailNce;
  }

  @ManyToOne(
    () => AlarmFilterConfig,
    (alarmFilterConfig) => alarmFilterConfig.id,
  )
  @JoinColumn({ name: 'alarm_config_id' })
  alarmFilterConfig: AlarmFilterConfig;
  @Column()
  alarm_config_id: number;

  @OneToMany(
    () => UploadFileMap,
    (uploadFileMap) => uploadFileMap.troubleTicket,
    { persistence: false },
  )
  attachment: UploadFileMap[];
  @Column()
  alarm_id: number;

  @Column()
  app_type: string;

  @Column({ type: 'enum', enum: NetworkType, nullable: false })
  network_type: NetworkType;

  @Column()
  total_tat: number;

  @Column({ type: 'enum', enum: TatUot })
  tat_uom: TatUot;

  @CreateDateColumn()
  tat_start_time: Date;

  @CreateDateColumn()
  tat_end_time: Date;

  @ManyToOne(() => Department, (department) => department.id)
  @JoinColumn({ name: 'department_id' })
  department: Department;
  @Column()
  department_id: number;

  @ManyToOne(() => SubDepartment, (subDepartment) => subDepartment.id)
  @JoinColumn({ name: 'sub_department_id' })
  subDepartment: SubDepartment;
  @Column()
  sub_department_id: number;

  @OneToMany(() => ActivityLog, (activityLog) => activityLog.related_id, {
    persistence: false,
  })
  activityLog: ActivityLog[];

  @OneToMany(() => CommentLog, (commentLog) => commentLog.related_id, {
    persistence: false,
  })
  commentLog: CommentLog[];

  @Column({
    type: 'enum',
    enum: RecordStatus,
    nullable: true,
    default: RecordStatus.ACTIVE,
  })
  record_status: RecordStatus;

  @Column({ nullable: true })
  message: string;

  @Column({ nullable: true })
  message_title: string;

  @Column({ nullable: true })
  resolved_time: string;

  @Column({ nullable: true })
  completed_time: string;

  @Column({ nullable: true })
  resolved_Date_Time: Date;

  @Column({ nullable: true })
  completed_Date_Time: Date;

  @ManyToOne(() => SubDepartment, (subDepartment) => subDepartment.id)
  @JoinColumn({ name: 'resolved_by_sub_department' })
  resolveByDept: SubDepartment;

  @Column({ nullable: true })
  resolved_by_sub_department: number;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  createdByUser: User;
  @Column({ nullable: true, default: null })
  created_by: number;

  @Column({ nullable: true, default: null })
  updated_by: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => DropDownItem, (dropDownItem) => dropDownItem.id)
  @JoinColumn({ name: 'ticket_generation_type' })
  ticketGenerationType: DropDownItem;
  @Column({ nullable: false, default: 37 })
  ticket_generation_type: number;

  @Column({ default: false })
  alarm_config_can_revert: boolean;

  @Column({ nullable: true })
  alarm_config_escalation_delay: number;

  @ManyToOne(() => DropDownItem, (dropDownItem) => dropDownItem.id)
  @JoinColumn({ name: 'resolution_reason' })
  resolutionReason: DropDownItem;
  @Column({ nullable: true })
  resolution_reason: number;

  @Column({ nullable: true })
  resolution_comment: string;

  @Column({ nullable: true })
  rca_reason: string;

  @Column({ nullable: true })
  corrective_action: string;

  @Column({ nullable: true })
  preventive_step: string;

  @Column({ nullable: true })
  rca_start_time: Date;

  @Column({ nullable: true })
  rca_end_time: Date;

  @Column({ nullable: false, default: false })
  is_rca_required: boolean;

  @Column({ nullable: false, default: false })
  rca_submitted: boolean;

  @Column({ nullable: true })
  total_pause_duration_in_sec: number;

  @Column({ nullable: true })
  last_unpause_date_time: Date;

  @OneToMany(
    () => TroubleTicketPause,
    (troubleTicketPause) => troubleTicketPause.troubleTicket,
  )
  troubleTicketPause: TroubleTicketPause[];

  @ManyToOne(
    () => TroubleTicketPause,
    (troubleTicketPause) => troubleTicketPause.id,
  )
  @JoinColumn({ name: 'current_pause_id' })
  currentTicketPause: TroubleTicketPause;
  @Column()
  current_pause_id: number;

  @ManyToOne(() => DropDownItem, (DropDownItem) => DropDownItem.id)
  @JoinColumn({ name: 'cancel_reason' })
  cancelReason: DropDownItem;
  @Column({ nullable: true })
  cancel_reason: number;

  @Column({ nullable: true })
  cancel_comment: string;

  @Column({ nullable: true, default: null })
  region_id: number;

  @ManyToOne(() => Region, (region) => region.id)
  @JoinColumn({ name: 'region_id' })
  region: Region;

  @OneToMany(
    () => AccumulatedTroubleTicket,
    (accumulatedTroubleTicket) => accumulatedTroubleTicket.troubleTicket,
  )
  outageAlarms: AccumulatedTroubleTicket[];

  @Column({ nullable: false, default: false })
  is_outage_occurred: boolean;

  @ManyToOne(() => DropDownItem, (dropDownItem) => dropDownItem.id)
  @JoinColumn({ name: 'priority_level' })
  priorityLevel: DropDownItem;
  @Column({ nullable: false, default: 50 })
  priority_level: number;

  @Column({ type: 'boolean', nullable: false, default: false })
  is_rca_awaited: boolean;

  @Column({ type: 'boolean', nullable: true, default: false })
  over_tat: boolean;
}
