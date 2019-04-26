<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb class="breadcrumb-container"></breadcrumb>
  </el-menu> 
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
export default {
  components: {
    Hamburger,
    Breadcrumb,
  },
  computed: {
    ...mapGetters([
      'sidebar',
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 40px;
  line-height: 40px;
  border-radius: 0px !important;
  .breadcrumb-container{
    float: left;
  }
  .hamburger-container {
    line-height: 45px;
    height: 40px;
    float: left;
    padding: 0 10px;
    outline: none
  }
}
</style>
