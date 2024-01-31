<script setup lang="ts">
import QrcodeVue, { Level, RenderAs } from 'qrcode.vue'
const renderAs = ref<RenderAs>('svg')

defineProps({
  value: { type: String },
});
</script>

<template>
  <qrcode-vue :size="500" :value="value" level="H" :render-as="renderAs" />
</template>

