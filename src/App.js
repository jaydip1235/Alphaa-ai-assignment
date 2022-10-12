import React,{useState,useEffect} from 'react';
import axios from 'axios';
import ReactEcharts from "echarts-for-react";
import './App.css';


function App() {
 
  const [data2021,setData2021]=useState([]);
  const [data2022,setData2022]=useState([]);
  const [profit2021,setProfit2021]=useState(0);
  const [profit2022,setProfit2022]=useState(0);
  const [loss2022,setLoss2022]=useState(0);
  const [loss2021,setLoss2021]=useState(0);
  const [year,setYear]=useState([]);
  const [yr,setYr]=useState();

  
  const reverseSign = (temp2021) =>{
    for(let i=0;i<temp2021.length;i++){
      temp2021[i].sale *=-1;
    }
  }

  const GetSortOrder = (prop) => {    
    return function(a, b) {    
        if (a[prop] < b[prop]) {    
            return 1;    
        } else if (a[prop] > b[prop]) {    
            return -1;    
        }    
        return 0;    
    }    
}  
  useEffect(()=>{
    axios.get("https://run.mocky.io/v3/e2ffac92-48e0-4826-a59f-bf76fc727383")
    .then((res)=>{
      console.log(res.data.data);
      let temp2021=[];
      let temp2022=[];
      let sum2021=0,sum2022=0,p2021=0,p2022=0,l2021=0,l2022=0;
      for(let i=0;i<res.data.data.length;i++){
        let obj = res.data.data[i];
        if(i==0){
        temp2021.push({label : obj.subcategory,sale : parseFloat(obj.d__2021sale)});
        sum2021+=parseFloat(obj.d__2021sale);
        p2021+=parseFloat(obj.d__2021sale);
        temp2022.push({label : obj.subcategory,sale : parseFloat(obj.d__2022sale)});
        sum2022+=parseFloat(obj.d__2022sale);
        p2022+=parseFloat(obj.d__2022sale);
        }else{
        let pre = res.data.data[i-1];
        
        temp2021.push({label : obj.subcategory,sale : parseFloat(obj.d__2021sale)-pre.d__2021sale});
        if( parseFloat(obj.d__2021sale)-pre.d__2021sale>0)p2021+= parseFloat(obj.d__2021sale)-pre.d__2021sale;
        else l2021+= parseFloat(obj.d__2021sale)-pre.d__2021sale;
        sum2021+= parseFloat(obj.d__2021sale)-pre.d__2021sale;
        temp2022.push({label : obj.subcategory,sale : parseFloat(obj.d__2022sale)-pre.d__2022sale});
        if(parseFloat(obj.d__2022sale)-pre.d__2022sale>0)p2022+=parseFloat(obj.d__2022sale)-pre.d__2022sale;
        else l2022+=parseFloat(obj.d__2022sale)-pre.d__2022sale;
        sum2022+=parseFloat(obj.d__2022sale)-pre.d__2022sale;
        }
      }
      if(sum2021<0){
        reverseSign(temp2021);
        temp2021.sort(GetSortOrder("sale"));
      }else{
        temp2021.sort(GetSortOrder("sale"));
      }

      if(sum2022<0){
        reverseSign(temp2022);
        temp2022.sort(GetSortOrder("sale"));
      }else{
        temp2022.sort(GetSortOrder("sale"));
      }
      
      //console.log(sum2022);
      setProfit2021(p2021);
      setProfit2022(p2022);
      setLoss2021(l2021);
      setLoss2022(l2022);
      setData2021(temp2021);
      setData2022(temp2022);
      setYear(temp2021)
      setYr("2021");
    }).catch((err)=>{
      console.log(err);
      alert("Something went wrong!");
    })
  },[])


var data = [];
var labels = [];
for(let i=0;i<year.length;i++){
  data.push(parseInt(year[i].sale));
  labels.push(year[i].label);
}
var help = [];
var positive = [];
var negative = [];
for (var i = 0, sum = 0; i < data.length; ++i) {
  if (data[i] >= 0) {
    positive.push(data[i]);
    negative.push('-');
  } else {
    positive.push('-');
    negative.push(-data[i]);
  }

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
  title: {
    text: 'Waterfall'
  },

  legend: {
    data: ['positive', 'negative']
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    },
    formatter: function (params) {
      console.log(params)
      let tar;
      if (params[1].value !== '-') {
        tar = params[1];
      } else {
        tar = params[2];
      }
      return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
    }
  },







  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },

  xAxis: {
    type: 'category',
    splitLine: { show: false },
    data: labels
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      type: 'bar',
      stack: 'all',
      itemStyle: {
        normal: {
          barBorderColor: 'rgba(0,0,0,0)',
          color: 'rgba(0,0,0,0)'
        },
        emphasis: {
          barBorderColor: 'rgba(0,0,0,0)',
          color: 'rgba(0,0,0,0)'
        }
      },
      data: help
    },
    {
      name: 'positive',
      type: 'bar',
      stack: 'all',
      data: positive,
      itemStyle: {
        color: '#008000'
      },
      label: {
        show: true,
        position: 'top'
      },
    },
    {
      name: 'negative',
      type: 'bar',
      stack: 'all',
      data: negative,
      itemStyle: {
        color: '#f33'
      },
      label: {
        show: true,
        position: 'bottom'
      },

    }
  ],

};

  return (
    <>
    {/* <pre>{JSON.stringify(data2021)}</pre> */}
    <nav class="navbar navbar-light bg-primary">
  <div class="container-fluid">
    <span class="navbar-brand text-white nph1 m-auto">Jaydip Dey's submission</span>
  </div>
</nav>
    <div className="row">
      <div className="col-lg-12 col-md-12 col-sm-12 col-12">
        <select
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Font size"
              onChange={(e) => {
                if(e.target.value=="data2021"){setYear(data2021); setYr("2021");}
                else {setYear(data2022); setYr("2022")};
              }}
              className="w-100"
            >
              <option value="data2021">2021</option>
              <option value="data2022">2022</option>
            </select>
      </div>
    </div>
    
     <div className="row">
      <div class="col-lg-8 col-md-8 col-sm-12 col-12">
        <ReactEcharts option={option} style={{height:"100vh"}}/>
    </div>
     <div class="col-lg-4 col-md-4 col-sm-12 col-12">
      <div style={{height:"100vh",backgroundColor:"#F5F5F5"}}>
          <div className="ps-1 pb-2 pt-2" >
            <h2>Net Change</h2>
          </div>
          <div className="d-flex justify-content-center align-items-start flex-column" style={{backgroundColor:"white"}}>
            <div className="border-top border-start border-end border-4 border-dark pb-3 w-100"><h2>Profit: {yr=="2021" ? parseInt(profit2021) : parseInt(profit2022)}</h2></div>
            <div className="border-top border-start border-end border-4 border-dark pb-3 w-100"><h2>Loss: {yr=="2021" ? parseInt(loss2021) : parseInt(loss2022)}</h2></div>
            <div className="border border-4 border-dark pb-3 w-100"><h2>Net: {yr=="2021" ? parseInt(profit2021+loss2021) : parseInt(profit2022+loss2022)}</h2></div>
          </div>
      </div>
      </div>
    </div>

 

    </>
  );
}

export default App;
