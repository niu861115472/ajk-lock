<template>
    <div class="record">
        <div class="head">
            <div class="left">
                <img src="../assets/images/room@2x.png" alt="">
                <span>{{hotelName}}</span>
            </div>
            <div class="right" @click="showCalendar()">
                <img src="../assets/images/rili@2x.png" alt="">
                <span>全部日期</span>
            </div>
        </div>
        <div class="list">
            <ul>
                <yd-infinitescroll :callback="loadList" ref="infinitescrollDemo">
                    <yd-list theme="1" slot="list">
                        <li v-for="(item,index) in list" :key="index">
                            <p>
                                <span class="status">开锁时间：</span>
                                <span>{{item.openTime}}</span>
                            </p>
                            <!-- <p>
                                <span class="status">开锁密码：</span>
                                <span>{{item.password}}</span>
                            </p> -->
                            <p>
                                <span class="status">开锁状态：</span>
                                <span v-if="item.status == 1" class="suces">成功</span>
                                <span v-else class="suces1">失败</span>
                            </p>
                        </li>
                    </yd-list>
                    <!-- 数据全部加载完毕显示 -->
                    <span slot="doneTip">啦啦啦，啦啦啦，没有数据啦~~</span>
                </yd-infinitescroll>
            </ul>
        </div>
        <!-- 日历 -->
        <yd-popup v-model="show" position="center" width="90%">
            <Calendar
              v-on:choseDay="clickDay"
              v-on:changeMonth="changeDate"
              :markDate=arr
              v-on:isToday="clickToday"
              :sundayStart="true"
            ></Calendar>
      </yd-popup>
    </div>
</template>
<script>
import Calendar from 'vue-calendar-component';
export default {
    components: {
        Calendar
    },
    data(){
        return{
            hotelName:this.$route.query.name,
            houseId:this.$route.query.houseId,
            show:false,
            startTime:'',
            endTime:'',
            list:[],
            page:1,
            pageSize:6,
            arr:[]                                                                                                                                                                                                                                                                                                                                                                                                      
        }
    },
    mounted() {
        this.loadList()
    },
    methods: {
        clickDay(data) {
            console.log(data); //选中某天
            
            this.arr.push(data)
            if(this.arr.length == 2){
                this.$dialog.loading.open('加载中');
                setTimeout(() => {
                    this.$dialog.loading.close();
                    this.show = false
                }, 1500);

                let newArr = this.arr[0].split("/"); //选中某天
                let newArr1 = this.arr[1].split("/"); //选中另一天

                let month = newArr[1] < 10 ? ('0' + newArr[1]) : newArr[1];
                let month1 = newArr1[1] < 10 ? ('0' + newArr1[1]) : newArr1[1];
                let day = newArr[2] < 10 ? ('0' + newArr[2]) : newArr[2];
                let day1 = newArr1[2] < 10 ? ('0' + newArr1[2]) : newArr1[2];
                let Time = newArr[0] + '-' + month + '-' + day
                let Time1 = newArr1[0] + '-' + month1 + '-' + day1
                let stamp = new Date(Time).getTime();   //获取入住时间戳
                let stamp1 = new Date(Time1).getTime();   //获取入住时间戳
                
                if(stamp < stamp1){
                    this.startTime = Time;
                    this.endTime = Time1;
                }else{
                    this.startTime = Time1;
                    this.endTime = Time
                }
                this.page = 1;
                this.list = [];
                this.loadList()
                console.log(`开始:${this.startTime}`,`结束${this.endTime}`)
            }
        },
        changeDate(data) {
            console.log(data); //左右点击切换月份
        },
        clickToday(data) {
            console.log(data); //跳到了本月
        },
        showCalendar(){
            this.arr = []
            this.show = true
        },
        loadList(){
            this.$api.getSetHistory({
                pageNo:this.page,
                pageSize:this.pageSize,
                startTime:this.startTime,
                endTime:this.endTime,
                houseId:this.houseId
            })
            .then(res =>{
                if(res.success){
                    const _list = res.dataObject;
                    this.page = this.page + 1;
                    this.list = [...this.list, ..._list];
                    console.log(this.list)
                    this.list.sort(function(a,b){
                        console.log(a,b)
                        return b.openTime > a.openTime ? 1 : -1 
                    })
                    if (_list.length < this.pageSize) {
                        /* 所有数据加载完毕 */
                        this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.loadedDone');
                        return;
                    }
                    /* 单次请求数据完毕 */
                    this.$refs.infinitescrollDemo.$emit('ydui.infinitescroll.finishLoad');
                    
                }
            })
        }
    },
}
</script>
<style scoped>
    .record{
        background: #f1f1f1;
        height: 100%;
    }
    .record .head{
        display: flex;
        justify-content: space-between;
        padding: .2rem .5rem;
        background: #fff
    }
    .record .head .left img{
        width: 0.5rem;
        height: 0.5rem;
        position: relative;
        top: .1rem;
    }
    .record .head .right{
        margin-top: .1rem;
    }
    .record .head .right img{
        width: 0.33rem;
        height: 0.33rem;
        position: relative;
        top: 0.05rem;
    }
    .record .head .right span{
        font-size: .3rem;
        color: #378EEF
    }
    .record .list ul li{
        padding: .5rem;
        margin-top: .17rem;
        background: #fff
    }
    .record .list ul li p{
        margin-top: .17rem;
    }
    .record .list ul li p .status{
        color: #8C8C8C
    }
    .record .list ul li p .suces{
        color: rgb(29, 214, 29)
    }
    .record .list ul li p .suces1{
        color: rgb(214, 33, 33);
    }
</style>