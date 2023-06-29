"use client";
import { useState } from "react";
import useSWR from "swr";
import idx from "idx";
import { fetcher } from "../util";
import { Cart, CartData, CartsData } from "../../../type";
import { Spin, Table, Button, Space, TableColumnsType, Result } from "antd";
import Link from "next/link";

const LIMIT_CART = 4;

enum PaginationType {
  NEXT = LIMIT_CART,
  PREV = -LIMIT_CART,
}

export default function CartPage() {
  const [skip, setSkip] = useState<number>(0);
  const { data, error, isLoading } = useSWR<CartsData>(
    `https://dummyjson.com/carts?limit=${LIMIT_CART}&skip=${skip}`,
    fetcher
  );

  const cartsData: Cart[] = idx(data, (_) => _.carts) || [];
  const limit: number = idx(data, (_) => _.limit) || 0;
  const total: number = idx(data, (_) => _.total) || 0;
  const currentPage = skip / limit + 1;
  const maxPage = Math.ceil(total / limit);
  const cartsDataFix: CartData[] = cartsData.map((cart) => {
    return {
      ...cart,
      id: undefined,
      key: cart.id,
      products: cart.products.map((cartProduct) => {
        return {
          ...cartProduct,
          id: undefined,
          key: cartProduct.id,
        };
      }),
    };
  });

  const columns: TableColumnsType<CartData> = [
    {
      title: "Product Name",
      dataIndex: "key",
      sorter: (a, b) => a.key - b.key,
      render: (value) => (
        <Link href={`/carts/${value}`}>{`Cart ${value}`}</Link>
      ),
    },
    {
      title: "Total Price",
      dataIndex: "total",
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: "Total Discount",
      dataIndex: "discountedTotal",
      sorter: (a, b) => a.discountedTotal - b.discountedTotal,
    },
    {
      title: "Total Product",
      dataIndex: "totalProducts",
      sorter: (a, b) => a.totalProducts - b.totalProducts,
    },
    {
      title: "Total Quantity",
      dataIndex: "totalQuantity",
      sorter: (a, b) => a.totalQuantity - b.totalQuantity,
    },
  ];

  const handleParams = (pagination: PaginationType) => {
    setSkip((prevState) => prevState + pagination);
  };

  if (error) {
    return (
      <Result
        status="warning"
        title="There are some problems with your operation."
      />
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "end",
        gap: 16,
      }}
    >
      <Table
        columns={columns}
        dataSource={cartsDataFix}
        loading={isLoading}
        pagination={false}
        bordered
        scroll={{ x: "100vh" }}
        style={{ width: "100%" }}
      />
      <Spin spinning={isLoading}>
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
      </Spin>
    </div>
  );
}
