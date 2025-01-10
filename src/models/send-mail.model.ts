export class SendMailModel {
  to: any;
  subject?: string;
  cc?: Array<string>;
  template?: string;
  context?: any;
  attachments?: Array<any>;
  html?: string;
}
