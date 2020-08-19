const api_host = 'http://10.10.10.1:8010'
document.getElementById('type_title').innerHTML = decodeURI(GetRequest('cur_status'));

function GetRequest(name) {
	let url = window.location.search; //获取url中"?"符后的字串
	if (url.indexOf("?") !== -1) {
		let str = url.substr(1);
		if(str.indexOf("#")!== -1){
			str = str.substr(0);
		}
		let strs = str.split("&");
		for(let i = 0; i < strs.length; i ++) {
			if(strs[i].indexOf(name) !== -1){
				return strs[i].split("=")[1];
			}
		}
	}
	return null;
}

function drawLayer02Label(canvasObj,text,textBeginX,lineEndX){
	var colorValue = '#04918B';

	var ctx = canvasObj.getContext("2d");

	ctx.beginPath();
	ctx.arc(35,55,2,0,2*Math.PI);
	ctx.closePath();
	ctx.fillStyle = colorValue;
	ctx.fill();

	ctx.moveTo(35,55);
	ctx.lineTo(60,80);
	ctx.lineTo(lineEndX,80);
	ctx.lineWidth = 1;
	ctx.strokeStyle = colorValue;
	ctx.stroke();

	ctx.font='12px Georgia';
	ctx.fillStyle = colorValue;
	ctx.fillText(text,textBeginX,92);
}

//接入占比





function drawLegend(pointColor,pointY,text){
	var ctx = $("#layer03_left_01 canvas").get(0).getContext("2d");
	ctx.beginPath();
	ctx.arc(20,pointY,6,0,2*Math.PI);
	ctx.fillStyle = pointColor;
	ctx.fill();
	ctx.font='20px';
	ctx.fillStyle = '#FEFFFE';
	ctx.fillText(text,40,pointY+3);
}


//存储
function renderLayer03Right(){
	drawLayer03Right($("#layer03_right_chart01 canvas").get(0),"#027825",1);
	drawLayer03Right($("#layer03_right_chart02 canvas").get(0),"#006DD6",0);
	drawLayer03Right($("#layer03_right_chart03 canvas").get(0),"#238681",0);
}

function drawLayer03Right(canvasObj,colorValue,rate){
	var ctx = canvasObj.getContext("2d");
    
	var circle = {
        x : 65,    //圆心的x轴坐标值
        y : 80,    //圆心的y轴坐标值
        r : 60      //圆的半径
    };

	//画扇形
	//ctx.sector(circle.x,circle.y,circle.r,1.5*Math.PI,(1.5+rate*2)*Math.PI);
	//ctx.fillStyle = colorValue;
	//ctx.fill();

	ctx.beginPath();
	ctx.arc(circle.x,circle.y,circle.r,0,Math.PI*2)
	ctx.lineWidth = 10;
	ctx.strokeStyle = '#052639';
	ctx.stroke();
	ctx.closePath();

	ctx.beginPath();
	ctx.arc(circle.x,circle.y,circle.r,1.5*Math.PI,(1.5+rate*2)*Math.PI)
	ctx.lineWidth = 10;
	ctx.lineCap = 'round';
	ctx.strokeStyle = colorValue;
	ctx.stroke();
	ctx.closePath();
    
	ctx.fillStyle = 'white';
	ctx.font = '20px Calibri';
	ctx.fillText(rate*100+'%',circle.x-15,circle.y+10);

}


function renderChartBar01(){
	let color_machine = ['#0175EE',
		'#D89446',
		'#373693',
		'#25AE4F',
		'#06B5C6',
		'#009E9A',
		'#AC266F']

	let chartData = [];
	let chartName = []
	$.ajax({
		url: api_host + '/province_info',
		type: 'GET',
		data: {cur_status: decodeURI(GetRequest('cur_status'))},
		dataType: 'json',
		success: function(res){
			let res_data = res['data']
			let res_sort = Object.keys(res_data).sort(function(a,b){ return res_data[b] - res_data[a];});
			let others_total = 0
			for(let i = 0; i < res_sort.length; i++){
				if(i < 6){
					chartData.push(res_data[res_sort[i]]);
					chartName.push(res_sort[i]);
				} else others_total += res_data[res_sort[i]];
			}
			chartData.push(others_total);
			chartName.push('其他');
			for(let i = 0; i < 7; i++){
				drawLegend(color_machine[i],25 * i + 25,chartName[i]);
			}
			let myChart = echarts.init(document.getElementById("layer03_left_02"));
			myChart.setOption(
				{
					title : {
						text: '',
						subtext: '',
						x:'center'
					},
					tooltip : {
						trigger: 'item',
						formatter: "{b} : {d}%"
					},
					legend: {
						show:false,
						x : 'center',
						y : 'bottom',
						data:chartName,
					},
					toolbox: {
					},
					label:{
						normal:{
							show: true,
							formatter: "{b} \n{d}%"
						}
					},
					calculable : true,
					color: color_machine,
					series : [
						{
							name:'',
							type:'pie',
							radius : [40, 80],
							center : ['50%', '50%'],
							//roseType : 'area',
							data:[
								{value:chartData[0], name:chartName[0]},
								{value:chartData[1], name:chartName[1]},
								{value:chartData[2], name:chartName[2]},
								{value:chartData[3], name:chartName[3]},
								{value:chartData[4], name:chartName[4]},
								{value:chartData[5], name:chartName[5]},
								{value:chartData[6], name:chartName[6]}
							]
						}
					]
				}
			);
		},
		error: function(res){
			alert('Network Error');
		}
	});

}

/*
function renderChartBar02(){
	var myChart = echarts.init(document.getElementById("layer03_left_03"));
		myChart.setOption(
					{
						title : {
							text: '',
							subtext: '',
							x:'center'
						},
						tooltip : {
							show:true,
							trigger: 'item',
							formatter: "上线率<br>{b} : {c} ({d}%)"
						},
						legend: {
							show:false,
							orient: 'vertical',
							left: 'left',
							data: ['A','B','C','D','E','F','G']
						},
						series : [
							{
								name: '',
								type: 'pie',
								radius : '50%',
								center: ['50%', '60%'],
								data:[
									{value:7600, name:'A'},
									{value:6600, name:'B'},
									{value:15600, name:'C'},
									{value:5700, name:'D'},
									{value:4600, name:'E'},
									{value:4600, name:'F'},
									{value:3500, name:'G'}
								],
								itemStyle: {
									emphasis: {
										shadowBlur: 10,
										shadowOffsetX: 0,
										shadowColor: 'rgba(0, 0, 0, 0.5)'
									}
								}
							}
						],
						color:[COLOR.MACHINE.TYPE_A,COLOR.MACHINE.TYPE_B,COLOR.MACHINE.TYPE_C,COLOR.MACHINE.TYPE_D,COLOR.MACHINE.TYPE_E,COLOR.MACHINE.TYPE_F,COLOR.MACHINE.TYPE_G]
					}
		);
}*/

function renderLayer04Left(){
	let dataAmountChart = echarts.init(document.getElementById("layer04_left_chart"));
	let dataAmount = [];
	let dataLength = 34
	for(let i = 0; i <= dataLength; i++)dataAmount.push(0);

	let dataAmountOption =	{
		title: {
			text: ''
		},
		legend: {
			data:[]
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '5%',
			top:'4%',
			containLabel: true
		},
		xAxis :
			{
				type : 'category',
				boundaryGap : false,
				data : getSeconds(dataLength),
				axisLabel:{
					textStyle:{
						color:"white", //刻度颜色
						fontSize:8  //刻度大小
					},
					rotate:45,
					interval:2
				},
				axisTick:{show:false},
				axisLine:{
					show:true,
					lineStyle:{
						color: '#0B3148',
						width: 1,
						type: 'solid'
					}
				}
			},
		yAxis :
			{
				type : 'value',
				axisTick:{show:false},
				axisLabel:{
					textStyle:{
						color:"white", //刻度颜色
						fontSize:8  //刻度大小
					}
				},
				axisLine:{
					show:true,
					lineStyle:{
						color: '#0B3148',
						width: 1,
						type: 'solid'
					}
				},
				splitLine:{
					show:false
				}
			},
		tooltip:{
			formatter:'{c}',
			backgroundColor:'#FE8501'
		},
		series : [
			{
				name:'',
				type:'line',
				smooth:true,
				areaStyle:{
					normal:{
						color:new echarts.graphic.LinearGradient(0, 0, 0, 1, [{offset: 0, color: '#026B6F'}, {offset: 1, color: '#012138' }], false),
						opacity:0.2
					}
				},
				itemStyle : {
					normal : {
						color:'#009991'
					},
					lineStyle:{
						normal:{
							color:'#009895',
							opacity:1
						}
					}
				},
				symbol:'none',
			}
		]
	};
	dataAmountChart.setOption(dataAmountOption);
	function getDataAmount() {
		$.ajax({
			url: api_host + '/real_time_data_amount',
			async:true,
			type: 'get',
			success: function (res) {
				dataAmount.push(res['data']);
				dataAmount.shift();
				dataAmountOption.series[0].data = dataAmount;
				dataAmountOption.xAxis.data = getSeconds(dataLength);
				dataAmountChart.setOption(dataAmountOption);
			},
			error(res){
				dataAmount.push(0);
				dataAmount.shift();
				dataAmountOption.series[0].data = dataAmount;
				dataAmountOption.xAxis.data = getSeconds(dataLength);
				dataAmountChart.setOption(dataAmountOption);
			}
		})
	}
	setInterval(getDataAmount,1000);

}

function renderLayer04Right(){
	let generalDataChart = echarts.init(document.getElementById("layer04_right_chart"));
	let tmpData1 = [0, 0, 0, 0, 0, 0, 0];
	let tmpData2 = [0, 0, 0, 0, 0, 0, 0];
	let tmpData3 = [0, 0, 0, 0, 0, 0, 0];
	let generalData1 = tmpData1.concat(tmpData2, tmpData3);
	let generalData2 = tmpData2.concat(tmpData1, tmpData3);
	let generalData3 = tmpData3.concat(tmpData2, tmpData1);
	let dataLength = 21;
	let generalDataOption = {
			title: {
				text: ''
			},
			tooltip: {
				trigger: 'axis'
			},
			legend: {
				top:20,
				right:5,
				textStyle:{
					color:'white'
				},
				orient:'vertical',
				data:[
						{name:'传感器1',icon:'circle'},
						{name:'传感器2',icon:'circle'},
						{name:'传感器3',icon:'circle'}
					]
			},
			grid: {
				left: '3%',
				right: '16%',
				bottom: '3%',
				top:'3%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				boundaryGap: false,
				axisTick:{show:false},
				axisLabel:{
					textStyle:{
						color:"white", //刻度颜色
						fontSize:8  //刻度大小
						}
				},
				axisLine:{
					show:true,
					lineStyle:{
						color: '#0B3148',
						width: 1,
						type: 'solid'
					}
				},
				data: getSeconds(dataLength)
			},
			yAxis: {
				type: 'value',
				axisTick:{show:false},
				axisLabel:{
					textStyle:{
						color:"white", //刻度颜色
						fontSize:8  //刻度大小
						}
				},
				axisLine:{
					show:true,
					lineStyle:{
						color: '#0B3148',
						width: 1,
						type: 'solid'
					}
				},
				splitLine:{
					show:false
				}
			},
			series: [
						{
							name:'传感器1',
							type:'line',
							itemStyle : {  
									normal : {  
									color:'#F3891B'
								},
								lineStyle:{
									normal:{
									color:'#F3891B',
									opacity:1
										}
								}
							},  
							data:generalData1
						},
						{
							name:'传感器2',
							type:'line',
							itemStyle : {  
									normal : {  
									color:'#006AD4'
								},
								lineStyle:{
									normal:{
									color:'#F3891B',
									opacity:1
										}
								}
							},
							data:generalData2
						},
						{
							name:'传感器3',
							type:'line',
							itemStyle : {  
									normal : {  
									color:'#009895'
								},
								lineStyle:{
									normal:{
									color:'#009895',
									opacity:1
										}
								}
							},
							data:generalData3
						}
					]
	}
	generalDataChart.setOption(generalDataOption);

	function getDataAmount() {
		$.ajax({
			url: api_host + '/real_time_sensor',
			async:true,
			type: 'get',
			success: function (res) {
				generalData1.push(res['data'][0]);
				generalData2.push(res['data'][1]);
				generalData3.push(res['data'][2]);
			},
			error(res){
				generalData1.push(0);
				generalData2.push(0);
				generalData3.push(0);
			}
		})
		generalData1.shift();
		generalData2.shift();
		generalData3.shift();
		generalDataOption.xAxis.data = getSeconds(dataLength);
		generalDataOption.series[0].data = generalData1;
		generalDataOption.series[1].data = generalData2;
		generalDataOption.series[2].data = generalData3;
		generalDataChart.setOption(generalDataOption);
	}
	setInterval(getDataAmount,1000);

}

function get10MinutesScale()
{
	var currDate = new Date();
	var odd = currDate.getMinutes()%10;
	var returnArr = new Array();
	currDate.setMinutes(currDate.getMinutes()-odd);
	for(var i = 0; i <7; i++){
		returnArr.push(currDate.getHours()+":"+(currDate.getMinutes()<10?("0"+currDate.getMinutes()):currDate.getMinutes()));
		currDate.setMinutes(currDate.getMinutes()-10);
	}
	return returnArr;
}


function getLatestDays(num)
{
	var currentDay = new Date();
	var returnDays = [];
	for (var i = 0 ; i < num ; i++)
	{
		currentDay.setDate(currentDay.getDate() - 1);
		returnDays.push((currentDay.getMonth()+1)+"/"+currentDay.getDate());
	}
	returnDays.reverse();
	return returnDays;
}

function getSeconds(num)
{
	var currentTime = new Date();
	var returnTimes = [];
	for (var i = 0; i < num; i++){
		currentTime.setSeconds(currentTime.getSeconds() - 1);
		returnTimes.push((currentTime.getHours()+":"+currentTime.getMinutes()+":"+currentTime.getSeconds()));
	}
	returnTimes.reverse();
	return returnTimes;
}