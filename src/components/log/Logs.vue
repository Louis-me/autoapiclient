<template>
    <div class="users">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>在线日志</el-breadcrumb-item>
            <el-breadcrumb-item>日志列表</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
           
            <el-row>
                <el-col :span="4">
                    <div class="grid-content bg-purple">
                        <el-tree :data="logs_file" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
                    </div>
                </el-col>
                <el-col :span="20">
                    <div class="grid-content bg-purple-light">
                        <div style="background-color: black;color: azure; min-height: 500px; overflow: auto;">
                            <div  v-for="item in logs_content">
                                {{item}}
                            </div>
                        </div>
                    </div>
                </el-col>
            </el-row>
           
           
          

        </el-card>
    </div>
</template>
<script>
export default {
    data() {
      return {
        queryInfo: {
          "root":"",
          "name":""
        },
        logs_content: "",
        logs_file: [],
        root: "",
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      };
    },
    created(){
         this.getLogList()
     },
    methods: {
      async handleNodeClick(obj) {
        this.logs_content = ""
        let res = await this.$http.post("log_content/",{root: this.root,name:obj.label})
                if (res.data.code != 1) {
                   return this.$message.error(res.data.msg)
                } else{
                  this.logs_content = res.data.data.content
                }
      },
      async getLogList(){
            const {data:res}  = await this.$http.get('logs',{
})
            if (res.code != 1){
                return this.$message.erro("获取列表失败")
            }
            this.logs_file = res.data.files
            this.root = res.data.root
        },
    }
     
     
      
        
    }
    

</script>
<style lang="less" scoped>


</style>