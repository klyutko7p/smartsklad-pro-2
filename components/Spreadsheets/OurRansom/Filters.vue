<script setup lang="ts">
const props = defineProps({
  rows: { type: Array as PropType<IOurRansom[]>, required: true },
});

const storeRansom = useRansomStore();

let showFilters = ref(false);

const selectedCell = ref<number | string | null>(null);
const selectedName = ref<string | null>(null);
const selectedFromName = ref<string | null>(null);
const selectedProductName = ref<string | null>(null);
const selectedDispatchPVZ = ref<string | null>(null);
const selectedOrderPVZ = ref<string | null>(null);
const selectedOrderAccount = ref<string | null>(null);
const selectedAdditionally = ref<string | null>(null);
const startingDate = ref<Date | string | null>(null);
const endDate = ref<Date | string | null>(null);

const uniqueOrderAccounts = computed(() => {
  return storeRansom.getUniqueNonEmptyValues(props.rows, "orderAccount");
});

const uniqueOrderPVZ = computed(() => {
  return storeRansom.getUniqueNonEmptyValues(props.rows, "orderPVZ");
});

const uniquePVZ = computed(() => {
  return storeRansom.getUniqueNonEmptyValues(props.rows, "dispatchPVZ");
});

const uniqueCells = computed(() => {
  return storeRansom.getUniqueNonEmptyValues(props.rows, "cell");
});

const uniqueNames = computed(() => {
  return storeRansom.getUniqueNonEmptyValues(props.rows, "name");
});

const uniqueFromNames = computed(() => {
  return storeRansom.getUniqueNonEmptyValues(props.rows, "fromName");
});

const uniqueProductNames = computed(() => {
  return storeRansom.getUniqueNonEmptyValues(props.rows, "productName");
});

const uniqueAdditionally = computed(() => {
  return storeRansom.getUniqueNonEmptyValues(props.rows, "additionally");
});

const filteredRows = ref<Array<IOurRansom>>();

const emit = defineEmits(["filtered-rows"]);

const filterRows = () => {
  filteredRows.value = props.rows.slice();
  filteredRows.value = filteredRows.value.filter((row) => {
    return (
      (!selectedCell.value || row.cell === selectedCell.value) &&
      (!selectedFromName.value || row.fromName === selectedFromName.value) &&
      (!selectedName.value || row.name === selectedName.value) &&
      (!selectedProductName.value || row.productName === selectedProductName.value) &&
      (!selectedDispatchPVZ.value || row.dispatchPVZ === selectedDispatchPVZ.value) &&
      (!selectedOrderPVZ.value || row.orderPVZ === selectedOrderPVZ.value) &&
      (!selectedOrderAccount.value || row.orderAccount === selectedOrderAccount.value) &&
      (!selectedAdditionally.value || row.additionally === selectedAdditionally.value) &&
      (!startingDate.value || new Date(row.issued) >= new Date(startingDate.value)) &&
      (!endDate.value || new Date(row.issued) <= new Date(endDate.value))
    );
  });
  emit("filtered-rows", filteredRows.value);
};


function clearFields() {
  selectedCell.value = "";
  selectedAdditionally.value = "";
  selectedDispatchPVZ.value = "";
  selectedOrderPVZ.value = "";
  selectedOrderAccount.value = "";
  selectedFromName.value = "";
  selectedName.value = "";
  selectedAdditionally.value = "";
  selectedProductName.value = "";
  startingDate.value = "";
  endDate.value = "";
  filterRows();
}


watch(
  [
    selectedCell,
    selectedName,
    selectedFromName,
    selectedProductName,
    selectedDispatchPVZ,
    selectedOrderPVZ,
    selectedOrderAccount,
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
      <Icon @click="showFilters = !showFilters" class="cursor-pointer duration-200 hover:text-secondary-color"
        name="solar:filters-line-duotone" size="24" />
    </div>
    <div v-if="showFilters" class="border-2 border-gray-300 p-3 mt-3 border-dashed">
      <div class="grid grid-cols-2 max-xl:grid-cols-2 max-md:grid-cols-1">
        <div class="grid grid-cols-2 m-3 text-center border-b-2 py-2">
          <h1>Ячейка:</h1>
          <input type="text"
            class="bg-transparent max-w-[150px] px-3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
            v-model="selectedCell" list="uniqueCells">
          <datalist id="uniqueCells" class="">
            <option v-for="value in uniqueCells" :value="value">{{ value }}</option>
          </datalist>
        </div>
        <div class="grid grid-cols-2 m-3 text-center border-b-2 py-2">
          <h1>Имя:</h1>
          <input type="text"
            class="bg-transparent max-w-[150px] px-3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
            v-model="selectedName" list="uniqueNames">
          <datalist id="uniqueNames" class="">
            <option v-for="value in uniqueNames" :value="value">{{ value }}</option>
          </datalist>
        </div>
        <div class="grid grid-cols-2 m-3 text-center border-b-2 py-2">
          <h1>Телефон:</h1>
          <input type="text"
            class="bg-transparent max-w-[150px] px-3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
            v-model="selectedFromName" list="uniqueFromNames">
          <datalist id="uniqueFromNames" class="">
            <option v-for="value in uniqueFromNames" :value="value">{{ value }}</option>
          </datalist>
        </div>
        <div class="grid grid-cols-2 m-3 text-center border-b-2 py-2">
          <h1>Название товара:</h1>
          <input type="text"
            class="bg-transparent max-w-[150px] px-3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
            v-model="selectedProductName" list="uniqueProductNames">
          <datalist id="uniqueProductNames" class="">
            <option v-for="value in uniqueProductNames" :value="value">{{ value }}</option>
          </datalist>
        </div>
        <div class="grid grid-cols-2 m-3 text-center border-b-2 py-2">
          <h1>ПВЗ:</h1>
          <input type="text"
            class="bg-transparent max-w-[150px] px-3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
            v-model="selectedDispatchPVZ" list="uniquePVZ">
          <datalist id="uniquePVZ" class="">
            <option v-for="value in uniquePVZ" :value="value">{{ value }}</option>
          </datalist>
        </div>
        <div class="grid grid-cols-2 m-3 text-center border-b-2 py-2">
          <h1>СЦ:</h1>
          <input type="text"
            class="bg-transparent max-w-[150px] px-3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
            v-model="selectedOrderPVZ" list="uniqueOrderPVZ">
          <datalist id="uniqueOrderPVZ" class="">
            <option v-for="value in uniqueOrderPVZ" :value="value">{{ value }}</option>
          </datalist>
        </div>
        <div class="grid grid-cols-2 m-3 text-center border-b-2 py-2">
          <h1>Аккаунт Заказа:</h1>
          <input type="text"
            class="bg-transparent max-w-[150px] px-3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
            v-model="selectedOrderAccount" list="uniqueOrderAccounts">
          <datalist id="uniqueOrderAccounts" class="">
            <option v-for="value in uniqueOrderAccounts" :value="value">{{ value }}</option>
          </datalist>
        </div>
        <div class="grid grid-cols-2 m-3 text-center border-b-2 py-2">
          <h1>Дополнительно:</h1>
          <input type="text"
            class="bg-transparent max-w-[150px] px-3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
            v-model="selectedAdditionally" list="uniqueAdditionally">
          <datalist id="uniqueAdditionally" class="">
            <option v-for="value in uniqueAdditionally" :value="value">{{ value }}</option>
          </datalist>
        </div>
      </div>
      <div class="mt-10 grid grid-cols-1">
        <div class="grid grid-cols-2 m-3">
          <h1>Начальная дата (Выдача клиенту):</h1>
          <input
            class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
            type="date" v-model="startingDate" />
        </div>
        <div class="grid grid-cols-2 m-3">
          <h1>Конечная дата (Выдача клиенту):</h1>
          <input
            class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
            type="date" v-model="endDate" />
        </div>
      </div>
      <div class="flex justify-end gap-3 mt-3">
      <UIMainButton @click="showFilters = false">Принять</UIMainButton>
      <UIMainButton @click="clearFields()">Очистить фильтры</UIMainButton>
    </div>
  </div>
</div></template>
