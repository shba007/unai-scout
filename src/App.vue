<script setup lang="ts">
import { ref } from 'vue';

const images = ref<string[]>([])

async function fetchImages() {
  console.log("on fetchImage start")
  const [tab] = await chrome.tabs.query({ active: true })

  chrome.scripting.executeScript({
    target: { tabId: tab.id! },
    func: getImages,
  }, async (injectionResult) => {
    console.log(injectionResult)
  });

  console.log("on fetchImage end")
}

function getImages() {
  console.log("on fetchImage innerfunction start")
  const imgsElems = [...document.querySelectorAll('img').values()];
  return imgsElems.map((imgElem) => imgElem.src)
}
</script>

<template>
  <main class="flex justify-center items-center min-w-[40rem] aspect-video">
    <button class="px-4 py-1 rounded-md font-medium bg-blue-400 active:bg-blue-300" @click="fetchImages">
      Fetch
    </button>
    <div class="flex flex-wrap">
      <img v-for="image in images" :key="image" :src="image" :alt="image" />
    </div>
  </main>
</template>

<style>
body {
  @apply bg-gray-800 text-white text-base;
}
</style>