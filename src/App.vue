<script setup lang="ts">
import TabImage from "./components/TabImage.vue";
import TabAudio from "./components/TabAudio.vue";
import TabVideo from "./components/TabVideo.vue";
import { ref } from "vue";

// import './utils/tooltip'
const activeTab = ref<'image' | 'audio' | 'video'>('image')
</script>

<template>
  <main class="relative flex flex-col gap-2 items-center p-2 w-screen min-h-screen overflow-x-hidden">
    <nav>
      <ul class="flex gap-2">
        <li v-for="tab in ['image', 'audio', 'video'] as const"
          class="px-3 py-1 text-center align-middle rounded-full text-xs cursor-pointer capitalize"
          :class="activeTab === tab ? 'bg-blue-500' : 'bg-slate-700'" @click="activeTab = tab">{{ tab }}</li>
      </ul>
    </nav>
    <TabImage v-if="activeTab === 'image'" />
    <TabAudio v-else-if="activeTab === 'audio'" />
    <TabVideo v-else />
  </main>
</template>
<style>
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-tap-highlight-color: transparent;
  scrollbar-width: 6px
}

*::-webkit-scrollbar {
  @apply block w-[6px] bg-gray-800;
}

*::-webkit-scrollbar-thumb {
  @apply rounded-md bg-gray-500;
}

html {
  @apply relative scroll-smooth overflow-x-hidden;
}

body {
  @apply bg-gray-800 text-white text-base overflow-x-hidden min-w-[50rem] aspect-[4/3];
}
</style>