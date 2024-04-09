<script setup lang="ts">
import { onMounted, ref } from 'vue';

const audios = ref<{ url: string, type?: string, duration: number, bitrate: number }[]>([]);

async function loadAudios() {
	const [tab] = await chrome.tabs.query({ active: true });

	chrome.scripting.executeScript({
		target: { tabId: tab.id! },
		func: () => {
			const audioElems = [...document.querySelectorAll('audio').values()]

			const result = audioElems.map((elem) => {
				const sourceElems = [...elem.children] as HTMLSourceElement[]

				return { url: sourceElems[0].src, type: sourceElems[0].type, duration: elem.duration }
			})

			return result
		}
	}, ([{ result }]) => {
		audios.value = result?.map(({ url, ...rest }) => ({ url: url, ...rest, bitrate: 0 })) ?? [];
	});
}

onMounted(() => { loadAudios() })
</script>

<template>
	<div v-if="audios.length > 0" class="flex-1 w-full">
		<span class="mr-auto text-sm font-medium">
			Total {{ audios.length }}
		</span>
		<div class="grid grid-cols-2 gap-2 justify-center items-center">
			<div v-for="{ url, type, duration } in audios" :key="url"
				class="relative rounded-md w-full h-full bg-slate-700 overflow-hidden group">
				<span class="hidden group-hover:inline absolute top-2 left-2 px-3 py-0.5 rounded-full bg-slate-800 text-xs">
					{{ duration }}s
				</span>
				<audio controls>
					<source :src="url" :type="type">
					Your browser does not support the audio element.
				</audio>
				<!-- <Tooltip mode="mini" @save="downloadImage(url, 'img-1')" @share="copyClipboard(url)" /> -->
			</div>
		</div>
	</div>
	<div v-else class="flex-1 flex items-center justify-center">
		No Audio Found
	</div>
</template>