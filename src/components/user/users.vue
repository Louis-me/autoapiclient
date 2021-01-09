<template>
    <div class="users">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
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
           <el-table  :data="userList">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="name"></el-table-column>
                <el-table-column label="角色" prop="role_name"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button  type="text" size="small">查看</el-button>
                        <el-button type="text" size="small" @click="editShowUserEvent(scope.row.id)">编辑</el-button>
                        <el-button type="text" size="small" @click="delUserEvent(scope.row.id)">删除</el-button>

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
                title="新增用户"
                :visible.sync="addDialogVisible"
                width="30%">
                    <el-form ref="addUserformRef" :rules="rules" :model="addUserForm" class="addUser_form">
                        <el-form-item label="用户名" prop="username">
                            <el-input  v-model="addUserForm.username" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="pwd">
                            <el-input v-model="addUserForm.pwd" type="password" auto-complete="off"></el-input>
                        </el-form-item>
                          <el-form-item label="角色" prop="roleId">
                            <el-select v-model="addUserForm.roleId" placeholder="请选择">
                                <el-option
                                    v-for="item in roleList"
                                    :key="item.id"
                                    :id="item.id"
                                    :label="item.role_name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="resetAddUserEvent">重 置</el-button>
                    <el-button type="primary" @click="addUserEvent">确 定</el-button>
                </span>
            </el-dialog>

            <el-dialog
                title="编辑用户"
                :visible.sync="editDialogVisible"
                width="30%">
                    <el-form ref="editUserformRef" :rules="editUserRules" :model="editUserForm" class="editUser_form">
                        <el-form-item label="用户名" prop="username">
                            <el-input  v-model="editUserForm.username" auto-complete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="pwd">
                            <el-input v-model="editUserForm.pwd" type="password" auto-complete="off"></el-input>
                        </el-form-item>
                          <el-form-item label="角色" prop="roleId">
                            <el-select v-model="editUserForm.roleId" placeholder="请选择" >
                                <el-option
                                    v-for="item in roleList"
                                    :key="item.id"
                                    :id="item.id"
                                    :label="item.role_name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="editUserInfoEvent">确 定</el-button>
                </span>
            </el-dialog>

        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            userList:[],
            total: 0, // 用户列表数据总数
            addDialogVisible: false, // 控制用户添加对话框显示或隐藏
            editDialogVisible:false, //编辑用户添加对话框显示或隐藏
            queryInfo: {
                query:'',
                pagesize:10, // 每页显示多少条数据
                pagenum:1 // 当前页码
            },
            roleList: [], // 角色列表
            // 新增用户表单
            addUserForm: {
                username: '',
                pwd: '', 
                roleId: '',
            },
            // 编辑用户表单
            editUserForm: {
                username: '',
                pwd: '', 
                roleName:"",
                id:"",
                roleId: ""
            },
        // 使用验证功能
            rules: {
            username: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
            ],
            pwd:[
                { required: true, message: '请输入密码', trigger: 'blur' }
            ],
            // 角色校验
            role: [
            { required: true, message: '请选择角色', trigger: 'change' }
          ],
        },
        editUserRules: {
            username: [
                { required: true, message: '请输入用户名', trigger: 'blur' },
            ],
            pwd:[
                { required: true, message: '请输入密码', trigger: 'blur' }
            ],
            // 角色校验
            role: [
            { required: true, message: '请选择角色', trigger: 'change' }
          ],
        }
        }
    },
     created(){
         this.getUserList()
         this.getRoleList()
     },
     methods:{
         async getUserList(){
            const {data:res}  = await this.$http.get('get_user_list',{
                params: this.queryInfo,
                })
            if (res.code != 1){
                return this.$message.erro("获取用户列表失败")
            }
            this.userList = res.data.list
            this.total = res.data.total_count
        },
         async getRoleList() {
            const {data:res} = await this.$http.get('get_role_list')
             if (res.code != 1){
                return this.$message.erro("获取角色列表失败")
            }
            this.roleList = res.data
            this.getUserList()
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
        addUserEvent() {
            this.$refs.addUserformRef.validate(async valid=>{
               if (!valid) return
                // this.loginForm自动包表单中的name属性的值提交
                // let res = await this.$http.post("login/",JSON.stringify(this.loginForm))
                let res = await this.$http.post("user_add/",this.addUserForm)
                if (res.data.code != 1) {
                   this.$message.error(res.data.msg)
                } else{
                    this.addDialogVisible = false
                    this.$message.success('新增成功')
                }

           });
        },
        async editShowUserEvent(id) {
                this.editDialogVisible = true
                const {data: res} = await this.$http.get("users/" + id)
                if (res.code != 1) {
                this.$message.error(res.msg)
                } else{
                    this.editUserForm.username = res.data.user_name
                    this.editUserForm.pwd = res.data.pwd
                    this.editUserForm.roleName = res.data.role_name
                    this.editUserForm.id = id
                    this.editUserForm.roleId = res.data.role_id

                }
        },
         resetAddUserEvent() {
            this.$refs.addUserformRef.resetFields();
      },
       editUserInfoEvent() {
            this.$refs.editUserformRef.validate(async valid=>{
               if (!valid) return
                let res = await this.$http.post("user_edit/",this.editUserForm)
                if (res.data.code != 1) {
                   this.$message.error(res.data.msg)
                } else{
                    this.editDialogVisible = false
                    this.$message.success('修改成功')
                    this.getUserList()
                }

           });
        },
        // 改变角色下拉组件
        changeRoleEvent(event) {
           this.editUserForm.roleId = event
        },
        async delUserEvent(id) {
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

             let res = await this.$http.post("user_del/",{id: id})
                if (res.data.code != 1) {
                   return this.$message.error(res.data.msg)
                } 
                this.$message.success('删除成功')
                this.getUserList()

                
        }
        
    }
    
}
</script>
<style lang="less" scoped>


</style>