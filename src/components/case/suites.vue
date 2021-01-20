<template>
    <div class="suites">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用例管理</el-breadcrumb-item>
            <el-breadcrumb-item>套件列表</el-breadcrumb-item>
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
           <el-table  :data="SuiteList">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="套件名称" prop="name"></el-table-column>
                <el-table-column label="模糊测试" prop="is_fuzz_ch"></el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button  type="text" size="small" @click="contanctCaseEvent(scope.row.id)">关联用例</el-button>
                        <el-button type="text" size="small" @click="editShowSuiteEvent(scope.row.id)">编辑</el-button>
                        <el-button type="text" size="small" @click="delSuiteEvent(scope.row.id)">删除</el-button>

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
                title="新增套件"
                :visible.sync="addDialogVisible"
                width="50%">
                    <el-form ref="addSuiteFormRef" :rules="rules" :model="addSuiteForm" class="addSuite_form">
                        <el-form-item label="名称" prop="name">
                            <el-input  v-model="addSuiteForm.name"></el-input>
                        </el-form-item>
                        
                        <el-form-item label="模糊测试" prop="is_fuzz">
                            <el-switch v-model="addSuiteForm.is_fuzz"
                                active-color="#13ce66"
                                inactive-color="#C0CCDA"
                                :active-value="true" :inactive-value="false">
                            </el-switch>
                        </el-form-item>
                    </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="resetaddSuiteEvent">重 置</el-button>
                    <el-button type="primary" @click="addSuiteEvent">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog
                title="编辑套件"
                :visible.sync="editDialogVisible"
                width="50%">
                    <el-form ref="editSuiteformRef" :rules="editSuiteRules" :model="editSuiteForm" class="editSuite_form">
                        <el-form-item label="名称" prop="name">
                            <el-input  v-model="editSuiteForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="模糊测试" prop="is_fuzz">
                              <el-switch
                                v-model="editSuiteForm.is_fuzz"
                                 active-color="#13ce66"
                                inactive-color="#C0CCDA"
                                >
                              </el-switch>
                        </el-form-item>
                    </el-form>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editSuiteEvent">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog
                title="关联用例"
                :visible.sync="toCaseDialogVisible"
                width="50%">
                     <el-transfer v-model="suiteToCaseList" :data="caseList" filterable
                      :titles="['用例', '已关联']"                     
                     ></el-transfer>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="toCaseDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editSuiteCaseEvent">确 定</el-button>
                </span>
            </el-dialog>


        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            caseList:[], // 用例列表
            suiteToCaseList:[],// 套件关联用例的列表，是用例id，格式为[1,2,3]
            suite_id : "", // 套件id，选择关联用例后，赋值，用于点击关联套件弹框的确定难
            SuiteList:[], // 套件列表
            total: 0, // 套件列表数据总数
            addDialogVisible: false, // 控制套件添加对话框显示或隐藏
            editDialogVisible:false, //编辑套件添加对话框显示或隐藏
            toCaseDialogVisible:false, //编辑关联套件
            queryInfo: {
                query:'',
                pagesize:10, // 每页显示多少条数据
                pagenum:1 // 当前页码
            },
            // 新增套件
            addSuiteForm: {
                name: '',
                is_fuzz: true
            },
            // 编辑套件
            editSuiteForm: {
                id:'',
                name: '',
                is_fuzz: ''
            },
        // 使用验证功能
            rules: {
            name: [
                { required: true, message: '请输入名称', trigger: 'blur' },
            ],
            
        },
        editSuiteRules: {
           name: [
                { required: true, message: '请输入名称', trigger: 'blur' },
            ],
           
        }
        }
    },
     created(){
         this.getSuiteList()
         this.getCaseList()
     },
     methods:{
             async contanctCaseEvent(id){
                 this.suite_id = id
                 this.toCaseDialogVisible = true
                 const {data:res}  = await this.$http.get('suite_to_case_list/' + id)
                if (res.code != 1){
                    console.log("无关联用例数据")
                    // return
                }
                for(var i=0;i < res.data.length; i++) {
                    // console.log(res.data[i].case_id)
                     this.suiteToCaseList.push(res.data[i].case_id)

                }
                //  return this.$message.success("success")

             },
            async getCaseList(){
                const {data:res}  = await this.$http.get('get_case_all_list')
                if (res.code != 1){
                    return this.$message.erro("获取用例列表失败")
                }
                for(var i=0;i < res.data.length; i++) {
                    var app = {"key": res.data[i].id, "label": res.data[i].name}
                     this.caseList.push(app)
                }

             },
         async getSuiteList(){
            const {data:res}  = await this.$http.get('get_suite_list',{
                params: this.queryInfo,
                })
            if (res.code != 1){
                return this.$message.erro("获取用例列表失败")
            }
            this.SuiteList = res.data.list
            this.total = res.data.total_count
        },

        //  监听pagesize的改变事件
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getSuiteList()
        },
        // 监听页码的改变事件
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getSuiteList()
        },
        searchEvent() {
             this.getSuiteList()
        },
        addSuiteEvent() {
            this.$refs.addSuiteFormRef.validate(async valid=>{
               if (!valid) return
                let res = await this.$http.post("suite_add/",this.addSuiteForm)
                if (res.data.code != 1) {
                   this.$message.error(res.data.msg)
                } else{
                    this.addDialogVisible = false
                    this.$message.success('新增成功')
                      this.getSuiteList()
                }

           });
        },
        async editShowSuiteEvent(id) {
                this.editDialogVisible = true
                const {data: res} = await this.$http.get("suite_detail/" + id)
                if (res.code != 1) {
                this.$message.error(res.msg)
                } else{
                    this.editSuiteForm.name = res.data.name
                    this.editSuiteForm.is_fuzz = res.data.is_fuzz
                    this.editSuiteForm.id = id

                }
        },
         resetaddSuiteEvent() {
            this.$refs.addSuiteFormRef.resetFields();
      },
       editSuiteEvent() {
            this.$refs.editSuiteformRef.validate(async valid=>{
               if (!valid) return
                let res = await this.$http.post("suite_edit/",this.editSuiteForm)
                if (res.data.code != 1) {
                   this.$message.error(res.data.msg)
                } else{
                    this.editDialogVisible = false
                    this.$message.success('修改成功')
                    this.getSuiteList()
                }

           });
        },
        async delSuiteEvent(id) {
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

             let res = await this.$http.post("suite_del/",{id: id})
                if (res.data.code != 1) {
                   return this.$message.error(res.data.msg)
                } 
                this.$message.success('删除成功')
                this.getSuiteList()
                
        },
        async editSuiteCaseEvent() {
            if (this.suiteToCaseList == false) {
                return this.$message.error("请关联用例")
            }
            var params = {}
            params["suite_id"] = this.suite_id
            params["case_ids"] = this.suiteToCaseList
            let res = await this.$http.post("suite_set_case/", params)
            if (res.data.code != 1) {
                return this.$message.error(res.data.msg)
            } 
            this.toCaseDialogVisible = false
            this.$message.success('关联成功')

        }
        
    }
    
}
</script>
<style lang="less" scoped>


</style>