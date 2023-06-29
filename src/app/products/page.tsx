"use client";
import { useState } from "react";
import {
  Space,
  Button,
  Spin,
  Result,
  Input,
  Table,
  TableColumnsType,
} from "antd";
import useSWR from "swr";
import idx from "idx";
import { Product, ProductData, ProductsData } from "../../../type";

const { Search } = Input;

enum PaginationType {
  NEXT = 4,
  PREV = -4,
}

interface ProductsProps {
  skip: number;
  search?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Products() {
  const [params, setParams] = useState<ProductsProps>({ search: "", skip: 0 });
  const { data, error, isLoading } = useSWR<ProductsData>(
    `https://dummyjson.com/products${
      params.search ? `/search?q=${params.search}&` : "?"
    }limit=4&skip=${params.skip}&select=title,price,stock,brand,category`,
    fetcher
  );

  const productsData: Product[] = idx(data, (_) => _.products) || [];
  const limit: number = idx(data, (_) => _.limit) || 0;
  const total: number = idx(data, (_) => _.total) || 0;
  const currentPage = params.skip / limit + 1;
  const maxPage = Math.ceil(total / limit);
  const productsDataFix: ProductData[] = productsData.map((product) => {
    return {
      ...product,
      id: undefined,
      key: product.id,
    };
  });

  const columns: TableColumnsType<ProductData> = [
    {
      title: "Product Name",
      dataIndex: "title",
      sorter: (a, b) => a.title.length - b.title.length,
    },
    {
      title: "Brand",
      dataIndex: "brand",
      sorter: (a, b) => a.brand.length - b.brand.length,
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Stock",
      dataIndex: "stock",
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => a.category.length - b.category.length,
    },
  ];

  const handleSearch = (dataSearch: string) => {
    setParams((prevState) => ({
      ...prevState,
      search: dataSearch ? dataSearch : "",
      skip: 0,
    }));
  };

  const handleParams = (pagination: PaginationType) => {
    setParams((prevState) => ({
      ...prevState,
      skip: prevState.skip + pagination,
    }));
  };

  if (error)
    return (
      <Result
        status="warning"
        title="There are some problems with your operation."
      />
    );

  return (
    <Spin spinning={isLoading}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "end",
          gap: 16,
        }}
      >
        <Search
          allowClear
          placeholder="input search text"
          onSearch={handleSearch}
          defaultValue={params.search}
          style={{ width: "60%" }}
          enterButton
        />
        <Table
          columns={columns}
          dataSource={productsDataFix}
          loading={isLoading}
          pagination={false}
          bordered
          style={{ width: "100%" }}
        />
        <Space direction="horizontal" size={"middle"}>
          <Button
            type="default"
            disabled={currentPage === 1}
            onClick={() => handleParams(PaginationType.PREV)}
          >
            Prev
          </Button>
          <Space direction="horizontal" size={"middle"}>
            {`Page ${currentPage} / ${maxPage}`}
          </Space>
          <Button
            type="default"
            disabled={currentPage === maxPage}
            onClick={() => handleParams(PaginationType.NEXT)}
          >
            Next
          </Button>
        </Space>
      </div>
    </Spin>
  );
}