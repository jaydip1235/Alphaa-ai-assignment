import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactEcharts from "echarts-for-react";
import "./App.css";
import apidata from "./apidata";
function App() {
  const [profit, setProfit] = useState(0);
  const [loss, setLoss] = useState(0);
  const [net, setNet] = useState(0);
  const [processedData, setProcessedData] = useState([]);
  const [rawData,setRawData]=useState(apidata);

  useEffect(() => {
    getApiData("2021", "2022");
  }, []);

  const getApiData = (s, e) => {
        let p = 0;
        let n = 0;
        let l = 0;
        let newData=[]
        for (let i = 0; i < rawData.length; i++) {
          let obj = rawData[i];
          obj.net = obj[`d__${e}sale`] - obj[`d__${s}sale`];
          n += obj.net;
          if (obj.net >= 0)p+=obj.net;
          else l+=obj.net;
          newData.push(obj);
        }
        console.log(newData);
        
  if (n >= 0) {
    newData.sort(function (x, y) {
      return y.net - x.net;
    });
  } else {
    newData.sort(function (x, y) {
      return x.net - y.net;
    });
  }
   console.log(newData);    
   setProcessedData(newData);
   setProfit(p);
   setLoss(l);
   setNet(n);

  };

  var data = [];
  var labels = [];
  const flag = net < 0 ? -1 : 1;
  for (let i = 0; i < processedData.length; i++) {
    data.push(flag*parseInt(processedData[i].net));
    labels.push(processedData[i].subcategory);
  }
  
  var help = [];
  var positive = [];
  var negative = [];
  var total=[];
  for (var i = 0, sum = 0; i < data.length; ++i) {
    if (data[i] >= 0) {
      positive.push(data[i]);
      negative.push("-");
    } else {
      positive.push("-");
      negative.push(-data[i]);
    }
    total.push("-");
    if (i === 0) {
      help.push(0);
    } else {
      sum += data[i - 1];
      if (data[i] < 0) {
        help.push(sum + data[i]);
      } else {
        help.push(sum);
      }
    }
  }
  
  let option = {
    // title: {
    //   text: "Waterfall",
    // },

    // legend: {
    //   data: ["positive", "negative","net"],
    // },
    // tooltip: {
    //   trigger: "axis",
    //   axisPointer: {
    //     type: "shadow",
    //   },
    //   formatter: function (params) {
    //     console.log(params);
    //     let tar;
    //     if (params[1].value !== "-") {
    //       tar = params[0];
    //     } else {
    //       tar = params[1];
    //     }
    //     return tar.name + "<br/>" + tar.seriesName + " : " + tar.value;
    //   },
    // },

    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },

    xAxis: {
      type: "category",
      splitLine: { show: false },
      data: [...labels,"Net"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        type: "bar",
        stack: "all",
        itemStyle: {
          normal: {
            barBorderColor: "rgba(0,0,0,0)",
            color: "rgba(0,0,0,0)",
          },
          emphasis: {
            barBorderColor: "rgba(0,0,0,0)",
            color: "rgba(0,0,0,0)",
          },
        },
        data: help,
      },
      {
        name: "positive",
        type: "bar",
        stack: "all",
        data: positive,
        itemStyle: {
          color: flag === -1 ? "#f32" : "#008000"
        },
        label: {
          show: true,
          position: "top",
        },
      },
      {
        name: "negative",
        type: "bar",
        stack: "all",
        data: negative,
        itemStyle: {
          color: flag === -1 ? "#008000" : "#f32"
        },
        label: {
          show: true,
          position: "bottom",
        },
      },
        {
          name: "summary",
          type: "bar",
          stack: "all",
          data: [...total, parseInt(flag * net)],
          itemStyle: {
            color: "#004"
          }
          , label: {
          show: true,
          position: "top",
        },
        },
    ],
  };

  return (
    <>
      {/* <pre>{JSON.stringify(data2021)}</pre> */}
      <nav class="navbar navbar-light bg-primary">
        <div class="container-fluid">
          <span class="navbar-brand text-white nph1 m-auto">
            Jaydip Dey's submission
          </span>
        </div>
      </nav>

      <div className="row">
        <div class="col-lg-8 col-md-8 col-sm-12 col-12">
          <ReactEcharts option={option} style={{ height: "100vh" }} />
        </div>
        <div class="col-lg-4 col-md-4 col-sm-12 col-12">
      <div style={{height:"100vh",backgroundColor:"#F5F5F5"}}>
          <div className="ps-1 pb-2 pt-2" >
            <h2>Net Change</h2>
          </div>
          <div className="d-flex justify-content-center align-items-start flex-column" style={{backgroundColor:"white"}}>
            <div className="border-top border-start border-end border-4 border-dark pb-3 w-100"><h2>Profit: {profit}</h2></div>
            <div className="border-top border-start border-end border-4 border-dark pb-3 w-100"><h2>Loss: {loss}</h2></div>
            <div className="border border-4 border-dark pb-3 w-100"><h2>Net: {net}</h2></div>
          </div>
          <h5>JSON Array Data</h5>
          <textarea resize= "none" style={{height: "60%",resize: "none"}}  onChange = {(e)=>{setRawData(JSON.parse(e.target.value))}}className="w-100 ">{JSON.stringify(apidata)}</textarea>
          <button type="button" class="btn btn- ms-2 mb-1" onClick={e=>getApiData("2021","2022")}>Click to see changes</button>
      </div>
      </div>
      </div>
    </>
  );
}

export default App;
