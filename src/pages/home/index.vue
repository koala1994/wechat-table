<template>
  <div class="box homeLine">
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
        <el-form-item label="教育伙伴：" prop="value">
          <el-select v-model="form.value" placeholder="请选择">
            <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
          <el-button @click="onReset('form')">重置</el-button>
          <el-button type="success" @click="goBack">返回微信导入工具</el-button>
          <el-button type="primary" @click="exportExcel">导出excel</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="time" v-if="startDate">{{initTimeString()}}</div>
    <el-table
            :data="tableData"
            border
            style="width: 100%"
            @cell-click="cellClick"
            :cell-class-name="cellClass">
      <el-table-column
              prop="consultant"
              label="教育伙伴"
              fixed
              min-width="130">
      </el-table-column>
      <el-table-column
              prop="character"
              label="工作微信人设"
              width="100">
      </el-table-column>
      <el-table-column
              prop="activationDate"
              sortable
              label="启用时间"
              width="100">
      </el-table-column>
      <el-table-column
              prop="enterCount"
              sortable
              label="累计加微用户"
              width="120">
      </el-table-column>
      <el-table-column
              prop="repeatedRatio"
              label="查重率"
              sortable
              width="85">
      </el-table-column>
      <el-table-column
              prop="enterDuration"
              label="平均加微通过速度（min/个）"
              sortable
              width="205">
      </el-table-column>
      <el-table-column
              prop="replyDuration"
              sortable
              width="205"
              label="平均首次回复速度（min/个）">
      </el-table-column>
      <el-table-column
              prop="recordCount"
              sortable
              width="145"
              label="收发消息数（条）">
      </el-table-column>
      <el-table-column
              prop="chatCount"
              sortable
              width="140"
              label="聊天人数（个）">
      </el-table-column>
      <el-table-column
              prop="avgCount"
              sortable
              width="175"
              label="平均聊天人数（个/天）">
      </el-table-column>
      <el-table-column
              prop="deletedRatio"
              sortable
              width="85"
              label="删除率">
      </el-table-column>
      <el-table-column
              prop="blockedRatio"
              sortable
              width="85"
              label="拉黑率">
      </el-table-column>
    </el-table>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        tableData: [
          {
            consultant:'dsadas',
            character:'dsadas',
            activationDate:'dsadas',
            enterCount:'dsadas',
            repeatedRatio:'dsadas',
            enterDuration:'dsadas',
            replyDuration:'dsadas',
            recordCount:'dsadas',
            chatCount:'dsadas',
            avgCount:'dsadas',
            deletedRatio:'dsadas',
            blockedRatio:'dsadas',
          }
        ],
        time:[],
        startDate:'',
        endDate:'',
        form:{},
        value:'',
        options: [{
          value: '选项1',
          label: '张雨薇'
        }, {
          value: '选项2',
          label: '王明珠'
        }, {
          value: '选项3',
          label: '肖诚'
        }],
      }
    },
    mounted(){
      for(let i=5;i>=0;i--){
        console.log(i)
      }
      this.time=[this.startDate,this.endDate]
      this.getList()
      this.initTimeString();
    },
    methods:{
      //导出的方法
      exportExcel() {
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../utils/excel/Export2Excel');
          const tHeader = ['教育伙伴', '工作微信人设', '启用时间', '累计加微用户', '查重率', '平均加微通过速度（min/个）', '平均首次回复速度（min/个）', '收发消息数（条）', '聊天人数（个）', '平均聊天人数（个/天）', '删除率','拉黑率'];
          // 上面设置Excel的表格第一行的标题
          const filterVal = ['consultant', 'character', 'activationDate', 'enterCount', 'repeatedRatio', 'enterDuration', 'replyDuration', 'recordCount', 'chatCount', 'avgCount', 'deletedRatio', 'blockedRatio'];
          // 上面的index、nickName、name是tableData里对象的属性
          const list = this.tableData;  //把data里的tableData存到list
          const data = this.formatJson(filterVal, list);
          export_json_to_excel(tHeader, data, '微信聊天记录');
        })
      },

      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      goBack(){
        let ipcRenderer = window.require('electron').ipcRenderer;
          if (window.require('electron')) {
            ipcRenderer && ipcRenderer.sendToHost('我已经收到消息了');
          }
      },
        cellClick(row, column, cell, event){
        console.log(row)
          console.log(column)
          console.log(cell)
          console.log(event)
          switch (column.property) {
            case "repeatedRatio":
              this.$router.push({path:'advisoryDetails',query:{type:1,startDate:this.startDate,endDate:this.endDate,consultant:row.consultant,name:column.label}});
              break;
            case "recordCount":
              this.$router.push({path:'advisoryDetails',query:{type:2,startDate:this.startDate,endDate:this.endDate,consultant:row.consultant,name:column.label}});
              break;
            case "deletedRatio":
              this.$router.push({path:'advisoryDetails',query:{type:3,startDate:this.startDate,endDate:this.endDate,consultant:row.consultant,name:column.label}});
              break;
            case "blockedRatio":
              this.$router.push({path:'advisoryDetails',query:{type:4,startDate:this.startDate,endDate:this.endDate,consultant:row.consultant,name:column.label}});
              break;
          }
        },
        cellClass({row, column, rowIndex, columnIndex}){
            if (columnIndex === 4 || columnIndex === 7 || columnIndex === 10 || columnIndex === 11 || columnIndex === 12) {
                return 'blue';
            }
            return '';
        },
      onReset(formName){
        this.$refs[formName].resetFields();
        this.startDate='';
        this.endDate=''
        this.time=[this.startDate,this.endDate]
        this.getList()
      },
      search(){
          this.getList()
      },
      initTimeString(){
        const startDate=this.startDate.split('-');
        const endDate=this.endDate.split('-');
        const startString=startDate[0]+'年'+startDate[1]+'月'+startDate[2]+'日'
        const endString=endDate[0]+'年'+endDate[1]+'月'+endDate[2]+'日'
        const startTime=this.$Tool.getMonthWeek(startDate[0],startDate[1],startDate[2])
        const endTime=this.$Tool.getMonthWeek(endDate[0],endDate[1],endDate[2])
        return '所选日期：'+startString+'  -  '+endString
      },
      onTime(val){
          console.log(val)
        if(val){
          this.startDate=val[0]
          this.endDate=val[1]
        }else{
          this.startDate=''
          this.endDate=''
        }
        // this.getList()
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
            this.tableData.map(item=>{
              item.enterDuration=Number(item.enterDuration)
              item.replyDuration=Number(item.replyDuration)
            })
          }
        });
      }
    },
  }
</script>
<style>
  .homeLine .el-form-item__label,.homeLine .el-form-item__content{
    float: left;
  }
  .box .blue{
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