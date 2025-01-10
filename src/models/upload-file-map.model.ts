import { RecordStatus } from 'src/common/enums/enums';

export class UploadFileMapModel {
  id?: number;
  name: string;
  url: string;
  document_type: string;
  related_id: number;
  related_type: string;
  record_status: RecordStatus;
  upload_file_id: number;
  created_by: number;
  updated_by: number;
}
