<script setup lang="ts">
import QrcodeVue from "qrcode.vue";

defineProps({
  value: { type: String },
});
</script>

<template>
  <qrcode-vue :size="130" :value="value" />
</template>

