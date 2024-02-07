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
    <div class="gap-0 flex flex-col absolute mr-10">
      <CodeQR :value="value" class="mt-10" />
      <h1 class="text-base"> {{ row.id }} </h1>
      <h1 class="text-7xl max-w-[500px] text-center relative mb-3" v-if="row.cell">{{ row.cell }}</h1>
      <h1 class="text-8xl text-center max-w-[500px] relative">{{ row.dispatchPVZ }}</h1>
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
    left: 15%;
    top: 20%;
  }
}
</style>
