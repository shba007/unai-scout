<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useClipboard } from '@vueuse/core';

import { distribue } from "../utils/operations";
import Tooltip from "./Tooltip.vue";

const images = ref<{ url: string, name: string, width: number, height: number }[]>([]);

async function loadImages() {
	const [tab] = await chrome.tabs.query({ active: true });

	chrome.scripting.executeScript({
		target: { tabId: tab.id! },
		func: () => {
			const imageUrls = new Set<string>([])
			const emptyImage = { url: '', name: '', width: 0, height: 0 }
			const imgElems = [...document.querySelectorAll('img').values()];

			const result = imgElems.map((elem) => {
				if (!elem.srcset) {
					if (imageUrls.has(elem.src))
						return emptyImage
					imageUrls.add(elem.src)

					return { url: elem.src, name: elem.alt, width: elem.naturalWidth, height: elem.naturalHeight }
				}

				const sources = elem.getAttribute('srcset')?.split(',');

				if (!sources)
					return emptyImage

				const output = sources.reduce((maxImage, source) => {
					const [url, resolutionDescriptor] = source.trim().split(' ');
					const [width, height] = resolutionDescriptor.split('x').map(dim => parseInt(dim));

					return width > maxImage.width ? { url, name: elem.alt, width, height } : maxImage
				}, emptyImage)

				if (imageUrls.has(output.url))
					return emptyImage

				imageUrls.add(output.url)
				return output
			}).filter(({ url }) => url.length)

			result.sort(({ width, height }) => width * height);

			return result
		},
	}, ([{ result }]) => {
		images.value = result?.map(({ url, ...rest }) => ({ url: url, ...rest })) ?? [];
	});
}

onMounted(() => { loadImages() })

async function downloadImage(url: string, filename: string) {
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
	<div v-if="images.length > 0" class="flex-1 w-full">
		<span class="mr-auto text-sm font-medium">
			Total {{ images.length }}
		</span>
		<!-- <div class="grid grid-cols-4 gap-2 justify-center items-center">
		<div v-for="{ url, name, width, height } in images" :key="name"
			class="relative rounded-md aspect-square bg-slate-700 overflow-hidden group">
			<span class="hidden group-hover:inline absolute top-2 left-2 px-3 py-0.5 rounded-full bg-slate-800 text-xs">
				{{ width }}⨯{{ height }}
			</span>
			<img :src="url" :alt="name" class="w-full h-full object-contain" />
			<Tooltip mode="mini" @save="downloadImage(url, 'img-1')" @share="copyClipboard(url)" />
		</div>
	</div> -->
		<div class="flex justify-between gap-2">
			<div v-for="colImages, coloum in distribue(images, 3)" :key="coloum" class="flex-1 flex flex-col gap-2">
				<div v-for="{ url, name, width, height } in colImages" :key="url"
					class="relative rounded-md w-fulll bg-slate-700 overflow-hidden group">
					<span class="hidden group-hover:inline absolute top-2 left-2 px-3 py-0.5 rounded-full bg-slate-800 text-xs">
						{{ width }}⨯{{ height }}
					</span>
					<img :src="url" :alt="name" class="w-full h-full object-contain" />
					<Tooltip mode="mini" @save="downloadImage(url, 'img-1')" @share="copyClipboard(url)" />
				</div>
			</div>
		</div>
	</div>
	<div v-else class="flex-1 flex items-center justify-center">
		No Image Found
	</div>
</template>