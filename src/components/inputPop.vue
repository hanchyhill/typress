<template>
  <div class="slider">
    
    <el-slider :show-tooltip="true" v-model="value1" @change="updateValue"></el-slider>
  </div>
</template>
<script>
  export default {
    name:
    'input-pop',

    props: {
      'value': Number
    },
    data: function() {
      //console.log(this.value);
      var _this = this;
      return {
        value1:_this.value
        }
    },
    computed: {
    },
    watch: {
    },
    methods: {
      updateValue:function(){
        //console.log(this.value1);
        this.$emit('changeInput', this.value1);
      }
    }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.slider{
  background-color:white;
}
</style>
