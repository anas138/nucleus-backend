import Bull from 'bull';

const APP_CONSTANTS = Object.freeze({
  CACHE_MANAGER: {
    KEYS: {
      NCE_TOKEN: 'nce-token',
      NCE_NE_DETAILS: 'nce-ne-details-',
      NCE_LTP_DETAILS: 'nce-ltp-details-',
      WS_USER_TOKEN: 'ws-user-token-', // ws-user-token-{userId}
      CURRENT_USER: 'current_user',
    },
    TTL: {
      DEFAULT: 60 * 60 * 168,
      // seconds
      NCE_TOKEN: 60 * 60 * 3,
    },
  },
  NCE_ALARM_RESOURCE_TYPES: {
    NE: 'NE',
    LTP: 'LTP',
  },
  WEBSOCKET_EVENTS: {
    NCE_ALARMS: 'nce-alarms',
    NCE_GPON_ALARMS: 'nce-gpon-alarms',
    NOKIA_TXN_ALARMS: 'nokia-txn-alarms',
    OBS_ALARMS: 'observium-alarms',
    LDI_SOFTSWITCH_ALARMS: 'ldi-softswitch-alarms',
    SYNC_USER_PERMISSIONS: 'sync-user-permissions',
    MESSAGE: 'message',
    REFRESH_DASHBOARD_IP: 'refresh-dashboard-ip',
    REFRESH_DASHBOARD_TRANSMISSION: 'refresh-dashboard-transmission',
    REFRESH_DASHBOARD_GPON: 'refresh-dashboard-gpon',
    REFRESH_DASHBOARD_NOKIA_TXN: 'refresh-dashboard-nokia-txn',
    REFRESH_DASHBOARD_LDI_SOFTSWITCH: 'refresh-dashboard-ldi-softswitch',
    WEBAPP_UPDATE: 'webapp-update',
  },
  WEBSOCKET_ROOMS: {
    USER_IDS_ROOM: (userId: number | string) => `user-ids-room-${userId}`,
  },
  SEARCH_CRITERIA: {
    CONTAINS: 'contains',
    INCLUDES: 'includes',
  },
  FORGOT_PASSWORD_TOKEN_TTL: 3600,
  SETUP_PASSWORD_TOKEN_TTL: 86400, // equivalent to 1 day,
  DASHBOARD_STATS_FROMAT: {
    PIE_CHART: 'pie-chart',
    BAR_CHART: 'bar-chart',
    KEY_VALUE: 'key-value',
  },
  PASSWORD_LENGTH: 8,

  troubleTicketStatus: {
    PENDING: 32,
    ASSIGNED: 33,
    RESOLVED: 34,
    COMPLETED: 35,
    RE_OPEN: 36,
  },
  TROUBLE_TICKET_ID_STATUS: {
    32: 'PENDING',
    33: 'ASSIGNED',
    34: 'RESOLVED',
    35: 'COMPLETED',
    36: 'RE_OPEN',
    39: 'CANCELLED',
    51: 'RCA Awaited',
  },
  Trouble_TICKET_MESSAGE: {
    LEAVE: (name: string) => `${name} leave the ticket.`,
    SENT_BACK: (full_name: string, ticket_number: string, groupUser: string) =>
      `${full_name} sent back ticket:${ticket_number} to ${groupUser}.`,
    STATUS_CHANGE: (
      full_name: string,
      previousStatus: string,
      updatedStatus: string,
    ) =>
      `${full_name} has changed status from ${previousStatus} to ${updatedStatus}.`,
    RETURN_BACK: (full_name: string, assignedUser: string) =>
      `${full_name} return ticket back to ${assignedUser}`,
    RETURN_BACK2: `%s return ticket back to %s`,
    ASSIGNED: (fromUser: string, ticket_number: string, toUser: string) =>
      `${fromUser} has assigned Ticket:${ticket_number} to ${toUser}.`,
    AUTOMATIC_ASSIGNED: (name: string) =>
      `Automated Trouble Ticket assigned to ${name}`,
    CREATED: (user: string) => `${user} created Ticket.`,
    AUTOMATED_CREATED: `Automated Ticket is created. `,
    UPDATE_STATUS_TITLE: `Ticket status updated`,
    ASSIGNED_MESSAGE_TITLE: `Ticket Assigned`,
    RESOLUTION_REASON: 'Resolution reason and comment is required.',
  },
  SMS: {
    FROM: 'Transworld',
    MESSAGES: {
      TROUBLE_TICKET_MESSAGE: {
        ASSIGNED_TO_SUB: (
          ticketNo: string,
          subDepartment: string,
          click_here: string,
        ) =>
          `Nucleus Alert:\nDear user Ticket: ${ticketNo} is assigned to your department(${subDepartment}).\nClick here for details=> ${click_here}.`,

        ASSIGNED_TO_USER: (ticketNo: string, click_here: string) =>
          `Nucleus \nTicket: ${ticketNo} is assigned to you. ${click_here}`,
      },
    },
  },

  TROUBLE_TICKET_TYPE: {
    MANUAL: 37,
    AUTOMATED: 38,
  },
  TYPE: {
    MANUAL: 'MANUAL',
    AUTOMATED: 'AUTOMATED',
  },

  EVENTS: {
    AFTER_INSERT: 'afterInsert',
    AFTER_UPDATE: 'afterUpdate',
  },

  EMAIL_SUBJECTS: {
    RESET_PASSWORD: 'Reset Password',
    SETUP_PASSWORD: 'Setup Password',
  },

  APP_ENVS: {
    DEV: 'dev',
    TEST: 'test',
    STAGE: 'stage',
    PROD: 'prod',
  },
});

const QUEUES = {
  TASKS_QUEUE: 'tasks-queue',
  EMAIL_QUEUE: 'email-queue',
  APP_NOTIFICATION_QUEUE: 'app-notification-queue',
  SMS_QUEUE: 'sms-queue',
  TICKET_REVERSAL: 'ticket-reversal',
  PAUSE_TICKET: 'pause_ticket',
  TROUBLE_TICKET_EVENT: 'trouble-ticket-event',
  TROUBLE_TICKET_OVER_TAT: 'trouble-ticket-over-tat',
  PROCESS: {
    TASK_QUEUE: 'task-queue-process',
    EMAIL_QUEUE: 'email-queue-process',
  },
  NCE_ALARMS_QUEUE: 'nce-alarms-queue',
  NCE_TRANSFORMED_ALARMS_QUEUE: 'nce-transformed-alarms-queue',
  NCE_GPON_TRANSFORMED_ALARMS_QUEUE: 'nce-gpon-transformed-alarms-queue',
  NOKIA_TXN_TRANSFORMED_ALARMS_QUEUE: 'nokia-txn-transformed-alarms-queue',
  OBSERVIUM_ALERTS_QUEUE: 'observium-alerts-queue',
  LDI_SOFTSWITCH_ALARM_QUEUE: 'ldi_softswitch_alarm_queue',
  OBSERVIUM_TRANSFORMED_ALERTS_QUEUE: 'observium-transformed-alerts-queue',
  COMPLETED_JOBS_LIMIT: {
    NCE_ALARMS_QUEUE: 150000,
    NCE_TRANSFORMED_ALARMS_QUEUE: 10000,
    OBSERVIUM_ALERTS_QUEUE: 150000,
    OBSERVIUM_TRANSFORMED_ALERTS_QUEUE: 10000,
  },
  RATE_LIMITER: {
    NCE_TRANSFORMED_ALARMS_QUEUE: <Bull.RateLimiter>{
      max: 30,
      duration: 5 * 1000, // seconds * 1000 => milliseconds
    },
    OBSERVIUM_TRANSFORMED_ALERTS_QUEUE: <Bull.RateLimiter>{
      max: 30,
      duration: 5 * 1000, // seconds * 1000 => milliseconds
    },
    NCE_DELAYED_ALARM_LIMIT_IN_MINS: 20, // Limit for alarm occurance time difference with current-time in Minutes | this should come from settings (aka global-settings)
    OBS_DELAYED_ALARM_LIMIT_IN_MINS: 5, // Limit for alarm occurance time difference with current-time in Minutes
    LDI_DELAYED_ALARM_LIMIT_IN_MINS: 25,
    NOKIA_DELAYED_ALARM_LIMIT_IN_MINS: 20,
  },
  ALARMS_DELAYED_ACTIONS_QUEUE: 'alarm-delayed-actions-queue',
  SYNC_DEVICES_QUEUE: 'sync-devices-queue',
};

const MICROSERVICES = {
  KAFKA: 'KAFKA_MICROSERVICES',
};
const KAFKA_TOPICS = {
  NCE_ALARMS: 'twa-nce-alarms',
  NCE_EVENTS: 'twa-nce-events',
  NUCLEUS_NCE_MAPPED_ALARMS: 'nucleus-nce-mapped-alarms',
  OBS_ALERTS: 'twa-observium-alerts',
  NCE_GPON_TRANSFORMED_ALARMS: 'nce-gpon-transformed-alarms',
  NOKIA_TXN_TRANSFORMED_ALARMS: 'nokia-txn-transformed-alarms',
  LDI_SOFT_SWITCH_TRANSFORMED_ALARMS: 'ldi-softswitch-transformed-alarms',
};

const NCE_ALARM_CATEGORY = {
  FAULT: 'fault',
  CLEAR: 'clear',
  CHANGE: 'change',
};

enum RecordStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
  DRAFT = 'DRAFT',
}

enum UserType {
  GROUP = 'GROUP',
  EMPLOYEE = 'EMPLOYEE',
  SYSTEM_USER = 'SYSTEM_USER',
}

enum GlobalSettingsValuesDatatype {
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  BOOLEAN = 'BOOLEAN',
  ARRAY = 'ARRAY',
}

enum EscalationLevel {
  L1 = 'L1',
  L2 = 'L2',
  L3 = 'L3',
}

enum TatUot {
  MINUTES = 'MINUTES',
  HOURS = 'HOURS',
}

enum MapRegionAgainstCity {
  LHR = 'CENTRAL',
  KHI = 'SOUTH',
  ISB = 'NORTH',
}

enum ActivityLog {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  RESOLVED = 'RESOLVED',
  COMPLETED = 'COMPLETED',
  ASSIGNED = 'ASSIGNED',
}

enum LdiSoftswitchTrunkGroupStatus {
  COMMERCIAL = 'Commercial',
  NOT_COMMERCIAL = 'Not commercial',
}

const ActivityMessage = {
  CREATED: (user: string) => `${user} created Ticket.`,
  AUTOMATED_CREATED: `Automated Ticket is created. `,
  UPDATE_STATUS: (
    user: string,
    previousStatus: string,
    currentStatus: string,
  ) => `${user} change status from ${previousStatus} to ${currentStatus}.`,
  ASSIGNED_USER_STATUS: (
    toUser: string,
    fromUser: string,
    ticketNumber: string,
  ) => `${fromUser} has assigned Ticket: ${ticketNumber} to ${toUser}.`,
};

const CALCULATION = {
  HOURS: 60 * 60 * 1000,
  MINUTES: 60 * 1000,
};

const APP_PERMISSIONS = {
  PUBLIC: 'public',
  USER: {
    CREATE: 'users-create',
    EDIT: 'users-edit',
    DELETE: 'users-delete',
    ACCESS: 'users-acess',
  },
  PERMISSION: {
    CREATE: 'permissions-create',
    ACCESS: 'permissions-access',
    EDIT: 'permissions-edit',
    DELETE: 'permissions-delete',
  },
  ROLE: {
    CREATE: 'role-create',
    ACCESS: 'role-access',
    DELETE: 'role-delete',
    EDIT: 'role-edit',
  },
  ROLE_PERMISSION: {
    CREATE: 'role-permission-create',
    UPDATE: 'role-permission-update',
  },
  SUBDEPARTMENT: {
    CREATE: 'subdepartment-create',
    EDIT: 'subdepartment-edit',
    ACCESS: 'subdepartment-access',
    DELETE: 'subdepartment-delete',
  },
  DEPARTMENT: {
    CREATE: 'department-create',
    EDIT: 'department-edit',
    ACCESS: 'department-access',
    DELETE: 'department-delete',
  },
  DESIGNATION: {
    CREATE: 'designation-create',
    EDIT: 'designation-edit',
    ACCESS: 'designation-access',
    DELETE: 'designation-delete',
  },
  OBSERVIUM: {
    ALARMS: 'ip-alarms',
    DEVICES: 'ip-devices',
    NETWORK: 'ip-network',
    DEVICESSYNC: 'ip-devicesSync',
  },
  NCE: {
    NETWORK: 'tx-network',
    ALARMS: 'tx-alarms',
    DEVICES: 'tx-devices',
    DEVICESSYNC: 'tx-devicesSync',
  },
  TROUBLE_TICKET: {
    create: 'troubleTicket-create',
    ACCESS: 'troubleTicket-access',
    VIEW_ALL: 'troubleTicket-viewAllTickets',
    Bulk_Update: 'troubleTicket-bulkUpdate',
  },

  TICKET_PRIORITY_NOTIFICATIONS: {
    P1_TICKETS: 'P1Tickets',
    P2_TICKETS: 'P2Tickets',
    P3_TICKETS: 'P3Tickets',
  },
};
const APP_MESSAGES = {
  User: {
    ERROR_USER_NOT_FOUND: 'User not found.',
    ERROR_DUPLICATE_USERNAME: 'User with same username already exists.',
    ERROR_INVALID_EMAIL: 'Invalid email address.',
    ERROR_INVALID_PASSWORD: 'Invalid password.',
    ERROR_PASSWORD_TOO_WEAK: 'password is too weak.',
    ERROR_USER_DEPARTMENT_NOT_FOUND: 'No department found against this user.',
    ERROR_USER_UNAUTHORIZED: 'Unauthorized, Please authenticate.',
    ERROR_USER_DUPLICATE_EMAIL: 'User with same email already exists.',
    GROUP_USER_LOGIN_NOT_ALLOWED: 'Group user is not allowed to login.',
    GROUP_USER_DOES_NOT_EXISTS: (subDepartment: string) =>
      `Group email user for the selected subdepartment ${subDepartment} does not exist in the system. Please contact Enterprise Solutions Support for assistance.`,

    USER_CREATED: 'User created successfully.',
    USER_UPDATED: 'User updated successfully.',
    DELETED: 'User deleted successfully.',
    PASSWORD_CHANGED: 'password changes successfully.',
    FETCHED_ALL: 'Users fetched successfully.',
    FETCHED: 'User fetched succesfully.',
    LOGOUT: 'User logged out successfully.',
    USER_STATUS_UPDATED: 'User status updated successfully',
  },
  UserPermission: {
    ERROR_PERMISSIONS_NOT_FOUND: 'No Permission found.',
    ERROR_PERMISSIONS_ATTACHED_WITH_ROLE:
      'Cannot update these permissions since these are attached with roles.',

    UPDATED: 'User Permissions are updated successfully.',
    CREATED: 'User Permission created successfully.',
    DELETED: 'User Permission deleted successfully.',
    FETCHED_ALL: 'User Permissions fetched succesfully.',
    FETCHED_REMAINING_PERMISSIONS:
      'User remaining Permissions fetched succesfully.',
  },
  UserRole: {
    ERROR_ROLE_NOT_FOUND: 'No roles exist against this user.',

    UPDATED: 'User Roles are updated successfully.',
    CREATED: 'User Role created successfully.',
    DELETED: 'User Role deleted successfully.',
    FETCHED_ALL: 'User Roles fetched succesfully.',
  },
  Role: {
    ERROR_ROLE_NOT_FOUND: 'Role not found.',
    ERROR_DUPLICATE_ROLE_NAME: 'Role already exist.',
    ERROR_INVALID_ROLE: 'Invalid role.',
    ERROR_SOME_ROLES_NOT_FOUND: 'Some roles dont exist.',
    ERROR_DELETED: 'This role is associated with users.',

    FETCHED_ALL: 'Roles fetched succesfully.',
    CREATED: 'Role created successfully.',
    DELETED: 'Role deleted successfully.',
    UPDATED: 'Role updated successfully',
  },
  Permission: {
    ERROR_PERMISSION_NOT_FOUND: 'Permission not found.',
    ERROR_DUPLICATE_PERMISSION_NAME: 'Permission already exist.',
    ERROR_INVALID_ROLE: 'Invalid role.',
    ERROR_SOME_PERMISSIONS_NOT_FOUND: 'Some permissions dont exist.',
    ERROR_DELETED: 'This permission is associated with users.',

    DELETED: 'Permission deleted successfully.',
  },
  RolePermission: {
    ERROR_SOME_PERMISSIONS_NOT_FOUND: 'Some permissions dont exist.',

    FETCHED_ALL: 'Role Permissions are fetched succesfully.',
    UPDATED: 'Role Permissions are updated successfully.',
  },
  NCE_NMS: {
    NETWORK_ELEMENTS_SYNCHORNIZED:
      'NCE Network Elements synchornized successfully.',
    LTPS_SYNCHORNIZED: 'NCE LTPs synchornized successfully.',
    SUBNETS_SYNCHRONIZED: 'NCE Subnets synchronized successfully.',
  },
  DEPARTMENT: {
    ERROR_DEPARTMENT_NOT_FOUND: 'Department not found.',
    ERROR_DELETE_USER_EXIST:
      'Cannot delete department since users are associated with it.',
    ERROR_DELETE_SUB_DEPARTMENT_EXIST:
      'Cannot delete department since sub Departments are associated with it.',
    ERROR_DELETED: 'This department is associated with other entities.',

    DELETED: 'Department deleted successfully.',
    CREATED: 'Department created successfully.',
  },
  SUB_DEPARTMENT: {
    ERROR_SUB_DEPARTMENT_NOT_FOUND: 'Department not found.',
    ERROR_DELETE_USER_EXIST:
      'Cannot delete sub department since users are associated with it.',

    DELETED: 'Sub Department deleted successfully.',
  },
  DESIGNATION: {
    ERROR_DESIGNATION_NOT_FOUND: 'Designation not found.',
    ERROR_DELETE_USER_EXIST:
      'Cannot delete designation since users are associated with it.',

    DELETED: 'Designation deleted successfully.',
  },
  UPLOAD: {
    FILE_UPLOADED: 'File uploaded successfully.',
    FILE_FETCHED: 'File fetched successfully.',
    ERROR_UNKNOW_FILE_TYPE: 'Invalid file type.',
    ERROR_FILE_NOT_FOUND: 'File not found.',
    INVALID_FILE_FORMAT_AND_SIZE:
      'Invalid file format or size. Only JPG, JPEG, PNG files up to 50MB are allowed.',
  },
  OBS_NMS: {
    DEVICES_FETCHED: 'Devices fetched successfully.',
    DEVICE_FETCHED: 'Device fetched successfully.',
    OBS_DEVICES_SYNCHORNIZED:
      'Observium devices are synchornized successfully.',
  },
  OBS_ALERTS: {
    ALERTS_FETCHED: 'Alerts fetched successfully.',
    ALERT_FETCHED: 'Alert fetched successfully.',
    ERROR_NOT_FOUND: 'Alarm not found.',
  },
  OBS_DEVICE: {
    DEVICES_FETCHED: 'Devices fetched successfully.',
    DEVICE_FETCHED: 'Device fetched successfully.',
  },
  NCE_ALARMS: {
    ALARMS_FETCHED: 'Alarms fetched successfully.',
    ALARM_FETCHED: 'Alarm fetched successfully.',
    ERROR_NOT_FOUND: 'Alarm not found.',
  },
  CONTENT_TYPE: {
    ERROR_INVALID_CONTENT_TYPE:
      'Invalid content type Only application/json and multipart/form-data is allowed.',
  },
  MAILER: {
    MAIL_SENT: 'Email sent successfully.',
    ERROR_MAIL_SENT: `Couldn't send email.`,
  },
  ALARM_FILTER_CONFIG: {
    DELETED: 'Alarm filter config removed successfully.',
    ERROR_NOT_FOUND: 'Alarm filter config not found.',
    CREATED: 'Alarm filter config created successfully.',
    UPDATED: 'Alarm filter config updated successfully.',
  },
  ALARM_ADV_CONDITIONS: {
    DELETED: 'Advanced condition removed successfully.',
    ERROR_NOT_FOUND: 'Advanced condition for alarm not found.',
  },
  ALARM_RECIPIENTS: {
    DELETED: 'Alarm recipient removed successfully.',
    ERROR_NOT_FOUND: 'Alarm recipient not found.',
  },
  AUTH: {
    FORGOT_PASSWORD_SUCCESS: 'Email sent successfully.',
    UPDATE_PASSWORD_SUCCESS: 'Password updated successfully.',
    UPDATE_USER_SUCCESS: 'User updated successfully.',
    ERROR_UPDATE_PASSWORD: 'Invalid token.',
    ERROR_TOKEN_INVALID: 'Invalid login token, you need to re-login.',
  },
  FILTERS_TEMPLATES: {
    FETCHED_ALL: 'Filters templates fetched succesfully.',
    CREATED: 'Filters template created successfully.',
    DELETED: 'Filters template deleted successfully.',
    ERROR_FILTERS_TEMPLATE_NOT_FOUND: 'Filters Template not found.',
  },
  APP_DASHBOARD: {
    CREATED: 'APP dashboard created successfully.',
    FETCHED_ALL: 'Dashboard fetched succesfully.',
    FETCHED_WIDGET_BY_DASHBOARD: 'Widget fetched successfully.',
    UPDATE_DASHBOARD: 'Dashboard updated successfully.',
    DELETED: 'Dashboard deleted successfully.',
  },
  APP_DASHBOARD_WIDGET: {
    CREATED: 'Widget created successfully.',
    UPDATE_WIDGET: 'Widget updated successfully.',
    DELETED: 'Widget deleted successfully.',
    FETCHED_WIDGET: 'Widget fetched successfully',
    ERROR_DUPLICATE_WIDGET:
      'Widget with same widget name and type already exists.',
  },
  TROUBLE_TICKET_CATEGORY: {
    CREATED: ' Trouble ticket category created successfully.',
    UPDATED: 'Trouble ticket category updated successfully.',
    DELETED: 'Trouble ticket category deleted successfully.',
    FETCHED: 'Trouble ticket category fetched successfully',
    ERROR_DUPLICATE:
      'Trouble ticket category with same category name already exists.',
  },
  TROUBLE_TICKET: {
    CREATED: 'Trouble Ticket created Successfully.',
    INVALID_USER: 'User is Invalid',
    STATUS_ERROR: 'Invalid status or Trouble ticket is not assigned.',
    UPDATED: 'Trouble Ticket status has been updated successfully.',
    LEAVE: 'Trouble Ticket Left.',
    SENT_BACK: 'Trouble Ticket sent back.',
    ASSIGNED: 'Trouble Ticket assigned to user',
    RE_OPEN: 'Ticket has been Reopened.',
    BULK_UPDATE: 'Selected tickets have been completed in this bulk request.',
  },
  COMMENT: {
    CREATED: 'Comment created successfully',
  },
  ACTIVITY_LOG: {
    CREATED: 'Activity log created successfully',
  },
  TROUBLE_TICKET_MESSAGE: {
    CREATED: (user: string, assignedUser: string, ticketNumber: string) =>
      `${user} has created Ticket: ${ticketNumber} and assigned to ${assignedUser}.`,
    UPDATED: (
      user: string,
      previousStatus: string,
      currentStatus: string,
      ticketNumber: string,
    ) =>
      `${user} has changed status from ${previousStatus} to ${currentStatus} of Ticket: ${ticketNumber}.`,
    LEAVE: (user: string, ticketNumber: string) =>
      `${user} has leave Ticket: ${ticketNumber}.`,
    SENT_BACK: (user: string, ticketNumber: string, assignedUser: string) =>
      `${user} sent back Ticket: ${ticketNumber} to ${assignedUser}.`,

    OVER_TAT: {
      EMAIL: {
        title: 'OverTAT Alert: Trouble Ticket: %s Needs Your Attention.',
        subject: 'Ticket Alert: %s | TAT Violation',
      },

      MESSAGE: 'Ticket: %s has been over TAT.',
      Title: `Over TAT Ticket`,
    },
  },

  TROUBLE_TICKET_PAUSE: {
    CREATED: 'Trouble ticket pause request created.',
    Updated: 'Trouble ticket pause request updated.',
    DELETED: 'Trouble ticket pause request deleted.',
    APPROVED: 'Trouble ticket pause request approved.',
    RESUMED: 'Trouble ticket pause request resumed.',
    REJECTED: 'Trouble ticket pause request rejected.',
  },
};

const NCE_ALARM_SEVERITY = {
  CRITICAL: 'critical',
  MAJOR: 'major',
  MINOR: 'minor',
  WARNING: 'warning',
};
const NCE_ALARM_SEVERITY_DB_ENUM = [
  NCE_ALARM_SEVERITY.CRITICAL,
  NCE_ALARM_SEVERITY.MAJOR,
  NCE_ALARM_SEVERITY.MINOR,
  NCE_ALARM_SEVERITY.WARNING,
];

enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

const OBS_ALERTS_CATEGORY = {
  ALERT: 'ALERT',
  SYSLOG: 'SYSLOG',
  RECOVER: 'RECOVER',
};

const LDI_ALERT_CATEGORY = {
  FAULT: 'fault',
  CLEAR: 'clear',
};

enum AppType {
  NCE = 'NCE',
  OBSERVIUM = 'OBSERVIUM',
  NOKIA_TXN = 'NOKIA_TXN',
  NCE_GPON = 'NCE_GPON',
  LDI_SOFTSWITCH_EMS = 'LDI_SOFTSWITCH_EMS',
  SIP = 'SIP',
  TRUNK = 'TRUNK',
}

enum NetworkType {
  TRANSMISSION = 'transmission',
  IP = 'ip',
  GPON = 'gpon',
  NOKIA_TXN = 'transmission',
  LDI_SOFTSWITCH_EMS = 'ldi_softswitch',
}

enum EscalationType {
  EMAIL = 'email',
  TROUBLE_TICKET = 'trouble-ticket',
  SMS = 'sms',
}
enum AlarmStatus {
  CLEARED = 'cleared',
  UN_CLEARED = 'uncleared',
}

enum DashboardTrendTypes {
  ALARMS = 'Alarms',
  DEVICES = 'Devices',
  STATUS = 'Status',
  REGION = 'Region',
  SUB_DEPARTMENT = 'sub-department',
  CATEGORY = 'category',
  NETWORK = 'network',
  PRIORITY = 'priority',
}
const EMAIL_TEMPLATES = {
  PARTIALS: {
    HEADER: {
      TEMPLATE_NAME: 'header.partial.hbs',
      CONTEXT: {
        LOGO_PATH: 'twa-logo.png',
      },
    },
  },
  ALERT: {
    NCE: {
      TEMPLATE_NAME: 'nce-alarm.email.hbs',
      CONTEXT: [
        {
          key: 'Status',
          nce_alarm_key: 'ne_name',
        },
        {
          key: 'Network',
          nce_alarm_key: 'ne_name',
        },
        {
          key: 'Section',
          nce_alarm_key: 'ne_name',
        },
        {
          key: 'Vendor',
          nce_alarm_key: 'ne_name',
        },
        {
          key: 'Region',
          nce_alarm_key: 'ne_name',
        },
        {
          key: 'Severity',
          nce_alarm_key: 'ne_name',
        },
        {
          key: 'Alarms Name',
          nce_alarm_key: 'ne_name',
        },
        {
          key: 'Alarms Description',
          nce_alarm_key: 'ne_name',
        },
        {
          key: 'Fiber(s) NE/Board',
          nce_alarm_key: 'ne_name',
        },
        {
          key: 'Informed',
          nce_alarm_key: 'ne_name',
        },
        {
          key: 'Service Affected',
          nce_alarm_key: 'ne_name',
        },
        {
          key: 'Informed at',
          nce_alarm_key: 'ne_name',
        },
        {
          key: 'Information',
          nce_alarm_key: 'ne_name',
        },
        {
          key: 'Reason',
          nce_alarm_key: 'ne_name',
        },
        {
          key: 'Down since',
          nce_alarm_key: 'ne_name',
        },
        {
          key: 'Restored Since',
          nce_alarm_key: 'ne_name',
        },
      ],
    },
    OBSERVIUM: {
      TEMPLATE_NAME: 'obs-alert.email.hbs',
      CONTEXT: [
        {
          key: 'alert',
          observium_alert_key: 'alert_state',
        },
        {
          key: 'entity',
          observium_alert_key: 'alert_state',
        },
        {
          key: 'descr',
          observium_alert_key: 'alert_state',
        },
        {
          key: 'conditions',
          observium_alert_key: 'alert_state',
        },
        {
          key: 'metrics',
          observium_alert_key: 'alert_state',
        },
        {
          key: 'duration',
          observium_alert_key: 'alert_state',
        },
        {
          key: 'device',
          observium_alert_key: 'alert_state',
        },
        {
          key: 'hardware',
          observium_alert_key: 'alert_state',
        },
        {
          key: 'operating_system',
          observium_alert_key: 'alert_state',
        },
        {
          key: 'location',
          observium_alert_key: 'alert_state',
        },
        {
          key: 'uptime',
          observium_alert_key: 'alert_state',
        },
      ],
    },
  },
  SIGNATURE: `<strong>
    Regards,<br /><br/>
    Nucleus Support
  </strong>`,
};

enum AlarmRecipientType {
  SINGLE_USER = 'single_user_id',
  GROUP_USER = 'group_user_id',
  SUB_DEPARTMENT = 'sub_department_id',
}

enum OBSERVIUM_ALERT_SEVERITY {
  CRITICAL = 'Critical',
  WARNING = 'Warning',
  NOTIFICATION = 'Notification',
}

const DROP_DOWN_CATEGORY_CONSTANTS = {
  OBS_ALARM_SEVERITY: 'OBS_ALARM_SEVERITY',
  NCE_ALARM_SEVERITY: 'NCE_ALARM_SEVERITY',
  NCE_GPON_ALARM_SEVERITY: 'NCE_GPON_ALARM_SEVERITY',
  LDI_SOFTSWITCH_ALARM_SEVERITY: 'LDI_SOFTSWITCH_ALARM_SEVERITY',
};

const DROPDOWN_ITEM_IDS = {
  TROUBLE_TICKET_STATUS: {
    PENDING: 32,
    ASSIGNED: 33,
    RESOLVED: 34,
    COMPLETED: 35,
    REOPEN: 36,
    CANCELLED: 39,
    Pause: 43,
    RCA_AWAITED: 51,
  },
  TROUBLE_TICKET_GENERATION_TYPE: {
    MANUAL: 37,
    AUTOMATED: 38,
  },

  TROUBLE_TICKET_MEDIUM: {
    OBSERVIUM_NMS: 30,
    NCE_NMS: 31,
    NCE_GPON_NMS: 59,
    NOKIA_TXN_NMS: 60,
    LDI_SOFTSWITCH_EMS_NMS: 74,
  },
  TROUBLE_TICKET_PRIORITY_LEVEL: {
    P1: 48,
    P2: 49,
    P3: 50,
  },
  ALARM_TYPE: {
    SIP: 67,
    TRUNK: 68,
  },
};

const GLOBAL_SETTINGS = {
  TYPES: {
    USER_NOTIFICATION: 2,
  },
  KEYS: {
    RECEIVE_EMAIL: 'receive_email',
    RECEIVE_SMS: 'receive_sms',
    RECEIVE_NOTIFICATION: 'receive_notification',
  },
};

type milliseconds = number;
type seconds = number;
enum AuthTypes {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

enum TrendType {
  TOP_TEN_DEVICES = 'top_ten_devices',
  TOP_TEN_ALARMS = 'top_ten_alarms',
  SEVERITY = 'severity',
  TOP_TEN_TRUNK_GROUP = 'top_ten_trunk_group',
}

enum WidgetType {
  TREND = 'trend',
  LIST = 'list',
}

enum AlarmFilterPeriod {
  LAST_24_HOURS = 'LAST_24_HOURS',
  LAST_WEEK = 'LAST_WEEK',
  LAST_MONTH = 'LAST_MONTH',
}

enum FILTERS_TEMPLATES_TYPE {
  NCE_ALARM_TEMPLATE = 'nce-alarms-filters',
  OBSERVIUM_ALARM_TEMPLATE = 'observium-alarms-filters',
  NCE_GPON_ALARMS_FILTER = 'nce-gpon-alarms-filters',
  NOKIA_TXN_ALARMS_FILTER = 'nokia-txn-alarms-filters',
  LDI_SOFTSWITCH_ALARMS_FILTER = 'ldi-softswitch-alarms-filter',
  DEFAULT = '',
}

enum DATE_FORMATS {
  DATE = 'DD/MM/yyyy',
  DB_DATE = '%d/%m/%Y',
  DATETIME = 'DD/MM/yyyy hh:mm:ss A',
  DB_DATETIME = '%d/%m/%Y %h:%i:%s %p',
  DATETIME_FOR_FROM_TO_SELECTOR = 'DD-MM-YYYY ddd hh:mm:ss A',
}

enum TroubleTicketStatus {
  PENDING = 'Pending',
  ASSIGNED = 'Assigned',
  RESOLVED = 'Resolved',
  COMPLETED = 'Completed',
  RE_OPEN = 'reopen',
}

const MapTroubleTicketPriorityToPermission = {
  48: 'ticketPriorityNotifications-P1Tickets',
  49: 'ticketPriorityNotifications-P2Tickets',
  50: 'ticketPriorityNotifications-P3Tickets',
};

const MapTroubleTicketPriorityToPermissionOverTAT = {
  48: 'ticketOverTatEscalations-P1Tickets',
  49: 'ticketOverTatEscalations-P2Tickets',
  50: 'ticketOverTatEscalations-P3Tickets',
};

enum TROUBLE_TICKET_SORT {
  STATUS = 'status',
  NETWORK_TYPE = 'network_type',
  ALARM_NAME = 'alarm_name',
  DEVICE = 'device',
  TICKET_NUMBER = 'ticket_number',
  CREATED_AT = 'created_at',
}

export {
  QUEUES,
  KAFKA_TOPICS,
  MICROSERVICES,
  NCE_ALARM_CATEGORY,
  NCE_ALARM_SEVERITY,
  NCE_ALARM_SEVERITY_DB_ENUM,
  RecordStatus,
  UserType,
  APP_MESSAGES,
  APP_PERMISSIONS,
  APP_CONSTANTS,
  Order,
  OBS_ALERTS_CATEGORY,
  AppType,
  AlarmStatus,
  EMAIL_TEMPLATES,
  AlarmRecipientType,
  OBSERVIUM_ALERT_SEVERITY,
  DROP_DOWN_CATEGORY_CONSTANTS,
  milliseconds,
  seconds,
  AuthTypes,
  TrendType,
  AlarmFilterPeriod,
  EscalationType,
  FILTERS_TEMPLATES_TYPE,
  DATE_FORMATS,
  GlobalSettingsValuesDatatype,
  NetworkType,
  WidgetType,
  EscalationLevel,
  TatUot,
  ActivityLog,
  ActivityMessage,
  CALCULATION,
  TroubleTicketStatus,
  DROPDOWN_ITEM_IDS,
  GLOBAL_SETTINGS,
  DashboardTrendTypes,
  MapTroubleTicketPriorityToPermission,
  MapTroubleTicketPriorityToPermissionOverTAT,
  TROUBLE_TICKET_SORT,
  MapRegionAgainstCity,
  LDI_ALERT_CATEGORY,
  LdiSoftswitchTrunkGroupStatus,
};
