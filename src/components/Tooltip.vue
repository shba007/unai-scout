<script setup lang="ts">
import { icons } from '../utils/icons'

withDefaults(defineProps<{
	mode?: 'full' | 'mini'
}>(), { mode: 'full' })

const emit = defineEmits<{
	(event: 'save'): void,
	(event: 'share'): void,
}>()

const data = [
	{ icon: 'copy', content: 'save' },
	{ icon: 'link', content: 'share' }
] as const
</script>

<template>
	<div class="absolute bottom-2 right-2 hidden group-hover:flex gap-2">
		<button v-for="{ icon, content } in data" :key="content" @click="content === 'save' ? emit('save') : emit('share')"
			class="flex gap-2 justify-center items-center rounded-full"
			:class="[mode === 'full' ? 'p-1 pr-3 bg-gray-900 hover:bg-gray-800' : 'border-2 border-black bg-white hover:bg-slate-300']">
			<span class="rounded-full p-1 size-6" :class="{ 'bg-white': mode === 'full' }">
				<img :src="icons[icon]" class="w-full h-full" />
			</span>
			<span v-if="mode === 'full'" class="mb-0.5 capitalize">{{ content }}</span>
		</button>
	</div>
</template>