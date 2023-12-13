<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const isPlay = ref(false), player = ref()

function cdClick () {
  isPlay.value = !isPlay.value
  if (isPlay.value) player.value.play()
  else player.value.pause()
}

</script>

<template>
  <div class="main flex-col">
    <header>
      <nav class="flex-row">
        <RouterLink to="/">Cover</RouterLink>
        <RouterLink to="/home">Home</RouterLink>
      </nav>
    </header>
    <RouterView class="rv"/>
    <div class="cd" :class="{playing: isPlay}" @click="cdClick">

    </div>
    <audio ref="player" src="https://abaook-1300400818.cos.ap-nanjing.myqcloud.com/abao/music/%E8%8A%B1%E5%84%BF%E4%B9%90%E9%98%9F_%E5%8A%A0%E5%87%8F%E4%B9%98%E9%99%A4.m4a"></audio>    
  </div>

</template>

<style scoped lang="scss">
.main {
  height: 100vh;
  width: 100vw;
  background-color: rgb(255, 255, 235);
  position: relative;
  header {
    width: 20%;
    nav {
      justify-content: space-around;
    }
  }
  .rv {
    width: 80%;
    // background-color: orange;
  }
  .cd {
    position: absolute;
    width: 120px;
    height: 120px;
    top: 60px;
    right: 60px;
    // background-color: red;
    background: url("https://abaook-1300400818.cos.ap-nanjing.myqcloud.com/abao/music/%E9%98%BF%E7%93%9Ccd.png") center/cover no-repeat;
    border-radius: 50%;
    cursor: pointer;
    &.playing {
      animation: cdPlay 5s linear infinite;
    }
    @keyframes cdPlay {
      0% {transform: rotate(0deg);}
      50% {transform: rotate(180deg);}
      100% {transform: rotate(360deg);}
    }
  }
}
</style>
