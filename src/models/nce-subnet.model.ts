export interface INceSubnetModel {
    res_id: string
    x_pos: number
    name: string
    ref_parent_subnet: string
    y_pos: number
    type_id: string
    origin: string
    node_class: string
}

export const transformNceSubnetResponse = (response: INceSubnetModel): INceSubnetModel => {
    return {
        res_id: response['res-id'],
        x_pos: response['x-pos'],
        name: response['name'],
        ref_parent_subnet: response['ref-parent-subnet'],
        y_pos: response['y-pos'],
        type_id: response['type-id'],
        origin: response['origin'],
        node_class: response['node-class']
    }
}