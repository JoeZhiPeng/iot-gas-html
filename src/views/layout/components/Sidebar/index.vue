<template>
  <scroll-bar>
    <div :class="sidebar.opened ? 'open-logos' : 'close-logos'">
      <div>
        <img src="../../../../assets/img/logo.png">
      </div>
      <p v-if="sidebar.opened">鸿巨热力家装燃气管理平台</p>
    </div>
    <el-menu mode="vertical" :default-active="$route.path" :collapse="isCollapse" :unique-opened=true background-color="#2e3d50" text-color="#adb8c1" active-text-color="#f4b02d">
      <sidebar-item :routes="permission_routers"></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar },
  computed: {
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .open-logos{
    width: 100%;
    height: 180px;
    color: #fff;
    text-align: center;
    padding-top: 20px;
    border-bottom: 1px solid #1e2b3b;
    div{
      width: 80px;
      height: 80px;
      margin: 0 auto;
      margin-bottom: 15px;
      background: #fff;
      border-radius: 50%;
      padding: 15px;
      img{
        width: 100%;
        transition: 0.28s;
      }
    }
    p{
      width: 130px;
      margin: 0 auto;
      font-weight: bolder
    }
  }
  .close-logos{
    text-align: center;
    padding: 15px 0 0 0;
    img{
      width: 30px;
      transition: 0.28s;
    }
  }
</style>