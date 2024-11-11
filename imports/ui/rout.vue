<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    :ellipsis="false"
    @select="handleSelect"
  >
     <el-menu-item index="2">
      <img style="width: 100px" src="/rabbit-logo.jpg" alt="Rabbit Store" @click="navigateTo('home')" />
    </el-menu-item>

    <el-menu-item index="1" @click="navigateTo('items')">ITEMS</el-menu-item>

    <el-sub-menu index="3">
      <template #title>PRODUCT</template>
      <el-menu-item index="3-1" @click="navigateTo('categories')"
        >CATEGORY</el-menu-item
      >
      <el-menu-item index="3-2" @click="navigateTo('home')">HOME</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const activeIndex = ref("1");

const handleSelect = (key: string) => {
  activeIndex.value = key;
  console.log("Selected key:", key);
};

const navigateTo = (routeName: string) => {
  router.push({ name: routeName });
};
</script>

<style scoped>
.el-menu--horizontal > .el-menu-item:nth-child(1) {
  margin-right: auto;
}
</style>
