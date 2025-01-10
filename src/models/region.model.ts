export class CreateRegionModel {
  name: string;
  description?: string;
  created_by?: number;
  updated_by?: number;
}

//response
export class RegionCreatedModel {
  name: string;
  description?: string;
  created_by?: number;
  updated_by?: number;
}

export class FetchRegionModel {
  id?: number;
  name: string;
  description?: string;
  created_by?: number;
  updated_by?: number;
}
