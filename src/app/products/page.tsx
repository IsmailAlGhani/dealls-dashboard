"use client";
import { useState, useEffect } from "react";
import {
  Space,
  Button,
  Spin,
  Result,
  Input,
  Table,
  TableColumnsType,
  Slider,
} from "antd";
import useSWR from "swr";
import idx from "idx";
import { ProducMap, Product, ProductData, ProductsData } from "../../../type";
import { fetcher } from "../util";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Bar Chart",
    },
  },
};
const { Search } = Input;

const LIMIT_PRODUCT = 4;

enum PaginationType {
  NEXT = LIMIT_PRODUCT,
  PREV = -LIMIT_PRODUCT,
}

interface ProductsProps {
  skip: number;
  search?: string;
}

export default function ProductsPage() {
  const [params, setParams] = useState<ProductsProps>({ search: "", skip: 0 });
  const [dataChartBrandFinal, setDataChartBrandFinal] = useState<Product[]>([]);
  const [dataChartBrandFinalTemp, setDataChartBrandFinalTemp] = useState<
    Product[]
  >([]);
  const { data: dataChartBrand, isLoading: loadingChartBrand } =
    useSWR<ProductsData>(
      `https://dummyjson.com/products?limit=100&select=stock,brand`,
      fetcher
    );
  useEffect(() => {
    if (dataChartBrand) {
      const productsChartData: Product[] =
        idx(dataChartBrand, (_) => _.products) || [];
      const outputCols = productsChartData.reduce((outputCols, currentData) => {
        if (!outputCols[currentData.brand]) {
          outputCols[currentData.brand] = currentData;
        }
        outputCols[currentData.brand].stock =
          outputCols[currentData.brand].stock + currentData.stock;
        return outputCols;
      }, {} as ProducMap);
      setDataChartBrandFinal(Object.values(outputCols));
      setDataChartBrandFinalTemp(Object.values(outputCols));
    }
  }, [dataChartBrand]);
  //   let dataChartBrandFinal = Object.values(outputCols);
  const labels = dataChartBrandFinalTemp.map((dataChart) => dataChart.brand);
  const dataChartStock = dataChartBrandFinalTemp.map(
    (dataChart) => dataChart.stock
  );

  const dataTempChart = {
    labels,
    datasets: [
      {
        label: "Brand",
        data: dataChartStock,
        borderWidth: 1,
        backgroundColor: "#37CAEC",
      },
    ],
  };

  const { data, error, isLoading } = useSWR<ProductsData>(
    `https://dummyjson.com/products${
      params.search ? `/search?q=${params.search}&` : "?"
    }limit=${LIMIT_PRODUCT}&skip=${
      params.skip
    }&select=title,price,stock,brand,category`,
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
      sorter: (a, b) => {
        const aTitle = idx(a, (_) => _.title) || "";
        const bTitle = idx(b, (_) => _.title) || "";
        return aTitle.length - bTitle.length;
      },
    },
    {
      title: "Brand",
      dataIndex: "brand",
      sorter: (a, b) => a.brand.length - b.brand.length,
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => {
        const aPrice = idx(a, (_) => _.price) || 0;
        const bPrice = idx(b, (_) => _.price) || 0;
        return aPrice - bPrice;
      },
    },
    {
      title: "Stock",
      dataIndex: "stock",
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: "Category",
      dataIndex: "category",
      sorter: (a, b) => {
        const aCategory = idx(a, (_) => _.category) || "";
        const bCategory = idx(b, (_) => _.category) || "";
        return aCategory.length - bCategory.length;
      },
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

  const handleSlider = (dataSlider: [number, number]) => {
    setDataChartBrandFinalTemp(
      dataChartBrandFinal.slice(dataSlider[0] + 1, dataSlider[1])
    );
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
    <>
      <Bar options={options} data={dataTempChart} />
      <Slider
        range
        max={dataChartBrandFinal.length}
        defaultValue={[1, dataChartBrandFinal.length]}
        onAfterChange={handleSlider}
      />
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
    </>
  );
}
