<template>
  <div class="box">
    <div class="search">
      <el-form class="clearfix search-form" ref="form" :model="form">
        <el-form-item label="日期：">
          <el-date-picker
                  v-model="time"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  @change="onTime"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="关键字：">
           <el-input placeholder="请输入文件名进行查询"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="onReset('form')">重置</el-button>
          <el-button type="success" @click="goBack">返回微信导入工具</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
            :data="tableData"
            border
            style="width: 100%"
            @cell-click="cellClick">
      <el-table-column
              prop="repeatedRatio"
              label="导入时间"
              width="100">
      </el-table-column>
      <el-table-column
              prop="enterDuration"
              label="日期"
              width="120">
      </el-table-column>
      <el-table-column
              prop="replyDuration"
              label="上传文件名">
      </el-table-column>
      <el-table-column
              prop="recordCount"
              label="状态">
      </el-table-column>
      <el-table-column
              prop="chatCount"
              label="操作者">
      </el-table-column>
      <el-table-column
              prop="consultantCount"
              label="详情">
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        tableData: [],
        time:[],
        startDate:'2018-01-01',
        endDate:this.$Tool.timeForMat(),
        form:{},
      }
    },
    mounted(){
      this.time=[this.startDate,this.endDate]
      // this.getList()
    },
    methods:{
      goBack(){
        let ipcRenderer = window.require('electron').ipcRenderer;
        if (window.require('electron')) {
          ipcRenderer && ipcRenderer.sendToHost('我已经收到消息了');
        }
      },
        cellClick(row, column, cell, event){
            if(column.property=="repeatedRatio"){
                this.$router.push({path:'advisoryDetails'})
            }
        },
      onReset(){},
      search(){},
      onTime(val){
        if(val){
          this.startDate=val[0]
          this.endDate=val[1]
        }else{
          this.startDate='2018-01-01'
          this.endDate=this.$Tool.timeForMat()
        }
        this.getList()
      },
      getList(){
        let params={};
        params.startDate=this.startDate;
        params.endDate=this.endDate;
        this.$API.getLineList(params).then(res => {
          const { data, msg, status } = res;
           console.log(1111,res);
          if (status == 200) {
            this.tableData = data;
          }
        });
      }
    },
  }
</script>
<style>
  .el-form-item__label,.el-form-item__content{
    float: left;
  }
  .blue{
      color:#20a0ff;
      cursor: pointer;
  }
</style>
<style scoped>

  .time{
    font-size: 14px;
    margin: 0px 0px 10px;
  }
  .el-form-item{
    display: inline-block;
    margin-right: 20px;
  }
  .box{
    padding: 20px;
    background: #fff;
  }
  .block{
    text-align: left;
    margin-bottom: 20px;
    display: inline-block;
    margin-right: 20px;
  }
</style>