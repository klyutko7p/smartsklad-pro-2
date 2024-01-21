<script setup lang="ts">
import type { PropType } from "vue";

defineProps({
  value: { type: String },
  row: { type: Object as PropType<OurRansom>, required: true },
});

function printPage() {
  window.print();
}
</script>

<template>
  <h1 class="mt-10 text-2xl">Распечатка Штрих кода</h1>
  <div class="flex items-center gap-10 print-content cursor-pointer" @click="printPage">
    <h1 class="text-[160px]">{{ row.cell }}</h1>
    <div>
      <CodeQR :value="value" />
      <h1 class="text-lg text-center max-w-[100px] break-words">{{ row.orderPVZ }}</h1>
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
    top: 50%;
    left: 50%;
    margin-right: -50%;
    transform: translate(-50%, -50%); 
  }
}
</style>
