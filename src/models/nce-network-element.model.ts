export interface INceNetworkElementModel {
  is_virtual: boolean;
  resource_id: string;
  ip_address: string;
  is_gateway: number;
  is_in_ac_domain: boolean;
  physical_id: number;
  container: boolean;
  patch_version?: string;
  pre_config: number;
  product_name: string;
  user_label: string;
  ref_parent_subnet: string;
  software_version?: string;
  gateway_id_list: string;
  manufacturer?: string;
  remark: string;
  name: string;
  hardware_version: string;
  detail_dev_type_name: string;
  communication_state: string;
  alias: string;
  enable_ason?: number;
  admin_status?: string;
  nce_create_time: Date;
  nce_last_modified: Date;
}

export const transformNetworkElementResponse = (
  response: INceNetworkElementModel,
) => {
  return {
    is_virtual: response['is-virtual'],
    resource_id: response['res-id'],
    ip_address: response['ip-address'],
    is_gateway: response['is-gateway'],
    is_in_ac_domain: response['is-in-ac-domain'],
    physical_id: response['physical-id'],
    container: response['container'],
    patch_version: response['patch-version'],
    pre_config: response['pre-config'],
    product_name: response['product-name'],
    user_label: response['user-label'],
    ref_parent_subnet: response['ref-parent-subnet'],
    software_version: response['software-version'],
    gateway_id_list: JSON.stringify(response['gateway-id-list']),
    manufacturer: response['manufacturer'],
    remark: response['remark'],
    name: response['name'],
    hardware_version: response['hardware-version'],
    detail_dev_type_name: response['detail-dev-type-name'],
    communication_state: response['communication-state'],
    alias: response['alias'],
    enable_ason: response['enable-ason'],
    admin_status: response['admin-status'],
    nce_create_time: new Date(response['create-time']),
    nce_last_modified: new Date(response['last-modified']),
  };
};
