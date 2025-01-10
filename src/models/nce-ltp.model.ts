export interface INceLtpModel {
  resource_id: string;
  max_wave_num: number;
  work_band_parity: string;
  medium_type: string;
  ltp_type_name: string;
  is_sub_ltp: boolean;
  card_id: string;
  slot_number: string;
  direction: string;
  frame_number: string;
  user_label: string;
  port_number: number;
  ne_id: string;
  name: string;
  alias: string;
  is_physical: boolean;
  ltp_role: string;
  port_type: number;
  optics_bom_code: string;
  sc_ltp_type: string;
  create_time: Date;
  last_modified: Date;
  sn: string;
}

export const transformLtpResponse = (response: INceLtpModel) => {
  return {
    resource_id: response['res-id'],
    max_wave_num: response['max-wave-num'],
    work_band_parity: response['work-band-parity'],
    medium_type: response['medium-type'],
    ltp_type_name: response['ltp-type-name'],
    is_sub_ltp: response['is-sub-ltp'],
    card_id: response['card-id'],
    slot_number: response['slot-number'],
    direction: response['direction'],
    frame_number: response['frame-number'],
    user_label: response['user-label'],
    port_number: response['port-number'],
    ne_id: response['ne-id'],
    name: response['name'],
    alias: response['alias'],
    is_physical: response['is-physical'],
    ltp_role: response['ltp-role'],
    port_type: response['port-type'],
    optics_bom_code: response['optics-bom-code'],
    sc_ltp_type: response['sc-ltp-type'],
    create_time: new Date(response['create-time']),
    last_modified: new Date(response['last-modified']),
    sn: response['sn'],
  };
};
