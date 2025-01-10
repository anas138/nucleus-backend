import { AlarmRecipientType } from 'src/common/enums/enums';
import { User } from 'src/entities/user.entity';

export class AlarmRecipientModel {
  recipient_type: string;
  recipient: AlarmRecipientType;
  recipient_id: number;
  created_by?: number;
  updated_by?: number;
}
export class CreateAlarmRecipientModel extends AlarmRecipientModel {
  alarm_filter_config_id?: number;
}

export class UpdateAlarmRecipientModel extends AlarmRecipientModel {
  id?: number;
  alarm_filter_config_id?: number;
}

export class FetchAlarmRecipientModel {
  id: number;
  recipient_type: string;
  single_user_id: number;
  group_user_id: number;
  sub_department_id: number;
  single_user?: User;
  group_user?: User;
}

export class FetchAlarmRecipientMappedModel extends AlarmRecipientModel {
  id: number;
  email?: string;
}

export const transformAlarmRecipient = (
  res: FetchAlarmRecipientModel,
): FetchAlarmRecipientMappedModel => {
  const recipient = res.single_user_id
    ? AlarmRecipientType.SINGLE_USER
    : res.group_user_id
    ? AlarmRecipientType.GROUP_USER
    : AlarmRecipientType.SUB_DEPARTMENT;

  const email = res.single_user
    ? res.single_user.email
    : res.group_user
    ? res.group_user.email
    : '';
  return email
    ? {
        id: res.id,
        recipient,
        recipient_id: res[recipient],
        recipient_type: res.recipient_type,
        email,
      }
    : {
        id: res.id,
        recipient,
        recipient_id: res[recipient],
        recipient_type: res.recipient_type,
      };
};
