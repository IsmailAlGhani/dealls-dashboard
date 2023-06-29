export type ProductsData = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export type Product = {
  id: number;
  title: string;
  price: number;
  stock: number;
  brand: string;
  category: string;
};

export type ProductData = {
  key: number;
  title: string;
  price: number;
  stock: number;
  brand: string;
  category: string;
};
