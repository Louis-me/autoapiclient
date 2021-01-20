<template>
    <div class="Tasks">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>任务管理</el-breadcrumb-item>
            <el-breadcrumb-item>实时任务</el-breadcrumb-item>
        </el-breadcrumb>

        <el-card class="box-card">
           <el-row :gutter="20">
                <el-col :span="7">
                     <el-input placeholder="请输入内容" v-model="queryInfo.query">
                        <el-button slot="append" icon="el-icon-search"
                        @click="searchEvent"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary"  @click="addDialogVisible = true">添加</el-button>
                </el-col>
            </el-row>
           <el-table  :data="taskList">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="任务名" prop="name"></el-table-column>
                <el-table-column label="关联套件" prop="suite_name"></el-table-column>
                <el-table-column label="任务状态" prop="task_state_name"></el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="taskDetail(scope.row.id)">详情</el-button>
                        <el-button type="text" size="small" @click="delTaskEvent(scope.row.id)">删除</el-button>
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
            <el-dialog
                title="新增任务"
                :visible.sync="addDialogVisible"
                width="30%">
                    <el-form ref="addTaskformRef" :rules="rules" :model="addTaskForm" class="addTask_form">
                        <el-form-item label="任务名" prop="name">
                            <el-input  v-model="addTaskForm.name" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="关联套件" prop="suite_id">
                            <el-select v-model="addTaskForm.suite_id" placeholder="请选择">
                                <el-option
                                    v-for="item in suiteList"
                                    :key="item.id"
                                    :id="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>                        
                        </el-form-item>
                    </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="resetAddTaskEvent">重 置</el-button>
                    <el-button type="primary" @click="addTaskEvent">确 定</el-button>
                </span>
            </el-dialog>

          

        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            taskList:[],// 实时任务列表
            suiteList: [], // 套件列表
            total: 0, // 实时任务数据总数
            addDialogVisible: false, // 控制任务添加对话框显示或隐藏
            queryInfo: {
                query:'',
                pagesize:10, // 每页显示多少条数据
                pagenum:1 // 当前页码
            },
            // 新增表单
            addTaskForm: {
                name: '',
                suite: '', 
                suite_id:'',
            },
     
        // 使用验证功能
            rules: {
                name: [
                    { required: true, message: '请输入任务名', trigger: 'blur' },
                ],
                suite:[
                    { required: true, message: '请选择套件', trigger: 'blur' }
                ],
            },
        }
    },
     created(){
         this.getTaskList()
         this.getSuiteList()
     },
     methods:{
         async getTaskList(){
            const {data:res}  = await this.$http.get('get_real_time_task_list',{
                params: this.queryInfo,
                })
            if (res.code != 1){
                return this.$message.erro("获取列表失败")
            }
            this.taskList = res.data.list
            this.total = res.data.total_count
        },
        async getSuiteList(){
            const {data:res}  = await this.$http.get('get_all_suite')
            if (res.code != 1){
                return this.$message.erro("获取列表失败")
            }
            this.suiteList = res.data
        },

        //  监听pagesize的改变事件
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getTaskList()
        },
        // 监听页码的改变事件
        handleCurrentChange(newPage) {
            console.log(newPage)
            this.queryInfo.pagenum = newPage
            this.getTaskList()
        },
        searchEvent() {
             this.getTaskList()
        },
        addTaskEvent() {
            this.$refs.addTaskformRef.validate(async valid=>{
               if (!valid) return
                // this.loginForm自动包表单中的name属性的值提交
                // let res = await this.$http.post("login/",JSON.stringify(this.loginForm))
                let res = await this.$http.post("new_real_time_task/",this.addTaskForm)
                if (res.data.code != 1) {
                   this.$message.error(res.data.msg)
                } else{
                    this.addDialogVisible = false
                    this.$message.success('新增成功')
                }

           });
        },
        async taskDetail(id) {
            console.log("打开详情")
            console.log(id)
             this.$router.push({
                path:"/realTimeTaskDetail/"+ id,
            })

        },
         resetAddTaskEvent() {
            this.$refs.addTaskformRef.resetFields();
      },
        async delTaskEvent(id) {
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
            console.log("执行删除逻辑")
            //  let res = await this.$http.post("task_del/",{id: id})
            //     if (res.data.code != 1) {
            //        return this.$message.error(res.data.msg)
            //     } 
            //     this.$message.success('删除成功')
            //     this.getTaskList()   
        }
        
    }
    
}
</script>
<style lang="less" scoped>


</style>