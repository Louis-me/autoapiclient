<template>
    <div class="cases">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用例管理</el-breadcrumb-item>
            <el-breadcrumb-item>用例列表</el-breadcrumb-item>
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
           <el-table  :data="caseList">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="接口名" prop="name"></el-table-column>
                <el-table-column label="协议" prop="protocol"></el-table-column>
                <el-table-column label="方法" prop="method"></el-table-column>
                <el-table-column label="url" prop="url"></el-table-column>
                <el-table-column label="入参" prop="params"></el-table-column>
                <el-table-column label="期望值" prop="hope"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button  type="text" size="small">查看</el-button>
                        <el-button type="text" size="small" @click="editShowCaseEvent(scope.row.id)">编辑</el-button>
                        <el-button type="text" size="small" @click="delCaseEvent(scope.row.id)">删除</el-button>

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
                title="新增用例"
                :visible.sync="addDialogVisible"
                width="50%">
                    <el-form ref="addCaseFormRef" :rules="rules" :model="addCaseForm" class="addCase_form">
                        <el-form-item label="用例名称" prop="name">
                            <el-input  v-model="addCaseForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="协议" prop="protocol">
                            <el-select v-model="addCaseForm.protocol" placeholder="请选择">
                                <el-option 
                                    label="http"
                                    value="http">
                                </el-option>
                                 <el-option 
                                    label="https"
                                    value="https">
                                </el-option>
                             </el-select>
                        </el-form-item>
                        <el-form-item label="方法" prop="method">
                             <el-select v-model="addCaseForm.method" placeholder="请选择">
                                <el-option 
                                    label="get"
                                    value="get">
                                </el-option>
                                 <el-option 
                                    label="post"
                                    value="post">
                                </el-option>
                             </el-select>
                        </el-form-item>
                        <el-form-item label="url" prop="url">
                            <el-input v-model="addCaseForm.url"></el-input>
                        </el-form-item>
                         <el-form-item label="入参" prop="入参">
                            <el-input v-model="addCaseForm.params"></el-input>
                        </el-form-item>
                         <el-form-item label="期望结果" prop="hope">
                            <el-input v-model="addCaseForm.hope"></el-input>
                        </el-form-item>
                    </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="resetaddCaseEvent">重 置</el-button>
                    <el-button type="primary" @click="addCaseEvent">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog
                title="编辑用例"
                :visible.sync="editDialogVisible"
                width="50%">
                    <el-form ref="editCaseformRef" :rules="editCaseRules" :model="editCaseForm" class="editCase_form">
                        <el-form-item label="用例名称" prop="name">
                            <el-input  v-model="editCaseForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="协议" prop="protocol">
                            <el-select v-model="editCaseForm.protocol" placeholder="请选择">
                                <el-option 
                                    label="http"
                                    value="http">
                                </el-option>
                                 <el-option 
                                    label="https"
                                    value="https">
                                </el-option>
                             </el-select>
                        </el-form-item>
                        <el-form-item label="方法" prop="method">
                             <el-select v-model="editCaseForm.method" placeholder="请选择">
                                <el-option 
                                    label="get"
                                    value="get">
                                </el-option>
                                 <el-option 
                                    label="post"
                                    value="post">
                                </el-option>
                             </el-select>
                        </el-form-item>
                        <el-form-item label="url" prop="url">
                            <el-input v-model="editCaseForm.url"></el-input>
                        </el-form-item>
                         <el-form-item label="入参" prop="入参">
                            <el-input v-model="editCaseForm.params"></el-input>
                        </el-form-item>
                         <el-form-item label="期望结果" prop="hope">
                            <el-input v-model="editCaseForm.hope"></el-input>
                        </el-form-item>
                    </el-form>

                  <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editCaseEvent">确 定</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            caseList:[],
            total: 0, // 用户列表数据总数
            addDialogVisible: false, // 控制用户添加对话框显示或隐藏
            editDialogVisible:false, //编辑用户添加对话框显示或隐藏
            queryInfo: {
                query:'',
                pagesize:10, // 每页显示多少条数据
                pagenum:1 // 当前页码
            },
            // 新增用例
            addCaseForm: {
                name: '',
                params: '', 
                protocol: '',
                method: "",
                url:"",
                hope:"",
            },
            // 编辑用例
            editCaseForm: {
                id:'',
                name: '',
                params: '', 
                protocol: '',
                method: "",
                url:"",
                hope:"",
            },
        // 使用验证功能
            rules: {
            name: [
                { required: true, message: '请输入用例名称', trigger: 'blur' },
            ],
            url:[
                { required: true, message: '请输入url', trigger: 'blur' }
            ],
             hope:[
                { required: true, message: '请输期望值,格式为{code:200}|{id:2}', trigger: 'blur' }
            ],
            method: [
            { required: true, message: '请选择请求方法', trigger: 'change' }
          ],
           protocol: [
            { required: true, message: '请选择请求类型', trigger: 'change' }
          ],
        },
        editCaseRules: {
           name: [
                { required: true, message: '请输入用例名称', trigger: 'blur' },
            ],
            url:[
                { required: true, message: '请输入url', trigger: 'blur' }
            ],
             hope:[
                { required: true, message: '请输期望值,格式为{code:200}|{id:2}', trigger: 'blur' }
            ],
            method: [
            { required: true, message: '请选择请求方法', trigger: 'change' }
          ],
           protocol: [
            { required: true, message: '请选择请求类型', trigger: 'change' }
          ],
        }
        }
    },
     created(){
         this.getCaseList()
     },
     methods:{
         async getCaseList(){
            const {data:res}  = await this.$http.get('get_case_list',{
                params: this.queryInfo,
                })
            if (res.code != 1){
                return this.$message.erro("获取用例列表失败")
            }
            this.caseList = res.data.list
            this.total = res.data.total_count
        },

        //  监听pagesize的改变事件
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getCaseList()
        },
        // 监听页码的改变事件
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getCaseList()
        },
        searchEvent() {
             this.getCaseList()
        },
        addCaseEvent() {
            this.$refs.addCaseFormRef.validate(async valid=>{
               if (!valid) return
                let res = await this.$http.post("case_add/",this.addCaseForm)
                if (res.data.code != 1) {
                   this.$message.error(res.data.msg)
                } else{
                    this.addDialogVisible = false
                    this.$message.success('新增成功')
                      this.getCaseList()
                }

           });
        },
        async editShowCaseEvent(id) {
                this.editDialogVisible = true
                const {data: res} = await this.$http.get("case_detail/" + id)
                if (res.code != 1) {
                this.$message.error(res.msg)
                } else{
                    this.editCaseForm.name = res.data.name
                    this.editCaseForm.protocol = res.data.protocol
                    this.editCaseForm.url = res.data.url
                    this.editCaseForm.id = id
                    this.editCaseForm.params = res.data.params
                    this.editCaseForm.method = res.data.method
                    this.editCaseForm.hope = res.data.hope

                }
        },
         resetaddCaseEvent() {
            this.$refs.addCaseFormRef.resetFields();
      },
       editCaseEvent() {
            this.$refs.editCaseformRef.validate(async valid=>{
               if (!valid) return
                let res = await this.$http.post("case_edit/",this.editCaseForm)
                if (res.data.code != 1) {
                   this.$message.error(res.data.msg)
                } else{
                    this.editDialogVisible = false
                    this.$message.success('修改成功')
                    this.getCaseList()
                }

           });
        },
        async delCaseEvent(id) {
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

             let res = await this.$http.post("case_del/",{id: id})
                if (res.data.code != 1) {
                   return this.$message.error(res.data.msg)
                } 
                this.$message.success('删除成功')
                this.getCaseList()

                
        }
        
    }
    
}
</script>
<style lang="less" scoped>


</style>