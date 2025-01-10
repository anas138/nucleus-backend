import { Connection } from 'mongoose';
import {
  ObserviumSchema,
  ObsAlerts,
} from 'src/mongoose-schemas/observium-alerts.schema';

export const mngObsAlertsProvider = [
  {
    provide: 'OBS_MODEL',
    useFactory: (connection: Connection) =>
      connection.model(ObsAlerts.name, ObserviumSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
