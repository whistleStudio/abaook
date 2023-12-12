<template>
  <div class="cover" @click="router.push('/home')">

  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter()

</script>

<style scoped lang="scss">
.cover {
  width: 100%;
  height: 100%;
  background: url(https://abaook-1300400818.cos.ap-nanjing.myqcloud.com/abao/cover/%E6%89%8B%E8%B4%A6%E5%B0%8F%E5%AE%9D-01.png) center/contain no-repeat;
  border-radius: 20%;
  cursor: pointer;
}
</style>