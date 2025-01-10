import { AlarmFilterAdvanceCondition } from './alarm-filter-advance-condition.entity';
import { AlarmFilterConfig } from './alarm-filter-config.entity';
import { AlarmRecipient } from './alarm-recipient.entity';
import { AppDashboardWidget } from './app-dashboard-widgets.entity';
import { AppDashboard } from './app-dashboard.entity';
import { City } from './city.entity';
import { Country } from './country.entity';
import { Department } from './department.entity';
import { Designation } from './designation.entity';
import { DropDownCategory } from './drop-down-category.entity';
import { DropDownItem } from './drop-down-item.entity';
import { EmailLogs } from './email-logs.entity';
import { FiltersTemplate } from './filters-template';
import { GlobalSettingsTypes } from './global-setting-types.entity';
import { GlobalSettings } from './global-settings.entity';
import { NceAlarm } from './nce-alarm.entity';
import { NceLtp } from './nce-ltp.entity';
import { NceNetworkElement } from './nce-network-element.entity';
import { NceSubnet } from './nce-subnet.entity';
import { ObserviumAlert } from './obs-alert.entity';
import { ObserviumDevice } from './obs-device.entity';
import { Permission } from './permission.entity';
import { Province } from './province.entity';
import { Region } from './region.entity';
import { Role } from './role.entity';
import { Segment } from './segment.entity';
import { SubDepartment } from './sub-department.entity';
import { UploadFileMap } from './upload-file-map.entity';
import { UploadFile } from './upload-file.entity';
import { UserSession } from './user-session.entity';
import { User } from './user.entity';
import { TroubleTicketCategory } from './trouble-ticket-catagory.entity';
import { TroubleTicketMedium } from './trouble-ticket-medium.entity';
import { TroubleTicket } from './trouble-ticket.entity';
import { TroubleTicketStatusLog } from './trouble-ticket-status-log.entity';
import { TroubleTicketAssigned } from './trouble-ticket-assigned.entity';
import { ActivityLog } from './activity-log.entity';
import { CommentLog } from './comment-log.entity';
import { AppNotification } from './app-notification.entity';
import { TroubleTicketPause } from './trouble-ticket-pause.entity';
import { AccumulatedTroubleTicket } from './accumulated-trouble-ticket.entity';
import { AuthMsToken } from './auth-ms-token.entity';
import { AlarmFilterEscalationDevice } from './alarm-filter-escalation-device.entity';
import { UserSubdepartmentMapping } from './user_subdepartment_mapping.entity';
import { NceGponNetworkElement } from './nce-gpon-network-element.entity';
import { NceGponAlarm } from './nce-gpon-alarm.entity';
import { NokiaTxnNetworkElement } from './nokia-txn-network-element.entity';
import { NokiaTxnAlarm } from './nokia-txn-alarm.entity';
import { LdiSoftswitchTrunkGroup } from './ldi-softswitch-trunk-group.entity';
import { LdiSoftswitchEmsAlarm } from './ldi-softswitch-alarm.entity';
export default [
  User,
  Permission,
  Role,
  Department,
  Designation,
  Region,
  Segment,
  SubDepartment,
  NceAlarm,
  NceNetworkElement,
  NceLtp,
  UploadFile,
  UploadFileMap,
  ObserviumAlert,
  ObserviumDevice,
  City,
  Country,
  Province,
  AlarmFilterConfig,
  AlarmFilterAdvanceCondition,
  AlarmRecipient,
  NceSubnet,
  DropDownCategory,
  DropDownItem,
  UserSession,
  FiltersTemplate,
  GlobalSettingsTypes,
  GlobalSettings,
  EmailLogs,
  AppDashboard,
  AppDashboardWidget,
  TroubleTicketCategory,
  TroubleTicketMedium,
  TroubleTicket,
  TroubleTicketStatusLog,
  TroubleTicketAssigned,
  ActivityLog,
  CommentLog,
  AppNotification,
  TroubleTicketPause,
  AccumulatedTroubleTicket,
  AuthMsToken,
  AlarmFilterEscalationDevice,
  UserSubdepartmentMapping,
  NceGponNetworkElement,
  NceGponAlarm,
  NokiaTxnNetworkElement,
  NokiaTxnAlarm,
  LdiSoftswitchTrunkGroup,
  LdiSoftswitchEmsAlarm,
];
