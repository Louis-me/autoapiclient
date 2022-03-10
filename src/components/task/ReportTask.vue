<template>
  <div class="ReportTasks">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item >报告管理</el-breadcrumb-item>
            <el-breadcrumb-item>图形报告分析</el-breadcrumb-item>
        </el-breadcrumb>
        <div id="echarts_module" style="min-height:400px;"></div>
        <div id="echarts_task" style="min-height:400px;"></div>
        <div id="echarts_top_10_slow">
                <el-col style="padding:10px">
                    响应时间最慢的top10
                        <el-button type="primary" @click="reportExport()">导出</el-button>
                </el-col>
            </el-row>
           <el-table  :data="caseList">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="用例名词" prop="name"></el-table-column>
                <el-table-column label="结果" prop="result"></el-table-column>
                <el-table-column label="耗时(MS)" prop="sum_time"></el-table-column>
           </el-table>
        </div>

    </div>
</template>
<script>
    var echarts = require('echarts');

  export default {
    data() {
      return {
         caseList:[],
      }
    },
    mounted() {
      this.reports_module_case();
      this.report_task();
    },
    created() {
     this.getCaseList();
    },
    methods: {
      async reports_module_case() {
           const {data:res}  = await this.$http.get('reports_module_case')
            if (res.code != 1){
                return this.$message.error("获取数据失败")
            }
          // 初始化echarts实例
          let myChart = echarts.init(document.getElementById('echarts_module'))
       myChart.setOption({
          title: {
            text: res.data.title.text
          },
          tooltip: {},
          xAxis: {
            data: res.data.xAxis.data,

          },
          yAxis: {},
          series: [
              {
                name: res.data.series[0].name,
                type: res.data.series[0].type,
                data: res.data.series[0].data,
                barWidth: 30,
              }
          ]
        });
     
      },
       async report_task() {
           const {data:res}  = await this.$http.get('report_task')
            if (res.code != 1){
                return this.$message.erro("获取数据失败")
            }
          // 初始化echarts实例
          let myChart = echarts.init(document.getElementById('echarts_task'))
       myChart.setOption({
         title: {
            text: "任务执行统计",
          },
  xAxis: {
    data: res.data.xAxis_data,
    boundaryGap: true,
    axisLabel: {
            rotate: 20,
            color: '#333',
			      
          }
  },
  yAxis: {},
  tooltip: {"show": true},
  legend: {
data:['成功','失败'],
},
  series: [
    {
      data: res.data.passed,
      type: 'bar',
      barWidth: 30,
      name: '成功',
      stack: 'x',
         label:{
                normal:{
                    show:true,
                    position:'inside',
                    textStyle:{
                        color:'black',
                    },
                    formatter:function(params){
                        return params.value
                    }
                }
            }
    },
    {
      color:"red",
      name: '失败',
      data: res.data.failed,
      type: 'bar',
      stack: 'x',
    label:{
                normal:{
                    show:true,
                    position:'inside',
                    textStyle:{
                        color:'black',
                    },
                    formatter:function(params){
                        return params.value
                    }
                }
            }
    },

 
  ]
});
     
      },
      async getCaseList(){
            const {data:res}  = await this.$http.get('reports_top_10_slow')
            if (res.code != 1){
                return this.$message.erro("获取用户列表失败")
            }
            this.caseList = res.data
        },
  async reportExport() {
           this.$http.get("reports_top_slow_export", {responseType:"blob"}).then(response => {
	        if(response.statusText=="OK"){
                let downloadURL = this.dataURLtoBlob(response.data)
                let anchor = document.createElement("a")
                //下载时显示的文件名（自定义）
                anchor.download = 'top10最慢接口.xlsx'
                anchor.href = downloadURL
                anchor.click()
                this.$message({type: 'success', message: '下载成功!'})

            } else {
                this.$message({type: 'success', error: '下载失败!'})
            }
	    });

        },
         dataURLtoBlob(encoded){
            const dataBlob = new Blob([encoded]);
            return window.URL.createObjectURL(dataBlob);
        },
    }
  }
</script>
<style lang="less" scoped>


</style>