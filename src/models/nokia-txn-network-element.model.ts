import { RecordStatus } from 'src/common/enums/enums';

export class INokiaTxnNetworkElementModel {
  id: number;
  id_class: number;
  alarm_syntesis: string;
  ason_ctr_plane_type: string;
  ct_access_status: string;
  comment1?: string;
  comment2?: string;
  communication_state: string;
  eth_present: string;
  hierarchy_subnet: string;
  is_multi_nes: string;
  localization: string;
  latitude: string;
  longitude: string;
  altitude: string;
  mib_alignment_state: string;
  ne_alignment: string;
  ne_sub_type: string;
  key: string;
  loopback_ip: string;
  secondary_address: string;
  class_name: string;
  otn_conf_downld_st: string;
  parent_id?: number;
  parent_label: string;
  position: string;
  sdh_present: string;
  supervision_state: string;
  gui_label: string;
  version: string;
  wdm_present: string;
  conf_downld_st: string;
  nad_string: string;
  product_name: string;
  reachable: string;
  short_product_name: string;
  site_name: string;
  node_type: string;
  eml_ne_type: string;
  comment3?: string;
  association_present: string;
  ne_sub_release: string;
  associated_ptn_ne_id: string;
  comments?: string;
  actual_release: string;
  audit_status: string;
  new_communication_state: string;
  new_supervision_state: string;
  alignment_state: string;
  creation_date: Date;
  modified_date: Date;
  created_by: string;
  modified_by: string;
  latest_note?: string;
  scheduled_for_gri: string;
  system_abnormal_state: string;
  system_mode: string;
}

export const transformNokiaNetworkElementResponse = (response: any) => {
  return {
    id: response['id'],
    id_class: response['IdClass'],
    alarm_syntesis: response['alarmSyntesis'],
    ason_ctr_plane_type: response['asonCtrPlaneType'],
    ct_access_status: response['ctAccessStatus'],
    comment1: response['comment1'],
    comment2: response['comment2'],
    communication_state: response['communicationState'],
    eth_present: response['ethPresent'],
    hierarchy_subnet: response['hierarchySubnet'],
    is_multi_nes: response['isMultiNes'],
    localization: response['localization'],
    latitude: response['latitude'],
    longitude: response['longitude'],
    altitude: response['altitude'],
    mib_alignment_state: response['mibAlignmentState'],
    ne_alignment: response['neAlignment'],
    ne_sub_type: response['neSubType'],
    key: response['key'],
    loopback_ip: response['loopbackIp'],
    secondary_address: response['secondaryAddress'],
    class_name: response['className'],
    otn_conf_downld_st: response['otnConfDownldSt'],
    parent_id: response['parentId'],
    parent_label: response['parentLabel'],
    position: response['position'],
    sdh_present: response['sdhPresent'],
    supervision_state: response['supervisionState'],
    gui_label: response['guiLabel'],
    version: response['version'],
    wdm_present: response['wdmPresent'],
    conf_downld_st: response['confDownldSt'],
    nad_string: response['nadString'],
    product_name: response['productName'],
    reachable: response['reachable'],
    short_product_name: response['shortProductName'],
    site_name: response['siteName'],
    node_type: response['nodeType'],
    eml_ne_type: response['emlNeType'],
    comment3: response['comment3'],
    association_present: response['associationPresent'],
    ne_sub_release: response['neSubRelease'],
    associated_ptn_ne_id: response['associatedPtnNeId'],
    comments: response['comments'],
    actual_release: response['actualRelease'],
    audit_status: response['auditStatus'],
    new_communication_state: response['newCommunicationState'],
    new_supervision_state: response['newSupervisionState'],
    alignment_state: response['alignmentState'],
    creation_date: new Date(+response['creationDate']),
    modified_date: new Date(response['modifiedDate']),
    created_by: response['createdBy'],
    modified_by: response['modifiedBy'],
    latest_note: response['latestNote'],
    scheduled_for_gri: response['scheduledForGri'],
    system_abnormal_state: response['systemAbnormalState'],
    system_mode: response['systemMode'],
  };
};