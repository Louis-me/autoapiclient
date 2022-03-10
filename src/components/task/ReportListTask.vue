<template>
    <div class="users">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
             <el-breadcrumb-item >报告管理</el-breadcrumb-item>
            <el-breadcrumb-item>报告管理</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
           <el-row :gutter="20">
                <el-col :span="7">
                     <el-input placeholder="请输入内容" v-model="queryInfo.query">
                        <el-button slot="append" icon="el-icon-search"
                        @click="searchEvent"></el-button>
                    </el-input>
                </el-col>
            </el-row>
           <el-table  :data="userList">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="名称" prop="name"></el-table-column>
                <el-table-column label="开始时间" prop="start_time"></el-table-column>
                <el-table-column label="耗时" prop="sum_time"></el-table-column>
                <el-table-column label="通过" prop="passed"></el-table-column>
                <el-table-column label="失败" prop="failed"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="reportDetail(scope.row.id)">详情</el-button>
                        <el-button type="text" size="small" @click="reportExport(scope.row.id, scope.row.name)">导出</el-button>
                        <el-button type="text" size="small" @click="delReportEvent(scope.row.id)">删除</el-button>
                     </template>
                </el-table-column>
           </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
    

           

        </el-card>
    </div>
</template>
<script>
    var axios = require('axios');

export default {
    data() {
        return {
            userList:[],
            total: 0, // 用户列表数据总数
            queryInfo: {
                query:'',
                pagesize:10, // 每页显示多少条数据
                pagenum:1 // 当前页码
            },
     
        }
    },
     created(){
         this.getUserList()
     },
     methods:{
         async getUserList(){
            const {data:res}  = await this.$http.get('reports_list',{
                params: this.queryInfo,
                })
            if (res.code != 1){
                return this.$message.erro("获取列表失败")
            }
            this.userList = res.data.list
            this.total = res.data.total_count
        },

        //  监听pagesize的改变事件
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getUserList()
        },
        // 监听页码的改变事件
        handleCurrentChange(newPage) {
            console.log(newPage)
            this.queryInfo.pagenum = newPage
            this.getUserList()
        },
        searchEvent() {
             this.getUserList()
        },
  
        async delReportEvent(id) {
            const confirmResp = await this.$confirm('确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }
            ).catch(err=> err)
            console.log(confirmResp)
            if (confirmResp != "confirm") {
             return this.$message.info("已取消")
            } 

             let res = await this.$http.post("report_detail_del/",{id: id})
                if (res.data.code != 1) {
                   return this.$message.error(res.data.msg)
                } 
                this.$message.success('删除成功')
                this.getUserList()
                
        },
        async reportDetail(id) {
             this.$router.push({
                path:"/reporDetail/"+ id,
            })

        },
        async reportExport(id,name) {
           this.$http.get("report_export/"+id, {responseType:"blob"}).then(response => {
	        if(response.statusText=="OK"){
                let downloadURL = this.dataURLtoBlob(response.data)
                let anchor = document.createElement("a")
                //下载时显示的文件名（自定义）
                anchor.download = name + '.xlsx'
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