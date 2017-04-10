<template>
  <div id="app">
    <!-- 头部  -->
    <div class="header">
      <i @click="isShowMenu=true" class="icon-menu"></i>
      <h1>GitHub Ranking</h1>
    </div>
    <!-- 内容主体 -->
    <div class="content">
      <i v-show="isLoading" class="icon-loading"></i>
      <div v-for="(item, index) of infos" v-show="!isLoading" class="item">
        <div class="name">
          <a :href="item ? item.link : 'https://microzz.com/'" target="_blank">{{ item ? item.title : '' }}</a>
        </div>
        <div class="desc">
          {{ item ? item.desc : '' }}
        </div>
        <div class="infos">
          <div class="lang">
            <span :class="[lang.replace('\#', '')]"></span>{{lang}}
          </div>
          <div class="star">
            <svg aria-label="star" class="octicon octicon-star" height="16" role="img" version="1.1" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74z"></path></svg>
            {{ item ? item.star : '' }}
          </div>
        </div>
        <div class="update">
          {{ item ? item.updateDate : ''}}
        </div>
      </div>
    </div>

    <!-- 侧边栏 -->
    <transition name="fadeIn">
      <div v-show="isShowMenu" class="menu">
        <div class="aside">
          <div class="aside-title">
            <h2>Languages</h2>
          </div>
          <div class="aside-content">
            <div @click="search(item, index)" v-for="(item, index) of langs" :class="{current: index===currentIndex}" class="lang-name">{{ item }}</div>
            <div @click="isShowAbout=true" class="lang-name">About</div>
            <div class="pos"></div>
          </div>
        </div>
        <div @click="isShowMenu=false" class="mask"></div>
      </div>
    </transition>

    <!-- 关于我 -->
    <transition name="showAbout">
      <div v-if="isShowAbout" class="about">
        <i @click="isShowAbout=false" class="close"></i>
        <div class="about-content">
          <h1>关于</h1>
          <p class="skill"><b>技术栈</b>：</p>
          <div>Vue2<br>axios<br>SASS(SCSS)<br>Express(上线版本是Koa2)<br>cheerio<br>request、request-promise<br>Webpack<br>ES6<br>HTML5<br>CSS3</div>
          <p class="url"><b>源码地址</b>：<a href="https://github.com/microzz/github-ranking" target="_blank">GitHub</a></p>
          <p class="url"><b>个人网站</b>：<a href="https://microzz.com/" target="_blank">microzz</a></p>
          <p><br>&nbsp;&nbsp;&nbsp;待业码农，求工作～～如果你觉得该项目不错，还可以请我吃辣条😄↓↓↓</p>
          <div class="help">
            <img src="./common/icons/help.png" alt="microzz.com">
          </div>
          <p class="copyright">有任何疑问请联系作者↓ <br>📩：<a href="mailto:zhaohui@microzz.com">zhaohui@microzz.com</a></p>
        </div>
        <div @click="isShowAbout=false" class="mask"></div>
      </div>
    </transition>

  </div>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
      infos: [],
      isLoading: false,
      isShowMenu: true,
      langs: ['JavaScript', 'HTML', 'CSS', 'PHP', 'Java', 'Ruby', 'CoffeeScript', 'Python', 'TypeScript', 'C#'],
      lang: 'JavaScript',
      currentIndex: '',
      isShowAbout: false
    }
  },

  methods: {
    getData(lang='JavaScript', sort='stars') {
      this.axios.get(`/api/github-ranking/${lang.replace('#', '%23')}/${sort}`)
        .then(result => result.data)
        .then(data => {
          Object.keys(data).forEach(item => {
            data[item].forEach((val, index) => {
              if (!this.infos[index]) {
                this.infos[index] = {};
              }
              this.infos[index][item.replace(/s$/, '')] = val;
            })
          })
          this.isLoading = false;
        })
    },
    search(lang, index) {
      this.currentIndex = index;
      this.lang = lang;
      this.getData(lang);
      this.isShowMenu = false;
      this.isLoading = true;
    }
  },
  created() {
    console.log("%c Powered by Zhaohui - microzz.com","background-image:-webkit-gradient( linear, left top,right top, color-stop(0, #00a419),color-stop(0.15, #f44336), color-stop(0.29, #ff4300),color-stop(0.3, #AA00FF),color-stop(0.4, #8BC34A), color-stop(0.45, #607D8B),color-stop(0.6, #4096EE), color-stop(0.75, #D50000),color-stop(0.9, #4096EE), color-stop(1, #FF1A00));color:transparent;-webkit-background-clip:text;font-size:13px;");

  }
}
</script>

<style lang="scss">
@import "./common/style/base.scss";

#app {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  .menu {
    position: absolute;
    display: flex;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    .aside {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 200px;
      height: 100%;
      box-shadow: 1px 0 20px gray;
      background-color: white;
      .aside-title {
        flex: 1;
        display: flex;
        width: 100%;
        justify-content: center;
        align-items: center;
        background-color: #2196F3;
        color: white;
        h2 {
          letter-spacing: 2px;
        }
      }
      .aside-content {
        width: 100%;
        flex: 10;
        display: flex;
        flex-direction: column;
        align-items: center;
        letter-spacing: 2px;
        text-align: center;
        .current {
          color: #FF6E40;
        }
        .lang-name {
          flex: 1;
          display: flex;
          padding-left: 20%;
          align-items: center;
          width: 100%;
          border-bottom: 1px solid rgba(0, 0, 0, .1);
          cursor: pointer;

        }
        .lang-name:hover {
          background-color: #FFF8E1;
        }
        .pos {
          flex: 3;
        }
      }
    }
    .mask {
      flex: 1;
      height: 100%;
    }
  }
  @media screen and (min-width: 500px) {
    .item {
      padding-left: 220px!important;
      padding-top: 10px!important;
      padding-bottom: 5px!important;
    }
    .name {
      font-size: 140% !important;
    }
    .desc {
      margin-top: 5px;
    }
    .infos {
      margin-top: 5px;
    }
    .update {
      margin-top: 5px;
    }
    .about {
      margin: auto;
      width: 60%;
    }
  }
  .header {
    position: relative;
    flex: 1;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #2196F3;
    color: white;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
    h1 {
      transition: .3s;
    }
    h1:hover {
      transform: rotate(6deg);
      transition: .3s;
    }
    i {
      position: absolute;
      display: inline-block;
      width: 30px;
      height: 30px;

    }
    i.icon-menu {
      left: 10px;
      bottom: 12px;
      background: url('./common/icons/menu.svg') no-repeat;
      background-size: contain;
      cursor: pointer;
    }
  }

  .content {
    position: relative;
    width: 100%;
    height: 100%;
    flex: 10;
    overflow: auto;
    text-align: center;

    .icon-loading {
      display: inline-block;
      width: 35px;
      height: 35px;
      margin-top: 8px;
      background: url('./common/icons/loading.svg') no-repeat;
      background-size: contain;
      animation: loading .6s linear infinite;
    }

    .item:hover {
      background-color: #FAFAFA;
    }

    .item {
      width: 100%;
      padding: 5px 10px;
      text-align: left;
      .name {
        font-size: 120%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-weight: bold;
      }
      .desc {
        padding-top: 2px;
      }
      .infos {
        display: flex;
        padding: 3px;
        .lang {
          padding-left: 10px;
          letter-spacing: 1px;
          flex: 3;
          span {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 6px;
            background-color: #f1e05a;
            margin-right: 3px;
          }
          .C {
            background-color: #178600;
          }
          .TypeScript {
            background-color: #2b7489;
          }
          .Python {
            background-color: #3572A5;
          }
          .CoffeScript {
            background-color: #244776;
          }
          .Ruby {
            background-color: #701516;
          }
          .Java {
            background-color: #b07219;
          }
          .PHP {
            background-color: #4F5D95;
          }
          .CSS {
            background-color: #563d7c;
          }
          .HTML {
            background-color: #e34c26;
          }
        }
        .star {
          flex: 1;
          height: 16px;
          .octicon {
            vertical-align: -2px;
            margin-right: 3px;

          }
        }
      }
      .update {
        color: gray;
        font-size: 90%;
      }

    }
    .item + .item {
      border-top: 1px solid rgba(0, 0, 0, .1);
    }

  }
}

.about {
  display: flex;
  position: absolute;
  z-index: 2;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  .close {
    position: absolute;
    z-index: 3;
    display: inline-block;
    width: 30px;
    height: 30px;
    background: url('./common/icons/close.svg') no-repeat;
    background-size: contain;
    top: 11%;
    right: 12%;
  }
  .about-content {
    position: relative;
    z-index: 2;
    width: 80%;
    height: 80%;
    background-color: white;
    border-radius: 10px;
    padding: 30px 10px;
    box-shadow: 0 0 20px gray;
    overflow: auto;

    h1 {
      text-align: center;
      font-size: 1.2rem;
      color: #31c27c;
      transition: .3s ease-in-out;
    }
    h1:hover {
      transform: rotate(15deg);
      transition: .3s ease-in-out;
    }

    p {
      text-indent: 1em;
      word-break: break-all;
      margin-top: 6px;

      b {
        display: inline-block;
        transition: .3s ease-in-out;
      }
      b:hover {
        transform: rotate(-10deg);
        transition: .3s ease-in-out;
      }

    }
    p.copyright {
      text-indent: 0;
    }
    div {
      // letter-spacing: 1px;
      padding-left: 50px;
    }
    .help {
      padding: 0;
      width: 100%;
      img {
        width: 100%;
        height: auto;
      }
    }
  }
  .mask {
    position: absolute;
    z-index: 0;
    width: 100%;
    height: 100%;
    background: none;
  }
}
.showAbout-enter-active {
  transition: all .4s ease-in-out;
}
.showAbout-leave-active {
  transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.showAbout-enter, .showAbout-leave-active {
  transform: rotateZ(180deg);
  opacity: 0;
}

.fadeIn-enter-active {
  transition: all .4s ease;
}
.fadeIn-leave-active {
  transition: all .2s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.fadeIn-enter, .fadeIn-leave-active {
  transform: translateX(-250px);
  opacity: 0;
}
@keyframes loading {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
