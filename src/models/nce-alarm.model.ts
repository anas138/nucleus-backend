import { NCE_ALARM_CATEGORY } from 'src/common/enums/enums';
import { PaginationQueryModel } from './pagination.model';
import { INceNetworkElementModel } from './nce-network-element.model';
import { NceNetworkElement } from 'src/entities/nce-network-element.entity';

export interface NCEAlarmModel {
  id?: number;
  severity: string;
  category: string;
  event_type: string;
  nce_alarm_id: number;
  alarm_text: string;
  alarm_serial_number: string;
  alarm_type_id?: string;
  layer: string;
  md_name: string;
  probable_cause: string;
  native_probable_cause: string;
  location_info: string;
  ne_name: string;
  ne_resource_id: string;
  ltp_resource_id?: string;
  resource_type?: string;
  product_type: string;
  other_info?: string;
  impacted_resource?: string;
  trail_name?: string;
  fiber_name?: string;
  ason_obj_name?: string;
  created_on: Date;
  cleared_on?: Date;
  acknowledged_on?: Date;
  network_element?: NceNetworkElement;
  alarm_filter_config_id?: number;
  is_cleared?: boolean;
}

export const transformNCEAlarmResponse = (
  message: any,
  neResId: string,
  ltpResId: string,
  resourceType: string,
): NCEAlarmModel => {
  return {
    category: message['category'],
    ne_name: message['alarm-parameters']['ne-name'],
    ne_resource_id: neResId,
    ltp_resource_id: ltpResId,
    resource_type: resourceType,
    alarm_serial_number: message['alarm-parameters']['alarm-serial-number'],
    alarm_text: message['alarm-parameters']['alarm-text'],
    severity: message['alarm-state-change-parameters']['perceived-severity'],
    nce_alarm_id: message['alarm-parameters']['reason-id'],
    event_type: message['x733-alarm-parameters']
      ? message['x733-alarm-parameters']['event-type']
      : '',
    layer: message['common-alarm-parameters']['layer'],
    md_name: message['common-alarm-parameters']['md-name'],

    product_type: message['common-alarm-parameters']['product-type'],
    created_on: message['time-created'],
    cleared_on:
      message['category'] === NCE_ALARM_CATEGORY.CLEAR
        ? message['alarm-state-change-parameters']['time']
        : null,
    native_probable_cause: message['alarm-parameters']['native-probable-cause'],
    probable_cause: message['alarm-parameters']['probable-cause'],
    alarm_type_id: message['common-alarm-parameters']['alarm-type-id'],
    location_info: message['alarm-parameters']['location-info'],
    other_info: message['alarm-parameters']['other-info'],
    trail_name: extractPropertyFromImpactedResource(message, 'TrailName'),
    fiber_name: extractPropertyFromImpactedResource(message, 'fibername'),
    ason_obj_name: extractPropertyFromImpactedResource(message, 'AsonObjName'),
  };
};

const extractPropertyFromImpactedResource = (
  message: NCEAlarmModel,
  propertyName: string,
): string | null => {
  try {
    const impactedResource: Array<any> =
      message['common-alarm-parameters']['impacted-resource'];
    if (impactedResource.length) {
      const properties: string = impactedResource[0];
      if (properties.includes(propertyName)) {
        const propertyValue = properties
          .split(propertyName)[1]
          .split('=')[1]
          .split(';')[0];
        return propertyValue;
      }
    }
    return null;
  } catch (error) {
    return null;
  }
};
