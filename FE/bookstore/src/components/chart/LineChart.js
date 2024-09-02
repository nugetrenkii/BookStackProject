/*!
  =========================================================
  * Muse Ant Design Dashboard - v1.0.0
  =========================================================
  * Product Page: https://www.creative-tim.com/product/muse-ant-design-dashboard
  * Copyright 2021 Creative Tim (https://www.creative-tim.com)
  * Licensed under MIT (https://github.com/creativetimofficial/muse-ant-design-dashboard/blob/main/LICENSE.md)
  * Coded by Creative Tim
  =========================================================
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import ReactApexChart from "react-apexcharts";
import { Typography } from "antd";
import { MinusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

function LineChart(props) {
  const { Title, Paragraph } = Typography;
  const [lineChart, setLineChart] = useState(
    {
      series: [
        {
          name: "Total",
          data: [0,0,0,0,0,0,0,0,0,0,0,0],
          offsetY: 0,
        },
        // {
        //   name: "Websites",
        //   data: [30, 90, 40, 140, 290, 290, 340, 230, 400, 340, 230, 400],
        //   offsetY: 0,
        // },
      ],

      options: {
        chart: {
          width: "100%",
          height: 350,
          type: "area",
          toolbar: {
            show: false,
          },
        },

        legend: {
          show: false,
        },

        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },

        yaxis: {
          labels: {
            style: {
              fontSize: "14px",
              fontWeight: 600,
              colors: ["#8c8c8c"],
            },
          },
        },

        xaxis: {
          labels: {
            style: {
              fontSize: "14px",
              fontWeight: 600,
              colors: [
                "#8c8c8c",
                "#8c8c8c",
                "#8c8c8c",
                "#8c8c8c",
                "#8c8c8c",
                "#8c8c8c",
                "#8c8c8c",
                "#8c8c8c",
                "#8c8c8c",
                "#8c8c8c",
                "#8c8c8c",
                "#8c8c8c",
              ],
            },
          },
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
        },

        tooltip: {
          y: {
            formatter: function (val) {
              return val + " VNĐ";
            },
          },
        },
      },
    }

  )

  useEffect(() => {
    console.log(props?.orders);
    const lineChart = {
      series: [
        // {
        //   name: "Order",
        //   data: props?.orders?.statistical,
        //   offsetY: 0,
        // },
        {
          name: "Total",
          data: props?.revenues?.statistical,
          offsetY: 0,
        },
      ],

      options: {
        chart: {
          width: "100%",
          height: 350,
          type: "area",
          toolbar: {
            show: false,
          },
        },

        legend: {
          show: false,
        },

        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },

        yaxis: {
          labels: {
            style: {
              fontSize: "14px",
              fontWeight: 600,
              colors: ["#8c8c8c"],
            },
          },
        },

        xaxis: {
          labels: {
            style: {
              fontSize: "14px",
              fontWeight: 600,
              colors: [
                "#8c8c8c",
                "#8c8c8c",
                "#8c8c8c",
                "#8c8c8c",
                "#8c8c8c",
                "#8c8c8c",
                "#8c8c8c",
                "#8c8c8c",
                "#8c8c8c",
                "#8c8c8c",
                "#8c8c8c",
                "#8c8c8c",
              ],
            },
          },
          categories: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
        },

        tooltip: {
          y: {
            formatter: function (val) {
              return val + " VNĐ";
            },
          },
        },
      },
    }
    setLineChart(lineChart)
  }, [props])
  return (
    <>
      <div className="linechart">
        <div>
          <Title level={5}>Revenues</Title>
          <Paragraph className="lastweek">
            than last month <span className="bnb2">{props?.revenues?.diff}%</span>
          </Paragraph>
        </div>
        <div className="sales">
          <ul>
            <li>{<MinusOutlined />} Total</li>
            {/* <li>{<MinusOutlined />} Sales</li> */}
          </ul>
        </div>
      </div>

      <ReactApexChart
        className="full-width"
        options={lineChart.options}
        series={lineChart.series}
        type="area"
        height={350}
        width={"100%"}
      />                                        
    </>
  );
}

export default LineChart;
