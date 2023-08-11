export interface AuthInterface {
  token: string | null;
}

export interface StateI {
  persistedReducer: AuthInterface;
  api: null;
}

export interface StoreI {
  id: number;
  name: string;
}

export interface ParentCategoryI {
  id: number;
  name: string;
}

export interface SubCategoryI {
  id: number;
  name: string;
  parentCategory: ParentCategoryI;
}

export interface ProductI {
  id: number;
  name: string;
  stock: number;
  unit: UnitI;
  subCategory: SubCategoryI;
}

export interface StoreDataI {
  count: number;
  products: Array<ProductI>;
}

export interface UnitI {
  id: number;
  name: string;
}

export interface AttributeI {
  id: number;
  name: string;
  valueType: {
    id: number;
    name: string;
  };
}

export interface AttributeValueI {
  attribute: AttributeI;
  booleanValue: boolean | null;
  stringValue: string | null;
  numberValue: number | null;
  product: ProductI;
}
