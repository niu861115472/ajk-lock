<template>
  <div class="house_list">
    <div class="pull_menu">
      <div class="box" @click="showMenu()">
        <div class="left">
          <img src="../assets/images/hotel@2x.png" alt>
          <span>{{hotelName}}</span>
        </div>
        <div class="right">
          <img src="../assets/images/down@2x.png" alt>
        </div>
      </div>
      <div class="hide_menu" v-if="show">
        <ul>
          <li
            v-for="(item1,index) in list2"
            :key="index"
            @click="selectHouse(index,item1.name,item1.id)"
          >
            <span>{{item1.name}}</span>
            <img v-if="index == ins" src="../assets/images/xuanze2@2x.png" alt>
          </li>
        </ul>
      </div>
    </div>
    <div class="list">
      <ul>
        <li v-for="(item,index) in list" :key="index">
          <div style="display:flex">
            <h3>房间号码:{{item.name}}</h3>
            <div v-if="item.source == 1" class="record_btn1" @click="getPsw(item.id)">查看密码</div>
          </div>
            <div class="list_houseBox">
              <div class="left">
                  <div class="img_box" style="width:1.5rem;height:1.5rem">
                    <img src="../assets/images/lock1@2x.png" alt="">
                  </div>
                  <div v-if="item.source == 1"  class="psw_setBtn" @click="toSetPsw(item.hotelId,item.id)">密码设置</div>
                  <div v-if="item.source == 2" class="psw_setBtn" @click="clickDoor(item.serverId,item.source)">开锁</div>
              </div>
              <div class="right">
                  <!-- <p>电量:{{item.currentVoltage}}</p> -->
                  <p>电池状态:{{item.batStatus}}</p>
                  <p>在网状态:{{item.runStatus}}</p>
                  <div class="record_btn2" @click="toRecord(item.id,item.name)">开锁记录</div>
              </div>
            </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      customerId: this.$route.query.customerId,
      list2: [],
      list: [],
      ins: -1,
      open:false,
      show:false,
      hotelName: "",
      deviceId:''
    };
  },
  mounted() {
    this.getHouseList();
  },
  methods: {
    selectHouse(index, name, id) {
      this.ins = index;
      this.hotelName = name;
      //房间列表接口
      this.$api
        .getHouseList({
          customerId: this.customerId,
          hotelId: id
        })
        .then(res => {
          if (res.success) {
            this.list = res.dataObject;
            this.show = false
          }
        });
    },
    toRecord(id,name){
      this.$router.push({
        path:'/open_record',
        query:{
          houseId:id,
          name:this.hotelName + name
        }
      })
    },
    showMenu() {
      this.show = !this.show
    },
    //获取酒店列表
    getHouseList() {
      this.$api
        .getHotel({
          customerId: this.customerId
        })
        .then(res => {
          if (res.success) {
            this.list2 = res.dataObject;
            this.hotelName = res.dataObject[0].name;
            this.$api
              .getHouseList({
                customerId: sessionStorage.getItem('customerId'),
                hotelId: res.dataObject[0].id
              })
              .then(res => {
                if (res.success) {
                  this.list = res.dataObject;
                }
              });
          }
        });
    },
    //获取门锁设备
    getHouseLock(serverId){
      this.$api.getHostDevices({
        roomId:serverId,
        type:'GATE'
      })
      .then(res =>{
        this.deviceId = res.result[0].deviceId
        this.openDoor(this.deviceId)
      })
    },
    
    clickDoor(serverId){
      this.getHouseLock(serverId)
    },
  //开门
  openDoor(deviceId){
    this.$api.deviceControl({
        deviceId:deviceId,
        type:'GATE',
        op:'switch',
        val:'open'
      })
      .then(res =>{
        if(res.success){
          alert('开锁成功')
        }
      })
  },
    toSetPsw(hotelId, houseId) {
      this.$router.push({
        path: "/set_psw",
        query: {
          customerId: this.customerId,
          hotelId: hotelId,
          houseId: houseId
        }
      });
    },
    getPsw(id){
      this.$api.getHousePassword({
        customerId:this.customerId,
        houseId:id
      }).then(res=>{
        if(!res.dataObject){
          alert('暂无密码')
        }else{
          alert(res.dataObject.password)
        }
      })
    }
  }
};
</script>
<style scoped>
.house_list {
  position: absolute;
  width: 100%;
  background: #f5f5f5;
}
.house_list .pull_menu {
  position: relative;
  height: auto;
}
.house_list .pull_menu .box {
  display: flex;
  width: 100%;
  height: 50px;
  background-image: url(../assets/images/bg_k@2x.png);
  background-size: 100% 100%; 
  margin: 0rem 0.5rem 0 0rem;
  padding: 0.27rem 0.4rem;
}
.house_list .pull_menu .left img {
  width: 0.5rem;
  height: 0.5rem;
  position: relative;
  /* top: 0.04rem; */
}
.house_list .pull_menu .left span {
  position: relative;
  bottom: .1rem;
  margin-left: 0.15rem;
  font-size: 0.36rem;
  color: #fff
}
.house_list .pull_menu .right img {
  width: 0.35rem;
  height: 0.2rem;
  position: relative;
  top: 0.05rem;
  left: .3rem;
}
.house_list .pull_menu .hide_menu {
  width: 6.2rem;
  max-height: 3rem;
  margin: 0.2rem auto;
  overflow-y: scroll;
  background: #fff;
  border-radius: 6px;
}
.house_list .pull_menu .hide_menu ul {
  padding: 0 0.2rem;
}
.house_list .pull_menu .hide_menu ul li {
  display: flex;
  justify-content: space-between;
  padding: 0.3rem 0;
  border-bottom: 1px solid #e4e4e4;
}
.house_list .pull_menu .hide_menu ul li:last-child {
  border: none;
}
.house_list .pull_menu .hide_menu ul li span {
  display: block;
  margin-left: 0.68rem;
  font-size: 0.3rem;
  color: #8e8e8e;
}
.house_list .pull_menu .hide_menu ul li img {
  width: 0.33rem;
  height: 0.21rem;
  position: relative;
  right: 0.2rem;
  top: 0.1rem;
}
.house_list .list{
  width: 100%;
  padding: .3rem
}
.house_list .list ul li{
  margin-bottom: .3rem;
  background-image: url(../assets/images/bg_kuai@2x.png);
  background-size: cover;
}
.house_list .list ul li h3{
  font-size: normal;
  padding-top: .3rem;
  margin-left: .5rem;
}
.house_list .list ul li .list_houseBox{
  display: flex;
  padding: .4rem 0;
  justify-content: space-around
}
.house_list .list ul li .list_houseBox .left img{
  width: .42rem;
  height: .83rem;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
.house_list .list ul li .list_houseBox .right p{
  margin-bottom: .12rem;
  color: #8C8C8C
}
.img_box{
  width: 1.5em;
  height: 1.5em;
  position: relative;
  background: #f5f5f5;
  border-radius: 50%
}
.psw_setBtn,
.record_btn1,
.record_btn2,
.record_btn{
  width: 2rem;
  height: 0.55rem;
  line-height: .5rem;
  color: #FB9914;
  text-align: center;
  border: 2px solid #FDB451;
  margin-top: .2rem;
}
.record_btn1{
  position: absolute;
  right: 01rem;
}
.record_btn2{
  margin-top: .75rem;
}
</style>