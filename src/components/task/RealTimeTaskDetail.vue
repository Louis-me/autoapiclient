<template>
    <div class="TasksDetail">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>任务管理</el-breadcrumb-item>
            <el-breadcrumb-item>实时任务</el-breadcrumb-item>
            <el-breadcrumb-item>任务详情</el-breadcrumb-item>

        </el-breadcrumb>

        <el-card class="box-card">
            <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item label="用例名">
                                <span>{{ props.row.name }}</span>
                            </el-form-item>
                            <el-form-item label="url">
                                <span>{{ props.row.url }}</span>
                            </el-form-item>
                            <el-form-item label="请求方法">
                                <span>{{ props.row.method }}</span>
                            </el-form-item>
                             <el-form-item label="入参">
                                <span>
                                     <json-viewer :value="props.row.params"></json-viewer>
                                </span>
                            </el-form-item>
                            <el-form-item label="期望结果">
                                <span>{{ props.row.hope }}</span>
                            </el-form-item>
                            <el-form-item label="实际结果">
                                <span>
                                     <json-viewer :value="props.row.fact"></json-viewer>
                                </span>
                            </el-form-item>
                            <el-form-item label="是否通过">
                                <span>{{ props.row.result }}</span>
                            </el-form-item>                          
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column
                    label="用例名称"
                    prop="name">
                </el-table-column>
                <el-table-column
                    label="url"
                    prop="url">
                </el-table-column>
                <el-table-column
                    label="是否通过"
                    prop="result">
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<style>
  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>


<script>
  export default {
    data() {
      return {
        id: this.$route.params.id,// 任务id,RealTimeTask.vue传过来的
        tableData: [],
        data: {"code": 1}
      }
    },
    created(){ 
        this.getTaskDetail()
    },
     methods:{ 
         async getTaskDetail(){
            const {data:res}  = await this.$http.get('real_time_task_detail/'+this.id,)
            if (res.code != 1){
                return this.$message.erro("获取列表失败")
            }
            this.tableData = res.data
        },
  
     },
  }
</script>