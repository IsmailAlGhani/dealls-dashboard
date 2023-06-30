interface Pagination {
  total: number;
  skip: number;
  limit: number;
}
export interface ProductsData extends Pagination {
  products: Product[];
}

export interface Product {
  id: number;
  title?: string;
  price?: number;
  stock: number;
  brand: string;
  category?: string;
}

export interface ProducMap {
  [productName: string]: Product;
}

export interface ProductData extends Omit<Product, "id"> {
  key: number;
}

export interface ProductCart {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedPrice: number;
}

export interface ProductCartData extends Omit<ProductCart, "id"> {
  key: number;
}

export interface Cart {
  id: number;
  products: ProductCart[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface CartData extends Omit<Cart, "id" | "products"> {
  key: number;
  products: ProductCartData[];
}

export interface CartsData extends Pagination {
  carts: Cart[];
}

export interface UserData {
  id: number;
  firstName: string;
  lastName: string;
}

export interface ProductCartDataFinal extends ProductData, ProductCartData {}
