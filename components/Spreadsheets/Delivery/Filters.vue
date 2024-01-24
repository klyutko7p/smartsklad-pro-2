<script setup lang="ts">
const props = defineProps({
  rows: { type: Array as PropType<IDelivery[]>, required: true },
});

const storeRansom = useRansomStore();

let showFilters = ref(false);

const selectedName = ref<string | null>(null);
const selectedNameOfAction = ref<string | null>(null);
const selectedFromName = ref<string | null>(null);
const selectedDispatchPVZ = ref<string | null>(null);
const selectedOrderPVZ = ref<string | null>(null);
const selectedAdditionally = ref<string | null>(null);
const startingDate = ref<Date | string | null>(null);
const endDate = ref<Date | string | null>(null);

const uniqueOrderPVZ = computed(() => {
  return storeRansom.getUniqueNonEmptyValues(props.rows, "orderPVZ");
});

const uniqueNameOfAction = computed(() => {
  return storeRansom.getUniqueNonEmptyValues(props.rows, "nameOfAction");
});

const uniquePVZ = computed(() => {
  return storeRansom.getUniqueNonEmptyValues(props.rows, "dispatchPVZ");
});

const uniqueNames = computed(() => {
  return storeRansom.getUniqueNonEmptyValues(props.rows, "name");
});

const uniqueFromNames = computed(() => {
  return storeRansom.getUniqueNonEmptyValues(props.rows, "fromName");
});

const uniqueAdditionally = computed(() => {
  return storeRansom.getUniqueNonEmptyValues(props.rows, "additionally");
});

const filteredRows = ref<Array<IDelivery>>();

const emit = defineEmits(["filtered-rows"]);

const filterRows = () => {
  filteredRows.value = props.rows.slice();
  filteredRows.value = props.rows.filter((row) => {
    return (
      (!selectedFromName.value || row.fromName === selectedFromName.value) &&
      (!selectedNameOfAction.value || row.nameOfAction === selectedNameOfAction.value) &&
      (!selectedName.value || row.name === selectedName.value) &&
      (!selectedDispatchPVZ.value || row.dispatchPVZ === selectedDispatchPVZ.value) &&
      (!selectedOrderPVZ.value || row.orderPVZ === selectedOrderPVZ.value) &&
      (!selectedAdditionally.value || row.additionally === selectedAdditionally.value) &&
      (!startingDate.value || new Date(row.paid) >= new Date(startingDate.value)) &&
      (!endDate.value || new Date(row.paid) <= new Date(endDate.value))
    );
  });
  emit("filtered-rows", filteredRows.value);
};


function clearFields() {
  selectedAdditionally.value = "";
  selectedNameOfAction.value = "";
  selectedDispatchPVZ.value = "";
  selectedOrderPVZ.value = "";
  selectedFromName.value = "";
  selectedName.value = "";
  selectedAdditionally.value = "";
  startingDate.value = "";
  endDate.value = "";
  filterRows();
}

watch(
  [
    selectedName,
    selectedNameOfAction,
    selectedFromName,
    selectedDispatchPVZ,
    selectedOrderPVZ,
    selectedAdditionally,
    startingDate,
    endDate
  ],
  filterRows
);
</script>

<template>
  <div>
    <div class="flex items-center gap-3">
      <h1 class="text-xl font-bold">Фильтры</h1>
      <Icon
        v-if="!showFilters"
        @click="showFilters = !showFilters"
        class="cursor-pointer duration-200 hover:text-secondary-color"
        name="material-symbols:keyboard-double-arrow-down-rounded"
        size="24"
      />
      <Icon
        v-if="showFilters"
        @click="showFilters = !showFilters"
        class="cursor-pointer duration-200 hover:text-secondary-color"
        name="material-symbols:keyboard-double-arrow-up-rounded"
        size="24"
      />
    </div>
    <div v-if="showFilters" class="border-2 border-gray-300 p-3 mt-3 border-dashed">
      <div class="grid grid-cols-4 max-xl:grid-cols-2 max-md:grid-cols-1">
        <div class="grid grid-cols-2 m-3">
          <h1>Имя</h1>
          <select
            v-model="selectedName"
            class="max-w-[150px] max-md:w-full max-md:max-w-none py-1 px-2 border-2 bg-transparent rounded-lg text-base disabled:text-gray-400"
          >
            <option v-for="value in uniqueNames" :value="value">
              {{ value }}
            </option>
          </select>
        </div>
        <div class="grid grid-cols-2 m-3">
          <h1>Телефон</h1>
          <select
            v-model="selectedFromName"
            class="max-w-[150px] max-md:w-full max-md:max-w-none py-1 px-2 border-2 bg-transparent rounded-lg text-base disabled:text-gray-400"
          >
            <option v-for="value in uniqueFromNames" :value="value">
              {{ value }}
            </option>
          </select>
        </div>
        <div class="grid grid-cols-2 m-3">
          <h1>Название</h1>
          <select
            v-model="selectedNameOfAction"
            class="max-w-[150px] max-md:w-full max-md:max-w-none py-1 px-2 border-2 bg-transparent rounded-lg text-base disabled:text-gray-400"
          >
            <option v-for="value in uniqueNameOfAction" :value="value">
              {{ value }}
            </option>
          </select>
        </div>
        <div class="grid grid-cols-2 m-3">
          <h1>ПВЗ</h1>
          <select
            v-model="selectedDispatchPVZ"
            class="max-w-[150px] max-md:w-full max-md:max-w-none py-1 px-2 border-2 bg-transparent rounded-lg text-base disabled:text-gray-400"
          >
            <option v-for="value in uniquePVZ" :value="value">
              {{ value }}
            </option>
          </select>
        </div>
        <div class="grid grid-cols-2 m-3">
          <h1>СЦ</h1>
          <select
            v-model="selectedOrderPVZ"
            class="max-w-[150px] max-md:w-full max-md:max-w-none py-1 px-2 border-2 bg-transparent rounded-lg text-base disabled:text-gray-400"
          >
            <option v-for="value in uniqueOrderPVZ" :value="value">
              {{ value }}
            </option>
          </select>
        </div>
        <div class="grid grid-cols-2 m-3">
          <h1>Дополнительно</h1>
          <select
            v-model="selectedAdditionally"
            class="max-w-[150px] max-md:w-full max-md:max-w-none py-1 px-2 border-2 bg-transparent rounded-lg text-base disabled:text-gray-400"
          >
            <option v-for="value in uniqueAdditionally" :value="value">
              {{ value }}
            </option>
          </select>
        </div>
      </div>
      <div class="mt-10 grid grid-cols-1">
        <div class="grid grid-cols-2 m-3">
          <h1>Начальная дата (Оплачено)</h1>
          <input
            class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
            type="date"
            v-model="startingDate"
          />
        </div>
        <div class="grid grid-cols-2 m-3">
          <h1>Конечная дата (Оплачено)</h1>
          <input
            class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
            type="date"
            v-model="endDate"
          />
        </div>
      </div>
      <div class="flex justify-end mt-3">
        <UIMainButton @click="clearFields()">Очистить фильтры</UIMainButton>
      </div>
    </div>
  </div>
</template>
