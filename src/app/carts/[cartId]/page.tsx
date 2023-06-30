"use client";
import useSWR from "swr";
import idx from "idx";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import {
  Cart,
  CartData,
  Product,
  ProductCartDataFinal,
  ProductData,
  UserData,
} from "../../../../type";
import { batchReduce, fetcher, multiFetcher } from "@/app/util";
import {
  Button,
  Card,
  Result,
  Row,
  Space,
  Spin,
  Table,
  TableColumnsType,
  Typography,
} from "antd";
import { LeftOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Text, Title } = Typography;
const LIMIT_PRODUCT_CART = 4;

enum PaginationType {
  NEXT = LIMIT_PRODUCT_CART,
  PREV = -LIMIT_PRODUCT_CART,
}

export default function CartDetailPage() {
  const params = useParams();
  const cartId = params.cartId;
  const {
    data: dataCart,
    error: errorCart,
    isLoading: loadingCart,
  } = useSWR<Cart>(`https://dummyjson.com/carts/${cartId}`, fetcher);
  const {
    id = 0,
    total = 0,
    products = [],
    discountedTotal = 0,
    totalProducts = 0,
    totalQuantity = 0,
    userId = 0,
  } = dataCart || {};

  if (errorCart) {
    return (
      <Result
        status="warning"
        title="There are some problems with your operation."
      />
    );
  }

  const { data: dataUser, isLoading: loadingUser } = useSWR<UserData>(
    userId
      ? `https://dummyjson.com/users/${userId}?select=firstName,lastName`
      : null,
    fetcher
  );

  const urlProduct =
    products.length > 0
      ? products.map(
          (product) =>
            `https://dummyjson.com/products/${product.id}?select=title,price,stock,brand,category`
        )
      : [];

  const {
    data: productsFix,
    error,
    isLoading: loadingProductCart,
  } = useSWR<Product[]>(
    urlProduct.length > 0 ? urlProduct : null,
    multiFetcher
  );

  const productsDataFix: ProductCartDataFinal[] = productsFix
    ? productsFix.map((product) => {
        const productCartTemp = products.filter(
          (productCartTemp) => productCartTemp.id === product.id
        );
        return {
          ...product,
          ...productCartTemp[0],
          id: undefined,
          key: product.id,
        };
      })
    : [];

  const [skip, setSkip] = useState<number>(0);
  const productsFinal = batchReduce(productsDataFix, LIMIT_PRODUCT_CART);
  const currentPage = skip / LIMIT_PRODUCT_CART + 1;
  const maxPage = Math.ceil(productsDataFix.length / LIMIT_PRODUCT_CART);

  const firstName = idx(dataUser, (_) => _.firstName) || "";
  const lastName = idx(dataUser, (_) => _.lastName) || "";

  const handleParams = (pagination: PaginationType) => {
    setSkip((prevState) => prevState + pagination);
  };

  const columns: TableColumnsType<ProductCartDataFinal> = [
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
      title: "Price Cart Item",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: "Quantity Cart Item",
      dataIndex: "quantity",
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "Total Price Cart Item",
      dataIndex: "total",
      sorter: (a, b) => a.total - b.total,
    },
    {
      title: "Discount Percentage",
      dataIndex: "discountPercentage",
      sorter: (a, b) => a.discountPercentage - b.discountPercentage,
    },
    {
      title: "Discount Total Price Cart Item",
      dataIndex: "discountedPrice",
      sorter: (a, b) => a.discountedPrice - b.discountedPrice,
    },
    {
      title: "Available Stock",
      dataIndex: "stock",
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => a.category.length - b.category.length,
    },
  ];

  const cartData: CartData = {
    key: id,
    total,
    discountedTotal,
    totalProducts,
    totalQuantity,
    userId,
    products: products.map((cartProduct) => {
      return {
        ...cartProduct,
        id: undefined,
        key: cartProduct.id,
      };
    }),
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Space direction="vertical" size={"large"}>
        <Space direction="vertical" size={"small"}>
          <Link prefetch={true} href={"/carts"}>
            <LeftOutlined />
            Back
          </Link>
          <Title level={5} style={{ margin: 0 }}>
            {`Cart ${cartData.key}`}
          </Title>
        </Space>
        <Title level={5} style={{ margin: 0 }}>
          Detail
        </Title>
      </Space>
      <Card
        style={{ width: "100%", backgroundColor: "#eee" }}
        bodyStyle={{ padding: 16 }}
      >
        <Row justify={"space-between"}>
          <Spin spinning={loadingUser}>
            <Space direction="horizontal" size={"small"}>
              <Text>{"User:"}</Text>
              <Text strong>
                {firstName}&nbsp;{lastName}
              </Text>
            </Space>
          </Spin>
          <Spin spinning={loadingCart}>
            <Space direction="horizontal" size={"small"}>
              <Text>{"Total Price:"}</Text>
              <Text strong>{cartData.total}</Text>
            </Space>
          </Spin>
          <Spin spinning={loadingCart}>
            <Space direction="horizontal" size={"small"}>
              <Text>{"Total Discount:"}</Text>
              <Text strong>{cartData.discountedTotal}</Text>
            </Space>
          </Spin>
        </Row>
      </Card>
      <Spin spinning={loadingProductCart}>
        <Title level={5} style={{ margin: 0 }}>
          Products
        </Title>
      </Spin>
      <Table
        columns={columns}
        dataSource={productsFinal[currentPage - 1]}
        loading={loadingProductCart}
        pagination={false}
        bordered
        scroll={{ x: "100vh" }}
        style={{ width: "100%" }}
      />
      <Spin spinning={loadingProductCart}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "end",
          }}
        >
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
    </div>
  );
}
