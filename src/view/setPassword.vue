<template>
  <div class="setPsw">
    <yd-cell-item arrow>
            <span slot="left">
              <img class="lock" src="../assets/images/time_s@2x.png" alt="">
            </span>
            <span slot="left" style="margin-left:.2rem;color:#000;font-size:.34rem">开始时间：</span>
            <yd-datetime type="datetime" v-model="datetime4" slot="right" style="margin-left:.3rem"></yd-datetime>
        </yd-cell-item>
    <yd-cell-item arrow>
            <span slot="left">
              <img class="lock" src="../assets/images/time_s@2x.png" alt="">
            </span>
            <span slot="left" style="margin-left:.2rem;color:#000;font-size:.34rem">结束时间：</span>
            <yd-datetime type="datetime" v-model="datetime5" slot="right" style="margin-left:.3rem"></yd-datetime>
        </yd-cell-item>
        <yd-cell-item style="border-bottom:1px solid #E4E4E4">
          <span slot="left">
              <img class="lock" src="../assets/images/mima@2x.png" alt="">
            </span>
            <span slot="left" style="margin-left:.2rem;color:#000;font-size:.34rem">设置密码：</span>
            <yd-input slot="right" type="password" max='8' :show-success-icon="false" v-model="input2" placeholder="请输入密码"></yd-input>
        </yd-cell-item>
        <div class="btn">
          <div class="sure" @click="sure()">确定</div>
          <div class="cancel" @click="cancel()">取消</div>
        </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      input2:'',
      datetime4: "",
      datetime5: "",
      customerId:this.$route.query.customerId,
      hotelId:this.$route.query.hotelId,
      houseId:this.$route.query.houseId,
      yearFormat:
        '<span style="color:#F00;">{value}<i style="font-size: 12px;margin-left: 1px;">年</i></span>',
      monthFormat:
        '<span style="color:#0BB20C;">{value}<i style="font-size: 12px;margin-left: 1px;">月</i></span>',
      dayFormat:
        '<span style="color:#FFB400;">{value}<i style="font-size: 12px;margin-left: 1px;">日</i></span>'
    }
  },
  mounted() {
    var newTime = new Date().getTime();
    var newTime1 = new Date(newTime)
    let date1 = new Date(new Date().getTime() + (3600*24*1000))
    let year = newTime1.getFullYear();
    let year1 = date1.getFullYear();
    let month = newTime1.getMonth() + 1;
    let month1 = date1.getMonth() + 1;
    let day = newTime1.getDate();
    let day1 = date1.getDate();

    let hours = newTime1.getHours();
    let minutes = newTime1.getMinutes();
    console.log(this.datetime4)
    this.datetime4 = year + '-' + (month >= 10 ? month : '0' + month) + '-' + (day >= 10 ? day : '0' + day) + ' ' + (hours >= 10 ? hours : '0' + hours) + ':' + (minutes >= 10 ? minutes : '0' + minutes)
    hours = hours + 1
    this.datetime5 = year1 + '-' + (month1 >= 10 ? month1 : '0' + month1) + '-' + (day1 >= 10 ? day1 : '0' + day1) + ' ' + '12:00'
    console.log(this.datetime4,'aaa')
  },
  methods: {
    sure(){
      if(this.input2 == ''){
        this.$dialog.toast({
            mes:'密码不能为空',
            icon:'error'
          })
          return
      }
      this.$api.getPassword({
        customerId:this.customerId,
        hotelId:this.hotelId,
        houseId:this.houseId,
        startTime:this.datetime4 + ':' + '00',
        endTime:this.datetime5 + ':' + '00',
        password:this.input2
      }).then(res=>{
        if(res.success){
          this.$dialog.loading.open('设置中')
          setTimeout(() => {
            this.$dialog.loading.close();
            this.$dialog.toast({
              mes:'设置成功',
              icon:'success'
            })
          }, 1500);
          this.$router.go(-1)
        }else{
          this.$dialog.toast({
              mes:'设置失败',
              icon:'error'
          })
        }
      })
    },
    cancel(){
      this.$router.go(-1)
    }
  }
};
</script>
<style>
.setPsw{
    padding-top: 1rem;
}
.yd-input{
  padding-left: .3rem
}
.setPsw .lock{
  width: .35rem;
  height: .32rem;
  margin-top: .05rem;
}
.setPsw .btn{
  width: 100%;
  display: flex;
  margin-top: 1.3rem;
  justify-content: space-around
}
.setPsw .btn div{
  font-size: .36rem;
  color: #fff;
  border-radius: 20px;
  padding: .15rem .8rem;
}
.sure{
  background: linear-gradient(to right top, #eb7521 , #fd9e4a);
}
.cancel{
  background: #bdbdbd
}
</style>

