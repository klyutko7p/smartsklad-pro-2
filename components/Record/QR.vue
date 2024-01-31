<script setup lang="ts">
import type { PropType } from "vue";

defineProps({
  value: { type: String },
  row: { type: Object as PropType<IOurRansom | IClientRansom | IDelivery>, required: true },
});

function printPage() {
  window.print();
}
</script>

<template>
  <h1 class="mt-10 text-2xl">Распечатка Штрих кода</h1>
  <div class="flex flex-col print-content cursor-pointer" @click="printPage">
    <div class="gap-0 flex flex-col">
      <CodeQR :value="value" class="mb-5" />
      <h1 class="text-6xl max-w-[600px] text-center mb-5" v-if="row.cell">{{ row.cell }}</h1>
      <h1 class="text-6xl text-center max-w-[600px]">{{ row.dispatchPVZ }}</h1>
    </div>
  </div>
</template>

<style>
/* Стили для печати */
@media print {
  body * {
    visibility: hidden;
  }

  .print-content,
  .print-content * {
    visibility: visible;
  }

  .print-content {
    position: absolute;
    top: 40%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%);
  }
}
</style>
