<template>
  <div class="tags-view-container">
    <scroll-pane class='tags-view-wrapper' ref='scrollPane'>
      <router-link ref='tag' class="tags-view-item" :class="isActive(tag)?'active':''" v-for="tag in Array.from(visitedViews)"
        :to="tag.path" :key="tag.path" @contextmenu.prevent.native="openMenu(tag,$event)">
          {{tag.name}}
        <span class='el-icon-close' @click.prevent.stop='closeSelectedTag(tag)'></span>
      </router-link>

      <el-menu class="navbar" >
        <div class="right-menu">
          <el-badge :value="8" :max="99" class="warning-item" id="warnNum" @click.native="openAlarmLists">
            <img src="../../../assets/img/warning.png">
          </el-badge>
          <el-dropdown class="avatar-container right-menu-item" trigger="click">
            <div class="avatar-wrapper">
              <img src="../../../assets/img/login-peo.png">
              <span v-if="userInfo.nick">{{userInfo.nick}}</span>
              <span v-else>管理员</span>
              <i class="el-icon-caret-bottom"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <router-link to="/user/Personal">
                <el-dropdown-item>
                  个人资料
                </el-dropdown-item>
              </router-link>

              <el-dropdown-item>
                修改密码
              </el-dropdown-item>

              <el-dropdown-item divided>
                <span @click="logout" style="display:block;">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-menu>
    </scroll-pane>
    <ul class='contextmenu' v-show="visible" :style="{left:left+'px',top:top+'px'}">
      <li @click="closeSelectedTag(selectedTag)">关闭当前</li>
      <li @click="closeOthersTags">关闭其它</li>
      <li @click="closeAllTags">关闭所有</li>
    </ul>

    <!-- 告警列表 -->
    <el-card class="box-card" v-show="isShow" shadow="always" id="alarmCard">
      <div slot="header" class="clearfix">
        <span>告警列表</span>
        <i class="el-icon-close close-card" @click="isShow = false"></i>
        <el-button class="more-btn" type="text" @click="alarmListHide">
          <span>查看更多</span>
        </el-button>
      </div>
      <div v-for="item in lists" :key="item.index" class="text item">
        <span>
          <i class="el-icon-warning"></i>
        住户{{item.homeMaster}}在{{item.startTime}}发出
          <span v-if="item.alarmType == 1" style="color: #c4090c">温度过高</span>
          <span v-if="item.alarmType == 2" style="color: #c4090c">主机故障</span>
          告警通知
        </span>
          <a>标记为已读</a>
      </div>
    </el-card>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import ScrollPane from '@/components/ScrollPane'
  import Breadcrumb from '@/components/Breadcrumb'
  import Hamburger from '@/components/Hamburger'
  import TagsView from './Navbar'
  export default {
    components: {
      ScrollPane,
      Breadcrumb,
      Hamburger,
      TagsView,
    },
    data() {
      return {
        visible: false,
        top: 0,
        left: 0,
        selectedTag: {},
        isShow: false,
        lists: [
          {
            "homeMaster": "张三",
            "startTime": "2019-04-01 14:58:50",
            "alarmType": "1"
          },{
            "homeMaster": "李四",
            "startTime": "2019-04-01 14:58:50",
            "alarmType": "2"
          },
          {
            "homeMaster": "张三",
            "startTime": "2019-04-01 14:58:50",
            "alarmType": "1"
          },{
            "homeMaster": "李四",
            "startTime": "2019-04-01 14:58:50",
            "alarmType": "2"
          },
          {
            "homeMaster": "张三",
            "startTime": "2019-04-01 14:58:50",
            "alarmType": "1"
          }
        ]
      }
    },
    computed: {
      visitedViews() {
        return this.$store.state.tagsView.visitedViews
      },
      ...mapGetters([
        'sidebar',
        'name',
        'userInfo'
      ])
    },
    watch: {
      $route() {
        this.addViewTags()
        this.moveToCurrentTag()
      },
      visible(value) {
        if (value) {
          document.body.addEventListener('click', this.closeMenu)
        } else {
          document.body.removeEventListener('click', this.closeMenu)
        }
      },

    },
    mounted() {
      let vm = this
      this.addViewTags();
      $(document).bind('click', function(e) {
        let target = $(e.target);
        if(target.closest('#alarmCard, #warnNum').length == 0) {
          vm.isShow = false
        }
        e.stopPropagation()
      })
    },
    methods: {
      openAlarmLists() {
        this.isShow = !this.isShow
      },
      generateRoute() {
        if (this.$route.name) {
          return this.$route
        }
        return false
      },
      isActive(route) {
        return route.path === this.$route.path || route.name === this.$route.name
      },
      addViewTags() {
        const route = this.generateRoute()
        if (!route) {
          return false
        }
        this.$store.dispatch('addVisitedViews', route)
      },
      moveToCurrentTag() {
        const tags = this.$refs.tag
        this.$nextTick(() => {
          for (const tag of tags) {
            if (tag.to === this.$route.path) {
              this.$refs.scrollPane.moveToTarget(tag.$el)
              break
            }
          }
        })
      },
      closeSelectedTag(view) {
        this.$store.dispatch('delVisitedViews', view).then((views) => {
          if (this.isActive(view)) {
            const latestView = views.slice(-1)[0]
            if (latestView) {
              this.$router.push(latestView.path)
            } else {
              this.$router.push('/')
            }
          }
        })
      },
      closeOthersTags() {
        this.$router.push(this.selectedTag.path)
        this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
          this.moveToCurrentTag()
        })
      },
      closeAllTags() {
        this.$store.dispatch('delAllViews')
        this.$router.push('/')
      },
      openMenu(tag, e) {
        this.visible = true
        this.selectedTag = tag
        this.left = e.clientX
        this.top = e.clientY
      },
      closeMenu() {
        this.visible = false
      },
      toggleSideBar() {
        this.$store.dispatch('toggleSideBar')
      },
      logout() {
        this.$store.dispatch('LogOut').then(() => {
          location.reload()
        })
      },
      alarmListHide() {
        this.isShow = false
        this.$router.push({
          name: '告警监控'
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.box-card{
  position: absolute;
  top: 60px;
  right: 15px;
  z-index: 999;
  border-radius: 5px;
  .more-btn{
    float: right; 
    padding: 3px 0;
    color: #3082f3;
    &:hover{
      color: #2069cf
    }
  }
  .close-card{
    float: right;
    color: #aaa;
    margin-left: 15px;
    margin-top: -10px;
    margin-right: -10px;
    cursor: pointer;
    border-radius: 50%;
    &:hover{
      background: #f56c6c;
      color: #fff
    }
  }
  .text {
    font-size: 14px;
    cursor: pointer;
    &>span:hover{
      color: #f4b02d
    }
    i{
      font-size: 12px;
      color: #f4b02d;
      margin-right: 5px
    }
    a{
      color: #3082f3;
      margin-left: 5px;
      &:hover{
        color: #2069cf
      }
    }
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }
}
.tags-view-container {
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    position: fixed;
    top: 0;
    right: 0;
    z-index: 1001;
    width: 0;
    color:#888;

    .errLog-container {
      display: inline-block;
      vertical-align: top;
      color:#888;
    }
    .right-menu {
      color:#888;
      float: right;
      height: 100%;
      &:focus{
        outline: none;
      }
      .warning-item{
        right: 20px;
        cursor: pointer;
      }
      .right-menu-item {
        display: inline-block;
        margin: 0 8px;
        color:#888;
      }
      .screenfull {
        height: 20px;
        color:#888;
      }
      .international{
        vertical-align: top;
        color:#888;
      }
      .theme-switch {
        vertical-align: 15px;
        color:#888;
      }
      .avatar-container {
        height: 50px;
        margin-right: 30px;
        .avatar-wrapper {
          cursor: pointer;
          margin-top: 12px;
          position: relative;
          img{
            margin: 0 10px;
          }
          .user-avatar {
            width: 40px;
            height: 40px;
            border-radius: 10px;
            color:#888;
          }
          .el-icon-caret-bottom {
            position: absolute;
            right: -20px;
            top: 5px;
            font-size: 12px;
            color:#888;
          }
        }
      }
    }
  }
  .tags-view-wrapper {
    height: 50px;
    border-bottom: 1px solid #d8dce5;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);
    // padding-left: 200px;
    .tags-view-item {
      display: inline-block;
      position: relative;
      height: 26px;
      line-height: 26px;
      border: 1px solid #777;
      color: #777;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 13px;
      vertical-align: super;
      border-radius: 3px;
      &:first-of-type {
        margin-left: 15px;
      }
      &.active {
        background-color: #f4b02d;
        color: #fff;
        border-color: #f4b02d;
        &::before {
          content: '';
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 2;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
