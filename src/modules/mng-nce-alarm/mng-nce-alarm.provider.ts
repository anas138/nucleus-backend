import { Connection } from 'mongoose';
import { NceSchema, NceAlerts } from 'src/mongoose-schemas/nce-alerts.schema';

export const mngNceAlertsProvider = [
  {
    provide: 'NCE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(NceAlerts.name, NceSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
