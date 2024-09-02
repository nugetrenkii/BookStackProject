import ReactApexChart from "react-apexcharts";
import { Row, Col, Typography } from "antd";
// import eChart from "./configs/eChart";
import { useEffect, useState } from "react";

function EChart(props) {
  const { Title, Paragraph } = Typography;
  const [eChart, setEChart] = useState(
    {
      series: [
        {
          name: "Users",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          color: "#fff",
        },
      ],

      options: {
        chart: {
          type: "bar",
          width: "100%",
          height: "auto",

          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            borderRadius: 5,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 1,
          colors: ["transparent"],
        },
        grid: {
          show: true,
          borderColor: "#ccc",
          strokeDashArray: 2,
        },
        xaxis: {
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
          labels: {
            show: true,
            align: "right",
            minWidth: 0,
            maxWidth: 160,
            style: {
              colors: [
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
              ],
            },
          },
        },
        yaxis: {
          labels: {
            show: true,
            align: "right",
            minWidth: 0,
            maxWidth: 160,
            style: {
              colors: [
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
              ],
            },
          },
        },

        tooltip: {
          y: {
            formatter: function (val) {
              return val + " user";
            },
          },
        },
      },
    }
  )

  useEffect(() => {
    console.log(props?.users);
    const eChart = {
      series: [
        {
          name: "Users",
          data: props?.users?.statistical,
          color: "#fff",
        },
      ],

      options: {
        chart: {
          type: "bar",
          width: "100%",
          height: "auto",

          toolbar: {
            show: false,
          },
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
            borderRadius: 5,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          show: true,
          width: 1,
          colors: ["transparent"],
        },
        grid: {
          show: true,
          borderColor: "#ccc",
          strokeDashArray: 2,
        },
        xaxis: {
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
          labels: {
            show: true,
            align: "right",
            minWidth: 0,
            maxWidth: 160,
            style: {
              colors: [
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
              ],
            },
          },
        },
        yaxis: {
          labels: {
            show: true,
            align: "right",
            minWidth: 0,
            maxWidth: 160,
            style: {
              colors: [
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
                "#fff",
              ],
            },
          },
        },

        tooltip: {
          y: {
            formatter: function (val) {
              return val + " user";
            },
          },
        },
      },
    };
    setEChart(eChart)
  },[props])
  return (
    <>
      <div className="linechart">
        <div>
          <Title level={5}>Active Users</Title>
          <Paragraph className="lastweek">
            than last month <span style={{color : props?.users?.diff < 0 ? "red" : "#52c41a"}}>{props?.users?.diff}%</span>
          </Paragraph>
        </div>
      </div>
      <div id="chart">
        <ReactApexChart
          className="bar-chart"
          options={eChart.options}
          series={eChart.series}
          type="bar"
          height={350}
        />
      </div>
    </>
  );
}

export default EChart;
