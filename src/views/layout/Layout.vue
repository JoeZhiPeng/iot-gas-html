<template>
  <div class="app-wrapper" :class="{hideSidebar:!sidebar.opened}">
    <navbar class="tags-navbar"></navbar>
    <div class="main-container">
      <sidebar class="sidebar-container"></sidebar>
      <br/>
      <br/>
      <br/>
      <breadcard></breadcard>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
  import {Navbar, Sidebar, AppMain, Breadcard} from './components'

  export default {
    name: 'layout',
    components: {
      Navbar,
      Sidebar,
      AppMain,
      Breadcard
    },
    computed: {
      sidebar() {
        return this.$store.state.app.sidebar
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import '../../assets/css/mixin.scss';
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
  }

  .tags-navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    background-color: #fff;
    position: fixed;
    z-index: 1001;
    width: 100%;
    color:white;
    padding-left: 220px;
    transition: padding-left 0.28s;
  }
  .hideSidebar .tags-navbar{
    padding-left: 30px
  }
</style>
