<script setup>
// import { ref, provide, watch, computed } from "vue";
import Header from "./components/Header.vue";
import Rout from "./rout.vue";
</script>

<template>
  <!-- <div class="bg-white w-5/6 m-auto rounded-xl shadow-xl mt-14"> -->
  <Header/>
  <Rout class="flex justify-center p-4 pb-0"/>
  <div class="p-10">
    <router-view></router-view>
  </div>
  <!-- </div> -->
</template>
