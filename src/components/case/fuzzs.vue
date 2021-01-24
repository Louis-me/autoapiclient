<template>
    <div class="suites">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用例管理</el-breadcrumb-item>
            <el-breadcrumb-item>模糊用例设置</el-breadcrumb-item>
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
           <el-table  :data="fuzzList">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="用例名称" prop="name"></el-table-column>
                <el-table-column label="用例内容" prop="content"  tooltip-effect="light"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editShowEvent(scope.row.id)" :disabled="scope.row.fuzz_type != 3">编辑</el-button>
                        <el-button type="text" size="small" @click="delEvent(scope.row.id)" :disabled="scope.row.fuzz_type != 3">删除</el-button>
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
                title="新增模糊用例"
                :visible.sync="addDialogVisible"
                width="50%">
                    <el-form ref="addFuzzFormRef" :rules="rules" :model="addFuzzForm" class="addFuzz_form">
                        <el-form-item label="名称" prop="name">
                            <el-input  v-model="addFuzzForm.name"></el-input>
                        </el-form-item>
                          <el-form-item label="内容" prop="content">
                            <el-input   type="textarea"   placeholder="请输入内容" v-model="addFuzzForm.content"></el-input>
                        </el-form-item>
                    </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="resetaddFuzzEvent">重 置</el-button>
                    <el-button type="primary" @click="addFuzzEvent">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog
                title="编辑模糊用例"
                :visible.sync="editDialogVisible"
                width="50%">
                    <el-form ref="editFuzzformRef" :rules="editFuzzRules" :model="editFuzzForm" class="editFuzz_form">
                        <el-form-item label="名称" prop="name"  type="textarea">
                            <el-input  v-model="editFuzzForm.name"></el-input>
                        </el-form-item>
                          <el-form-item label="内容" prop="content">
                            <el-input   type="textarea"   placeholder="请输入内容" v-model="editFuzzForm.content"></el-input>
                        </el-form-item>
                    </el-form>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editFuzzEvent">确 定</el-button>
                </span>
            </el-dialog>

        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            fuzzList:[], // 数据列表
            total: 0, // 套件列表数据总数
            addDialogVisible: false, // 控制添加对话框显示或隐藏
            editDialogVisible:false, //编辑对话框显示或隐藏
            queryInfo: {
                query:'',
                pagesize:10, // 每页显示多少条数据
                pagenum:1 // 当前页码
            },
            // 新增
            addFuzzForm: {
                name: '',
                content: "",
                fuzz_type: 3
            },
            // 编辑
            editFuzzForm: {
                id:'',
                name: '',
                content: '',
                fuzz_type: 3
            },
        // 使用验证功能
            rules: {
            name: [
                { required: true, message: '请输入名称', trigger: 'blur' },
            ],
            
        },
        editFuzzRules: {
           name: [
                { required: true, message: '请输入名称', trigger: 'blur' },
            ],
           
        }
        }
    },
     created(){
         this.getFuzzList()
     },
     methods:{
               async getFuzzList(){
                const {data:res}  = await this.$http.get('get_fuzz_list', {params: this.queryInfo})
                if (res.code != 1){
                    return this.$message.erro("获取用例列表失败")
                }
                this.fuzzList = res.data.list
             },
 
        //  监听pagesize的改变事件
        handleSizeChange(newSize) {
            this.queryInfo.pagesize = newSize
            this.getFuzzList()
        },
        // 监听页码的改变事件
        handleCurrentChange(newPage) {
            this.queryInfo.pagenum = newPage
            this.getFuzzList()
        },
        searchEvent() {
             this.getFuzzList()
        },
        addFuzzEvent() {
            this.$refs.addFuzzFormRef.validate(async valid=>{
               if (!valid) return
                let res = await this.$http.post("fuzz_add/",this.addFuzzForm)
                if (res.data.code != 1) {
                   this.$message.error(res.data.msg)
                } else{
                    this.addDialogVisible = false
                    this.$message.success('新增成功')
                      this.getFuzzList()
                }

           });
        },
        async editShowEvent(id) {
                this.editDialogVisible = true
                const {data: res} = await this.$http.get("fuzz_detail/" + id)
                if (res.code != 1) {
                this.$message.error(res.msg)
                } else{
                    this.editFuzzForm.name = res.data.name
                    this.editFuzzForm.id = id
                    this.editFuzzForm.content = res.data.content
                }
        },
        
         resetaddFuzzEvent() {
            this.$refs.addFuzzFormRef.resetFields();
      },
       editFuzzEvent() {
            this.$refs.editFuzzformRef.validate(async valid=>{
               if (!valid) return
                let res = await this.$http.post("fuzz_edit/",this.editFuzzForm)
                if (res.data.code != 1) {
                   this.$message.error(res.data.msg)
                } else{
                    this.editDialogVisible = false
                    this.$message.success('修改成功')
                    this.getFuzzList()
                }

           });
        },
        async delEvent(id) {
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

             let res = await this.$http.post("fuzz_del/",{id: id})
                if (res.data.code != 1) {
                   return this.$message.error(res.data.msg)
                } 
                this.$message.success('删除成功')
                this.getFuzzList()
                
        },
        async editFuzzCaseEvent() {
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