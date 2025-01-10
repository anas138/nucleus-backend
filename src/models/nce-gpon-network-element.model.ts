import { RecordStatus } from 'src/common/enums/enums';

export interface INceGponNetworkElementModel {
  lifecycle_state: string;
  resource_id: string;
  ip_address: string;
  is_gateway: number;
  dev_sys_name: string;
  physical_id: number;
  container: boolean;
  patch_version: string;
  manufacture_date: Date;
  location: string;
  product_name: string;
  ref_parent_subnet: string;
  software_version: string;
  manufacturer: string;
  remark: string;
  name: string;
  roles: string[];
  detail_dev_type_name: string;
  communication_state: string;
  admin_status: string;
  region_id?: number;
  created_on: Date;
  record_status?: RecordStatus;
  nce_create_time: Date;
  nce_last_modified: Date;
}

export const transformGponNetworkElementResponse = (
  response: INceGponNetworkElementModel,
) => {
  return {
    lifecycle_state: response['lifecycle-state'],
    resource_id: response['res-id'],
    ip_address: response['ip-address'],
    is_gateway: response['is-gateway'],
    dev_sys_name: response['dev-sys-name'],
    physical_id: response['physical-id'],
    container: response['container'],
    patch_version: response['patch-version'],
    manufacture_date: response['manufacture-date'],
    location: response['location'],
    product_name: response['product-name'],
    ref_parent_subnet: response['ref-parent-subnet'],
    software_version: response['software-version'],
    manufacturer: response['manufacturer'],
    remark: response['remark'],
    name: response['name'],
    roles: response['roles'],
    detail_dev_type_name: response['detail-dev-type-name'],
    communication_state: response['communication-state'],
    admin_status: response['admin-status'],
    created_on: new Date(response['create-time']),
    region_id: null,
    nce_create_time: new Date(response['create-time']),
    nce_last_modified: new Date(response['last-modified']),
  };
};
