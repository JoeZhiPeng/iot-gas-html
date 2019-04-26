<template>
  <div class="menu-wrapper">
    <template v-for="item in routes">
      <el-submenu :index="item.menuName||item.frontRouting"  v-if="item.children && item.children.length > 0" :key="item.frontRouting">
        <template slot="title">
          <span :class="item.menuIcon"></span>
          <span v-if="item.menuName" class="first-menu">{{item.menuName}}</span>
        </template>
        <template v-for="child in item.children">
          <!-- <sidebar-item  :routes="[child]" :key="child.path"></sidebar-item> -->
          <router-link  :to="child.frontRouting" :key="child.menuName">
            <el-menu-item  :index="child.frontRouting">
              <span class="second-menu">{{child.menuName}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
      <router-link v-else  :to="item.frontRouting" :key="item.menuName">
        <el-menu-item class="assf" :key="item.menuName" :index="item.frontRouting">
            <span :class="item.menuIcon"></span>
            <span  slot="title" class="first-menu">{{item.menuName}}</span>
        </el-menu-item>
      </router-link>
    </template>
  </div>
</template>

<script>
  import { mapGetters, mapMutations } from "vuex";
  export default {
    name: 'SidebarItem',
    props: {
      routes: {
        type: Array
      },
      isNest: {
        type: Boolean,
        default: false
      }
    },
    computed: {
        ...mapGetters(["permission_routers"])
      },
    mounted () {
      // console.info(this.routes)
    },
    methods: {

    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" >
  .menu-wrapper span {
		display: inline-table;
		width: 23px;
		height: 23px;
		margin-right: 10px;
		background-repeat: no-repeat;
		background-position: center center;
	}
  
  .second-menu{
    padding-left: 30px
  }

	.menu1-iocn {
		background-image: url(../../../../assets/img/menu1-iocn.png);
	}
	
	.menu2-iocn {
		background-image: url(../../../../assets/img/menu2-iocn.png);
	}
	
	.menu3-iocn {
		background-image: url(../../../../assets/img/menu3-iocn.png);
	}
	
	.menu4-iocn {
		background-image: url(../../../../assets/img/menu4-iocn.png);
	}
	
	.menu5-iocn {
		background-image: url(../../../../assets/img/menu5-iocn.png);
	}
  .assf {
    padding-left:15px!important;
  }
  .el-submenu__title{
     padding-left:15px!important;
  }
</style>