<script setup lang="ts">
import type { ClientRansom } from "@prisma/client";
import type { PropType } from "vue";
import { read, utils, writeFile } from "xlsx";

const router = useRouter();

const storeUsers = useUsersStore();

const emit = defineEmits([
  "openModal",
  "deleteRow",
  "updateDeliveryRow",
  "deleteSelectedRows",
  "updateDeliveryRows",
  "createCopyRow",
]);

function updateDeliveryRow(row: IClientRansom, flag: string) {
  emit("updateDeliveryRow", { row: row, flag: flag });
}

function updateDeliveryRows(flag: string) {
  emit("updateDeliveryRows", { idArray: checkedRows.value, flag: flag });
}

function openModal(row: IClientRansom) {
  emit("openModal", row);
}

function deleteRow(id: number) {
  emit("deleteRow", id);
}

function deleteSelectedRows() {
  emit("deleteSelectedRows", checkedRows.value);
}

function createCopyRow() {
  emit("createCopyRow", checkedRows.value[0]);
}

const props = defineProps({
  user: { type: Object as PropType<User>, required: true },
  rows: { type: Array as PropType<IClientRansom[]> },
});

function exportToExcel() {
  let table = document.querySelector("#theTable");

  let wb = utils.table_to_book(table);

  writeFile(wb, "выкуп_клиента.xlsx");
}

const checkedRows = ref<number[]>([]);

const isChecked = (rowId: number): boolean => checkedRows.value.includes(rowId);

const handleCheckboxChange = (rowId: number): void => {
  if (isChecked(rowId)) {
    checkedRows.value = checkedRows.value.filter((id) => id !== rowId);
  } else {
    checkedRows.value.push(rowId);
  }
};

const showDeletedRows = ref(false);

const perPage = ref(20)
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil((props.rows?.length || 0) / perPage.value));
const totalRows = computed(() => Math.ceil(props.rows?.length || 0));
let returnRows = ref<Array<IClientRansom>>()

function updateCurrentPageData() {
  const startIndex = (currentPage.value - 1) * perPage.value
  const endIndex = startIndex + perPage.value

  if (showDeletedRows.value) {
    returnRows.value = props.rows?.slice(startIndex, endIndex);
  } else {
    returnRows.value = props.rows?.filter((row) => !row.deleted).slice(startIndex, endIndex);
  }
}

watch([currentPage, totalRows], updateCurrentPageData)

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const toggleShowDeletedRows = () => {
  showDeletedRows.value = !showDeletedRows.value;
  updateCurrentPageData();
  if (!isPrimaryView.value) {
    updateRowsByFromName();
  }
};

onMounted(() => {
  updateCurrentPageData()
})

let isPrimaryView = ref(true)
let searchQuery = ref('')

function toggleShowPrimaryView() {
  isPrimaryView.value = !isPrimaryView.value;
  updateCurrentPageData();
  if (!isPrimaryView.value) {
    updateRowsByFromName();
  }
}

function updateRowsByFromName() {
  updateCurrentPageData();
  returnRows.value = returnRows.value?.filter((element, index) => {
    return returnRows.value?.findIndex(i => i.cell === element.cell && i.fromName === element.fromName) === index;
  })
}

function getRowsByFromName(fromNameData: string) {
  isPrimaryView.value = true;
  returnRows.value = props.rows?.filter((row) => row.fromName === fromNameData);
}

</script>
<template>
  <div class="flex items-center justify-between max-lg:block mt-10">
    <div>
      <div class="flex items-center max-sm:flex-col max-sm:items-start gap-5 mb-5">
        <h1 class="text-2xl">Всего записей: <span class="text-secondary-color font-bold">{{ totalRows }}</span> </h1>
        <UIActionButton @click="toggleShowPrimaryView">
          {{ isPrimaryView ? 'Режим выдачи' : 'Режим заполнения' }}
        </UIActionButton>
      </div>
      <div class="mb-5 flex items-center max-sm:flex-col max-sm:items-start gap-5" v-if="isPrimaryView">
        <h1>Сколько записей отображается в таблице: </h1>
        <input
          class="max-w-[100px] bg-transparent border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 rounded-2xl focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
          min="1" :max="totalRows" type="number" v-model="perPage">
        <UIActionButton @click="updateCurrentPageData">Применить</UIActionButton>
      </div>
      <div class="flex items-center gap-5">
        <UIActionButton @click="toggleShowDeletedRows">
          {{ showDeletedRows ? 'Скрыть удаленное' : 'Показать удаленное' }}
        </UIActionButton>
        <div v-if="isPrimaryView">
          <a href="#up">
            <Icon name="material-symbols:arrow-circle-up-rounded"
              class="text-secondary-color hover:opacity-50 duration-200" size="40" />
          </a>
          <a href="#down">
            <Icon name="material-symbols:arrow-circle-down" class="text-secondary-color hover:opacity-50 duration-200"
              size="40" />
          </a>
          <a href="#left">
            <Icon name="material-symbols:arrow-circle-left-rounded"
              class="text-secondary-color hover:opacity-50 duration-200" size="40" />
          </a>
          <a href="#right">
            <Icon name="material-symbols:arrow-circle-right-rounded"
              class="text-secondary-color hover:opacity-50 duration-200" size="40" />
          </a>
        </div>
      </div>
    </div>
    <div class="flex items-end max-lg:mt-5 max-lg:justify-between gap-20">
      <div class="flex flex-col text-center" v-if="isPrimaryView">
        <h1 class="text-base">Страница:</h1>
        <h1 class="text-base mb-2"> {{ currentPage }} из {{ totalPages }} </h1>
        <div class="flex items-center justify-center gap-2">
          <button @click="prevPage(), updateCurrentPageData()" :disabled="currentPage === 1"
            class="disabled:opacity-40 disabled:cursor-not-allowed duration-150 bg-secondary-color flex items-center justify-center rounded-sm p-3">
            <Icon name="material-symbols:arrow-back-ios-new-rounded" class="text-white" />
          </button>
          <button @click="nextPage(), updateCurrentPageData()" :disabled="currentPage === totalPages"
            class="disabled:opacity-40 disabled:cursor-not-allowed duration-150 bg-secondary-color flex items-center justify-center rounded-sm p-3">
            <Icon name="material-symbols:arrow-forward-ios-rounded" class="text-white" />
          </button>
        </div>
      </div>
      <Icon v-if="user.role === 'ADMIN'" class="duration-200 hover:text-secondary-color cursor-pointer" size="40"
        name="material-symbols:sheets-add-on" @click="exportToExcel" />
    </div>
  </div>

  <div class="fixed z-40 flex flex-col gap-3 top-28 left-1/2 translate-x-[-50%] translate-y-[-50%]"
    v-if="user.dataClientRansom === 'WRITE' && checkedRows.length > 0">
    <UIActionButton v-if="user.dataClientRansom === 'WRITE' && checkedRows.length === 1" @click="createCopyRow">
      Скопировать запись</UIActionButton>
    <UIActionButton v-if="user.role === 'ADMIN' && user.dataClientRansom === 'WRITE'" @click="deleteSelectedRows">Удалить
      выделенные записи</UIActionButton>
    <UIActionButton v-if="user.deliveredSC1 === 'WRITE'" @click="updateDeliveryRows('SC')">Доставить на сц
    </UIActionButton>
    <UIActionButton v-if="user.deliveredPVZ1 === 'WRITE'" @click="updateDeliveryRows('PVZ')">Доставить на пвз
    </UIActionButton>
    <UIActionButton v-if="user.issued1 === 'WRITE'" @click="updateDeliveryRows('issued')">Выдать клиенту</UIActionButton>
  </div>

  <div class="relative max-h-[760px] overflow-x-auto mt-5 mb-10" v-if="isPrimaryView">
    <div id="up"></div>
    <table id="theTable" class="w-full border-x-2 border-gray-50 text-sm text-left rtl:text-right text-gray-500"
      v-if="totalRows > 0">
      <thead class="text-xs sticky top-0 z-30 text-gray-700 uppercase text-center bg-gray-50">
        <tr>
          <th scope="col" class="px-1 py-3" v-if="user.dataClientRansom === 'WRITE'">
            Выделение
          </th>
          <th scope="col" class="px-6 py-3">id</th>
          <th scope="col" class="px-6 py-3" v-if="user.clientLink1 === 'READ' || user.clientLink1 === 'WRITE'">
            ссылка для клиента
          </th>
          <th scope="col" class="px-6 py-3" v-if="user.cell1 === 'READ' || user.cell1 === 'WRITE'">
            ячейка
          </th>
          <th scope="col" class="px-6 py-3" v-if="user.name1 === 'READ' || user.name1 === 'WRITE'">
            имя
          </th>
          <th scope="col" class="px-6 py-3" v-if="user.fromName1 === 'READ' || user.fromName1 === 'WRITE'">
            телефон
          </th>
          <th scope="col" class="px-6 py-3" v-if="user.productLink1 === 'READ' || user.productLink1 === 'WRITE'">
            товар (ссылка)
          </th>
          <th scope="col" class="px-6 py-3" v-if="user.productName1 === 'READ' || user.productName1 === 'WRITE'">
            название товара
          </th>
          <th scope="col" class="px-6 py-3" v-if="user.priceProgram === 'READ' || user.priceProgram === 'WRITE'">
            стоимость выкупа товара
          </th>
          <th scope="col" class="px-6 py-3" v-if="user.prepayment1 === 'READ' || user.prepayment1 === 'WRITE'">
            предоплата
          </th>
          <th scope="col" class="px-6 py-3" v-if="user.percentClient1 === 'READ' || user.percentClient1 === 'WRITE'">
            процент с клиента (%)
          </th>
          <th scope="col" class="px-6 py-3" v-if="user.deliveredKGT1 === 'READ' || user.deliveredKGT1 === 'WRITE'">
            доставка кгт
          </th>
          <th scope="col" class="px-6 py-3"
            v-if="user.amountFromClient1 === 'READ' || user.amountFromClient1 === 'WRITE'">
            сумма с клиента
          </th>
          <th scope="col" class="px-6 py-3" v-if="user.dispatchPVZ1 === 'READ' || user.dispatchPVZ1 === 'WRITE'">
            отправка в пвз
          </th>
          <th scope="col" class="px-6 py-3" v-if="user.orderPVZ1 === 'READ' || user.orderPVZ1 === 'WRITE'">
            заказано на сц
          </th>
          <th scope="col" class="px-6 py-3" v-if="user.deliveredSC1 === 'READ' || user.deliveredSC1 === 'WRITE'">
            доставлено на сц
          </th>
          <th scope="col" class="px-6 py-3" v-if="user.deliveredPVZ1 === 'READ' || user.deliveredPVZ1 === 'WRITE'">
            доставлено на пвз
          </th>
          <th scope="col" class="px-6 py-3" v-if="user.issued1 === 'READ' || user.issued1 === 'WRITE'">
            выдан клиенту
          </th>
          <th scope="col" class="px-6 py-3" v-if="user.additionally1 === 'READ' || user.additionally1 === 'WRITE'">
            дополнительно
          </th>
          <th scope="col" class="px-6 py-3" v-if="user.profit1 === 'READ' || user.profit1 === 'WRITE'">
            прибыль (доход)
          </th>
          <th scope="col" class="px-6 py-3">создан (время)</th>
          <th scope="col" class="px-6 py-3">изменен (время)</th>
          <th scope="col" class="px-6 py-3">удален (время)</th>
          <th scope="col" class="px-6 py-3">создан</th>
          <th scope="col" class="px-6 py-3">изменен</th>
          <th scope="col" class="exclude-row px-6 py-3" v-if="user.dataClientRansom === 'WRITE' && user.role === 'ADMIN'">
            изменение
          </th>
          <th scope="col" class="exclude-row px-6 py-3" v-if="user.dataClientRansom === 'WRITE' && user.role === 'ADMIN'">
            удаление
          </th>
        </tr>
      </thead>
      <tbody>
        <div id="left"></div>
        <tr :class="{ 'bg-orange-100': isChecked(row.id) }" class="border-b text-center text-sm"
          v-for="row in returnRows">
          <td v-if="user.dataClientRansom === 'WRITE'"
            class="px-6 py-4 underline border-2 text-secondary-color whitespace-nowrap uppercase overflow-hidden max-w-[200px]">
            <input type="checkbox" :value="row.id" :checked="isChecked(row.id)" @change="handleCheckboxChange(row.id)" />
          </td>

          <th scope="row" class="px-6 py-4 font-medium border-2 underline text-secondary-color whitespace-nowrap">
            <NuxtLink target="_blank" class="cursor-pointer hover:text-orange-200 duration-200"
              :to="`/spreadsheets/record/2/${row.id}`">
              {{ row.id }}
            </NuxtLink>
          </th>
          <td
            class="px-3 py-4 underline border-2 text-secondary-color whitespace-nowrap uppercase overflow-hidden max-w-[100px]"
            v-if="user.clientLink2 === 'READ' || user.clientLink2 === 'WRITE'">
            <NuxtLink target="_blank" class="cursor-pointer hover:text-orange-200 duration-200"
              :to="`/spreadsheets/order/${row.clientLink2}`">
              {{ row.clientLink2 }}
            </NuxtLink>
          </td>
          <td v-if="user.cell1 === 'READ' || user.cell1 === 'WRITE'" class="px-6 py-4 border-2">
            {{ row.cell }}
          </td>
          <td v-if="user.name1 === 'READ' || user.name1 === 'WRITE'" class="px-6 py-4 border-2 whitespace-nowrap">
            {{ row.name }}
          </td>
          <td v-if="user.fromName1 === 'READ' || user.fromName1 === 'WRITE'" class="px-6 py-4 border-2">
            {{ row.fromName }}
          </td>
          <td class="underline border-2 text-secondary-color whitespace-nowrap overflow-hidden max-w-[100px]"
            v-if="user.productLink1 === 'READ' || user.productLink1 === 'WRITE'">
            <a :href="row.productLink" target="_blank" class="hover:text-orange-200 duration-200">{{ row.productLink
            }}</a>
          </td>
          <td class="py-4 px-6 border-2"
            v-if="user.productName1 === 'READ' || user.productName1 === 'WRITE'">
            {{ row.productName }}
          </td>
          <td class="px-6 py-4 border-2" v-if="user.priceProgram === 'READ' || user.priceProgram === 'WRITE'">
            {{ row.priceProgram }}
          </td>
          <td class="px-6 py-4 border-2" v-if="user.prepayment1 === 'READ' || user.prepayment1 === 'WRITE'">
            {{ row.prepayment }}
          </td>
          <td class="px-6 py-4 border-2" v-if="user.percentClient1 === 'READ' || user.percentClient1 === 'WRITE'">
            {{ row.percentClient }}
          </td>
          <td class="px-6 py-4 border-2" v-if="user.deliveredKGT1 === 'READ' || user.deliveredKGT1 === 'WRITE'">
            {{ row.deliveredKGT }}
          </td>
          <td class="px-6 py-4 border-2" v-if="user.amountFromClient2 === 'READ' || user.amountFromClient2 === 'WRITE'">
            {{ Math.round(row.amountFromClient2 / 10) * 10 }}
          </td>
          <td class="px-6 py-4 border-2" v-if="user.dispatchPVZ1 === 'READ' || user.dispatchPVZ1 === 'WRITE'">
            {{ row.dispatchPVZ }}
          </td>
          <td class="px-6 py-4 border-2" v-if="user.orderPVZ1 === 'READ' || user.orderPVZ1 === 'WRITE'">
            {{ row.orderPVZ }}
          </td>
          <td class="px-3 py-4 border-2" v-if="user.deliveredSC1 === 'READ' || user.deliveredSC1 === 'WRITE'">
            <Icon @click="updateDeliveryRow(row, 'SC')" v-if="!row.deliveredSC && user.deliveredSC1 === 'WRITE'"
              class="text-green-500 cursor-pointer hover:text-green-300 duration-200"
              name="mdi:checkbox-multiple-marked-circle" size="32" />
            <h1 class="font-bold text-green-500">
              {{ row.deliveredSC ? storeUsers.getNormalizedDate(row.deliveredSC) : "" }}
            </h1>
          </td>
          <td class="px-3 py-4 border-2" v-if="user.deliveredPVZ1 === 'READ' || user.deliveredPVZ1 === 'WRITE'">
            <Icon @click="updateDeliveryRow(row, 'PVZ')" v-if="!row.deliveredPVZ && user.deliveredPVZ1 === 'WRITE'"
              class="text-green-500 cursor-pointer hover:text-green-300 duration-200"
              name="mdi:checkbox-multiple-marked-circle" size="32" />
            <h1 class="font-bold text-green-500">
              {{ row.deliveredPVZ ? storeUsers.getNormalizedDate(row.deliveredPVZ) : "" }}
            </h1>
          </td>
          <td class="px-3 py-4 border-2" v-if="user.issued1 === 'READ' || user.issued1 === 'WRITE'">
            <Icon @click="updateDeliveryRow(row, 'issued')" v-if="!row.issued && user.issued1 === 'WRITE'"
              class="text-green-500 cursor-pointer hover:text-green-300 duration-200"
              name="mdi:checkbox-multiple-marked-circle" size="32" />
            <h1 class="font-bold text-green-500">
              {{ row.issued ? storeUsers.getNormalizedDate(row.issued) : "" }}
            </h1>
          </td>
          <td class="px-6 py-4 border-2" v-if="user.additionally1 === 'READ' || user.additionally1 === 'WRITE'">
            {{ row.additionally ? row.additionally : "Пусто" }}
          </td>
          <td class="px-6 py-4 border-2" v-if="user.profit2 === 'READ' || user.profit2 === 'WRITE'">
            {{ row.profit2 }}
          </td>
          <td class="px-6 py-4 border-2">
            {{ storeUsers.getNormalizedDate(row.created_at) }}
          </td>
          <td class="px-6 py-4 border-2">
            {{ storeUsers.getNormalizedDate(row.updated_at) }}
          </td>
          <td class="px-6 py-4 border-2">
            {{ storeUsers.getNormalizedDate(row.deleted) }}
          </td>
          <td class="px-6 py-4 border-2">
            {{ row.createdUser }}
          </td>
          <td class="px-6 py-4 border-2">
            {{ row.updatedUser }}
          </td>
          <td class="px-6 py-4 border-2" v-if="user.dataClientRansom === 'WRITE' && user.role === 'ADMIN'">
            <Icon @click="openModal(row)" class="text-green-600 cursor-pointer hover:text-green-300 duration-200"
              name="material-symbols:edit" size="32" />
          </td>
          <td class="px-6 py-4 border-2" v-if="user.dataClientRansom === 'WRITE' && user.role === 'ADMIN'">
            <Icon @click="deleteRow(row.id)" class="text-red-600 cursor-pointer hover:text-red-300 duration-200"
              name="material-symbols:playlist-remove-rounded" size="32" />
          </td>
          <div id="right"></div>
        </tr>
      </tbody>
    </table>
    <div v-else class="flex items-center flex-col justify-center mt-10 text-2xl">
      <Icon name="ion:ios-close-empty" size="100" class="text-red-500" />
      <h1>Извините, записи по данным фильтрам не были найдены!</h1>
      <h1>Попробуйте поставить другие фильтры или очистить их</h1>
    </div>
    <div id="down"></div>
  </div>

  <div v-else class="mt-10">
    <h1 class="text-2xl mb-5">Режим выдачи товаров</h1>
    <input @input="updateRowsByFromName" type="text" v-model="searchQuery"
      class="block w-full bg-transparent mb-5 border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 rounded-2xl focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
      placeholder="Введите телефон..." />
    <div v-for="row in returnRows" v-if="returnRows.length > 0">
      <div @click="getRowsByFromName(row.fromName)"
        class="cursor-pointer hover:bg-hover-color duration-300 flex items-center  justify-between p-10 mb-3 border-2">
        <div class="rounded-full border-2 p-3 min-w-[50px] text-center border-secondary-color">
          <h1>{{ row.cell }}</h1>
        </div>
        <div>
          <h1>Телефон: {{ row.fromName }}</h1>
        </div>
      </div>
    </div>
    <div v-else class="flex items-center flex-col justify-center mt-10 text-2xl">
      <Icon name="ion:ios-close-empty" size="100" class="text-red-500" />
      <h1>Извините, записи не были найдены!</h1>
    </div>
  </div>
</template>

<style scoped>
.hidden-row {
  display: none !important;
}
</style>
