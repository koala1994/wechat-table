<template>
  <div class="box">
    <div class="time" v-if="startDate">{{initTimeString()}}</div>
      <el-button type="primary" @click="exportExcel">导出excel</el-button>
    <div class="data-analyze">
      <el-table
              :data="tableData"
              border
              style="width: 100%; margin-top: 10px"
              v-loading="loading"
      >
        <el-table-column
                :prop="item.key"
                :label="item.title"
                v-for="(item,index) in columns"
                :key="index"
                :sortable="item.key=='lastTime' || item.key=='recordCount'"
                :show-overflow-tooltip="true"
        >
<!--          <template slot-scope="scope">-->
<!--            <div v-if="item.key=='repeatedList'" v-for="(one,oneIndex) in scope.row.repeatedList" :key="oneIndex">{{one}}</div>-->
<!--            <div v-if="item.key!='repeatedList'">{{tableData[scope.$index][item.key]}}</div>-->
<!--          </template>-->
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="pageNo"
              :page-sizes="[10, 20, 30, 50,100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total"
      ></el-pagination>
    </div>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        excelName:'',
        pageNo:1,
        pageSize:10,
        total:null,
        tableData: [],
        startDate:'',
        loading:false,
        consultant:'',
        endDate:'',
        columns:[],
        type:'',
        tableCopyTableList:'',
        sort:false,
        originalData:[],
      }
    },
    mounted(){
      this.type=this.$route.query.type;
      this.startDate=this.$route.query.startDate;
      this.endDate=this.$route.query.endDate;
      this.consultant=this.$route.query.consultant;
      this.excelName=this.$route.query.name;
      this.getList()
      this.initTimeString();
    },
    methods:{
        //导出的方法
        exportExcel() {
            require.ensure([], () => {
                const { export_json_to_excel } = require('../../utils/excel/Export2Excel');
                // 上面设置Excel的表格第一行的标题
                let tHeader=[];
                // 上面的index、nickName、name是tableData里对象的属性
                let filterVal=[];
                this.columns.map((item,index)=>{
                    tHeader.push(item.title)
                    filterVal.push(item.key)
                })
                const list = this.originalData;  //把data里的tableData存到list
                const data = this.formatJson(filterVal, list);
                export_json_to_excel(tHeader, data, this.excelName);
            })
        },

        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => v[j]))
        },
      // 本地分页的方法
      paging(size, current) {
        const tableList = JSON.parse(JSON.stringify(this.tableCopyTableList));
        const tablePush = [];
        tableList.forEach((item, index) => {
          if (size * (current - 1) <= index && index <= size * current - 1) {
            tablePush.push(item);
          }
        });
        tablePush.map(item=>{
          if(item.repeatedList){
            item.repeatedList=item.repeatedList.join(',')
          }
        })
        console.log(tablePush)
        return tablePush;
      },
      handleCurrentChange(){
        this.tableData = this.paging(this.pageSize, this.pageNo);
      },
      handleSizeChange(pageSize){
        this.pageNo = 1;
        this.pageSize = pageSize;
        this.tableData = this.paging(this.pageSize, this.pageNo);
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
      getList(){
        let params={};
        params.startDate=this.startDate;
        params.endDate=this.endDate;
        params.type=this.type;
        params.consultant=this.consultant;
        this.$API.getIndicatorDetail(params).then(res => {
          const { data, msg, status } = res;
           console.log(1111,res);
          if (status == 200) {
            // var arr=[{wechatId:'weixin45',wechatName:'哈哈哈',firstEnter:'2019-08-07 12:00:00-哈哈哈',repeatedList:['2019-08-07 12:00:00-哈哈哈','2019-08-07 12:00:00-哈哈哈']}]
            this.tableData = data.data
            this.originalData=data.data
            this.columns = data.cols;
            this.total = this.tableData.length;
            this.pageNo = 1;
            this.tableCopyTableList = JSON.parse(JSON.stringify(this.tableData));
            this.tableData = this.paging(this.pageSize, this.pageNo);
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