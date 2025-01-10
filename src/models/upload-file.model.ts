export class UploadFileModel {
  name: string;
  mime: string;
  size: number;
  url: string;
  created_by: number;
  original_name: string;
  ext?: string;
}
export const transformFileToUploadFile = (file: Express.Multer.File) => {
  return {
    name: file.filename,
    mime: file.mimetype,
    size: file.size,
    original_name: file.originalname,
  };
};
