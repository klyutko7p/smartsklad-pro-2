<script setup lang="ts">
const emit = defineEmits(["createData"]);

let name = ref("");
let address = ref("");

defineProps({
  title: { type: String, required: true },
});

function createData() {
  emit("createData", { name: name.value, address: address.value  });
}
</script>

<template>
  <div class="mt-10">
    <h1 class="text-xl mb-2">
      Добавить {{ title }}
      <Icon
        class="text-yellow-400"
        name="material-symbols:add"
        size="24"
      />
    </h1>
    <div class="flex items-center gap-3">
      <div class="flex flex-col gap-3">
        <label for="username">Название</label>
        <input
          class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
          v-model="name"
          name="name"
          type="text"
        />
      </div>
      <div class="flex flex-col gap-3">
        <label for="username">Адрес</label>
        <input
          class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
          v-model="address"
          name="address"
          type="text"
        />
      </div>
    </div>
    <UIMainButton class="mt-3" @click="createData">Добавить</UIMainButton>
  </div>
</template>
