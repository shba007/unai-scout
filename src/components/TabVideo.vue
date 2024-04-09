<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useClipboard } from '@vueuse/core';

import Tooltip from "./Tooltip.vue";
import { distribue } from "../utils/operations";

const videos = ref<{ url: string, type?: string, width: number, height: number, duration: number, fps: number }[]>([]);

async function loadVideos() {
	const [tab] = await chrome.tabs.query({ active: true });

	chrome.scripting.executeScript({
		target: { tabId: tab.id! },
		func: () => {
			const videoElems = [...document.querySelectorAll('video').values()]

			const result = videoElems.map((elem) => {
				const sourceElems = [...elem.children] as HTMLSourceElement[]

				return elem.src ?
					{ url: elem.src, duration: Math.round(elem.duration) } :
					{ url: sourceElems[0].src, type: sourceElems[0].type, duration: Math.round(elem.duration) }
			})

			return result
		}
	}, ([{ result }]) => {
		videos.value = result?.map(({ url, ...rest }) => ({ url: url, width: 0, height: 0, ...rest, fps: 0 })) ?? [];
	});
}

onMounted(() => { loadVideos() })


async function downloadVideos(url: string, filename: string) {
	return await new Promise((resolve) => {
		chrome.downloads.download({
			url: url,
			filename: filename,
			// saveAs: true
		}, (downloadId) => {
			if (downloadId == null) {
				if (chrome.runtime.lastError) {
					console.error(`${url}:`, chrome.runtime.lastError.message);
				}
			}
			resolve(null);
		});
	})
}

const { copy: copyClipboard } = useClipboard()
</script>

<template>
	<div v-if="videos.length > 0" class="flex-1 w-full">
		<span class="mr-auto text-sm font-medium">
			Total {{ videos.length }}
		</span>
		<!-- <div class="grid grid-cols-3 gap-2 justify-center items-center">
		<div v-for="{ url, type, duration } in videos" :key="url"
			class="relative rounded-md w-full h-full bg-slate-700 overflow-hidden group">
			<span class="hidden group-hover:inline absolute top-2 left-2 px-3 py-0.5 rounded-full bg-slate-800 text-xs">
				{{ duration }}s
			</span>
			<video controls playsinline>
				<source :src="url" :type="type">
				Your browser does not support the audio element.
			</video>
			<Tooltip mode="mini" @save="downloadImage(url, 'img-1')" @share="copyClipboard(url)" />
		</div>
	</div> -->
		<div class="flex justify-between gap-2">
			<div v-for="colVideos, coloum in distribue(videos, 3)" :key="coloum" class="flex-1 flex flex-col gap-2">
				<div v-for="{ url, type, duration } in colVideos" :key="url"
					class="relative rounded-md w-fulll bg-slate-700 overflow-hidden group">
					<span class="hidden group-hover:inline absolute top-2 left-2 px-3 py-0.5 rounded-full bg-slate-800 text-xs">
						{{ duration }}s
					</span>
					<video playsinline>
						<source :src="url" :type="type">
						Your browser does not support the audio element.
					</video>
					<Tooltip mode="mini" @save="downloadVideos(url, 'video-1')" @share="copyClipboard(url)" />
				</div>
			</div>
		</div>
	</div>
	<div v-else class="flex-1 flex items-center justify-center">
		No Video Found
	</div>
</template>