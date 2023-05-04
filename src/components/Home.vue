<template>
   <el-container class="home-containe">
    <el-header>
        <div>
          <img src="../assets/logo.png" alt="" style="height:60px">
          <span>XXX管理平台</span>
        </div>
        <el-button type="info" @click="loginOutEvent">注销</el-button>
    </el-header>
  <el-container>
    <el-aside width="200px">
       <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409BFF"
          unique-opened
          router>
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-s-grid"></i>
            <span>用户管理</span>
          </template>
          <el-menu-item :index="'/users'">
            <template >
              <i class="el-icon-menu"></i>
              <span>用户列表</span>
            </template>
          </el-menu-item>
      </el-submenu>
      <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-s-grid"></i>
            <span>用例管理</span>
          </template>
          <el-menu-item :index="'/fuzzs'">
            <template >
              <i class="el-icon-menu"></i>
              <span>模糊用例规则</span>
            </template>
          </el-menu-item>
          <el-menu-item :index="'/cases'">
            <template >
              <i class="el-icon-menu"></i>
              <span>用例列表</span>
            </template>
          </el-menu-item>
            <el-menu-item :index="'/suites'">
              <template >
                <i class="el-icon-menu"></i>
                <span>套件管理</span>
              </template>
          </el-menu-item>
      </el-submenu>
       <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-s-grid"></i>
            <span>任务管理</span>
          </template>
          <el-menu-item :index="'/readTimeTask'">
            <template >
              <i class="el-icon-menu"></i>
              <span>实时任务</span>
            </template>
          </el-menu-item>
            <el-menu-item :index="'/timingTask'">
            <template >
              <i class="el-icon-menu"></i>
              <span>定时任务</span>
            </template>
          </el-menu-item>
      </el-submenu>
      <el-submenu index="4">
          <template slot="title">
            <i class="el-icon-s-grid"></i>
            <span>报告管理</span>
          </template>
          <el-menu-item :index="'/reportTask'">
            <template >
              <i class="el-icon-menu"></i>
              <span>图形报告分析</span>
            </template>
          </el-menu-item>
           <el-menu-item :index="'/reportListTask'">
            <template >
              <i class="el-icon-menu"></i>
              <span>报告管理</span>
            </template>
          </el-menu-item>
      </el-submenu>
      <el-submenu index="5">
          <template slot="title">
            <i class="el-icon-s-grid"></i>
            <span>在线日志</span>
          </template>
          <el-menu-item :index="'/logs'">
            <template >
              <i class="el-icon-menu"></i>
              <span>日志查看</span>
            </template>
          </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>

export default {
 data() {
   return {
     
   }
 },
 
  methods: {
      loginOutEvent:function(){
         this.$http.get("loginout/").then(res => {
          this.msg = res.data.msg;
          if(res.data.code==1) {
            this.$message.success("退出成功")
            // 删除token
            localStorage.removeItem("token")
             this.$router.push("/")
          } else {
            this.$message.error("退出失败")
          }

          })
      },

    }
  }
</script>
<style lang="less" scoped>
  .home-containe {
    height: 100%;
  }
  .el-header {
    background-color: #373d41;
    padding-left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    font-size:20px;
   > div {
      display: flex;
      align-items: center;
      > span {
        margin-left: 15px;
      }
    }
  }
  
  .el-aside {
    background-color: #373d41;
    .el-menu {
      padding-right: none;
    }
  }
  
  .el-main {
    background-color: #E9EEF3;
  }
  
</style>>

