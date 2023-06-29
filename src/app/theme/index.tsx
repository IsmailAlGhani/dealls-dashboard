import React from "react";
import { ConfigProvider } from "antd";

const testGreenColor = "#52c41a";
const testRedColor = "#ff0000";
const testBlueColor = "#2a9df4";

const withTheme = (node: JSX.Element) => (
  <>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: testBlueColor,
        },
      }}
    >
      <ConfigProvider
        theme={{
          token: {
            borderRadius: 16,
          },
        }}
      >
        {node}
      </ConfigProvider>
    </ConfigProvider>
  </>
);

export default withTheme;
