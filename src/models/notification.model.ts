export class NotificationPayloadModel {
  related_id: number;
  related_table: string;
  message: string;
  title: string;
  user_id: number;
  sub_department_id: number;
  is_seen: boolean;
  is_open: boolean;
  created_by: number;
  route: string;
  link: string;
}
export class NotificationModel {
  payload: NotificationPayloadModel;
}
