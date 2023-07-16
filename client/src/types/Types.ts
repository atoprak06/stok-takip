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
  unit: string;
  subCategory: SubCategoryI;
}

export interface StoreDataI {
  count: number;
  products: Array<ProductI>;
}
