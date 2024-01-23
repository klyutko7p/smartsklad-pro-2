<script setup lang="ts">
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

function updateDeliveryRow(row: IOurRansom, flag: string) {
  emit("updateDeliveryRow", { row: row, flag: flag });
}

function updateDeliveryRows(flag: string) {
  emit("updateDeliveryRows", { idArray: checkedRows.value, flag: flag });
}

function openModal(row: IOurRansom) {
  emit("openModal", row);
}

function createCopyRow() {
  emit("createCopyRow", checkedRows.value[0]);
}

function deleteRow(id: number) {
  emit("deleteRow", id);
}

function deleteSelectedRows() {
  emit("deleteSelectedRows", checkedRows.value);
}

const props = defineProps({
  user: { type: Object as PropType<User>, required: true },
  rows: { type: Array as PropType<IOurRansom[]> },
});

function exportToExcel() {
  let table = document.querySelector("#theTable");

  let wb = utils.table_to_book(table);

  writeFile(wb, "наш_выкуп.xlsx");
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

const filteredRows = computed(() => {
  if (showDeletedRows.value) {
    return props.rows;
  } else {
    return props.rows?.filter((row) => !row.deleted);
  }
});

const toggleShowDeletedRows = () => {
  showDeletedRows.value = !showDeletedRows.value;
};
</script>
<template>
  <div class="flex items-center justify-between mt-10">
    <div>
      <div class="flex items-center gap-5">
        <UIMainButton @click="toggleShowDeletedRows">Показать удаленное</UIMainButton>
        <div>
          <a href="#up">
            <Icon
              name="material-symbols:arrow-circle-up-rounded"
              class="text-secondary-color hover:opacity-50 duration-200"
              size="40"
            />
          </a>
          <a href="#down">
            <Icon
              name="material-symbols:arrow-circle-down"
              class="text-secondary-color hover:opacity-50 duration-200"
              size="40"
            />
          </a>
          <a href="#left">
            <Icon
              name="material-symbols:arrow-circle-left-rounded"
              class="text-secondary-color hover:opacity-50 duration-200"
              size="40"
            />
          </a>
          <a href="#right">
            <Icon
              name="material-symbols:arrow-circle-right-rounded"
              class="text-secondary-color hover:opacity-50 duration-200"
              size="40"
            />
          </a>
        </div>
      </div>
    </div>
    <Icon
      v-if="user.role === 'ADMIN'"
      class="duration-200 hover:text-secondary-color cursor-pointer"
      size="40"
      name="material-symbols:sheets-add-on"
      @click="exportToExcel"
    />
  </div>
  <div
    class="fixed z-40 flex flex-col gap-3 top-28 left-1/2 translate-x-[-50%] translate-y-[-50%]"
    v-if="user.dataOurRansom === 'WRITE' && checkedRows.length > 0"
  >
    <UIActionButton
      v-if="user.dataOurRansom === 'WRITE' && checkedRows.length === 1"
      @click="createCopyRow"
      >Скопировать запись</UIActionButton
    >
    <UIActionButton
      v-if="user.role === 'ADMIN' && user.dataOurRansom === 'WRITE'"
      @click="deleteSelectedRows"
      >Удалить выделенные записи</UIActionButton
    >
    <UIActionButton v-if="user.deliveredSC1 === 'WRITE'" @click="updateDeliveryRows('SC')"
      >Доставить на сц</UIActionButton
    >
    <UIActionButton
      v-if="user.deliveredPVZ1 === 'WRITE'"
      @click="updateDeliveryRows('PVZ')"
      >Доставить на пвз</UIActionButton
    >
    <UIActionButton v-if="user.issued1 === 'WRITE'" @click="updateDeliveryRows('issued')"
      >Выдать клиенту</UIActionButton
    >
  </div>
  <div class="relative max-h-[760px] overflow-x-auto mt-5 mb-10">
    <div id="up"></div>
    <table
      id="theTable"
      class="w-full border-x-2 border-gray-50 text-sm text-left rtl:text-right text-gray-500"
    >
      <thead
        class="text-xs sticky top-0 z-30 text-gray-700 uppercase text-center bg-gray-50"
      >
        <tr>
          <th scope="col" class="px-6 py-3" v-if="user.dataOurRansom === 'WRITE'">
            Выделение
          </th>
          <th scope="col" class="px-6 py-3">id</th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.clientLink1 === 'READ' || user.clientLink1 === 'WRITE'"
          >
            ссылка для клиента
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.cell1 === 'READ' || user.cell1 === 'WRITE'"
          >
            ячейка
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.name1 === 'READ' || user.name1 === 'WRITE'"
          >
            имя
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.fromName1 === 'READ' || user.fromName1 === 'WRITE'"
          >
            телефон
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.productLink1 === 'READ' || user.productLink1 === 'WRITE'"
          >
            товар (ссылка)
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.productName1 === 'READ' || user.productName1 === 'WRITE'"
          >
            название товара
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.notation1 === 'READ' || user.notation1 === 'WRITE'"
          >
            примечание
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.priceSite === 'READ' || user.priceSite === 'WRITE'"
          >
            стоимость сайт
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.prepayment1 === 'READ' || user.prepayment1 === 'WRITE'"
          >
            предоплата
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.percentClient1 === 'READ' || user.percentClient1 === 'WRITE'"
          >
            процент с клиента (%)
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.deliveredKGT1 === 'READ' || user.deliveredKGT1 === 'WRITE'"
          >
            доставка кгт
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.amountFromClient1 === 'READ' || user.amountFromClient1 === 'WRITE'"
          >
            сумма с клиента
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.dispatchPVZ1 === 'READ' || user.dispatchPVZ1 === 'WRITE'"
          >
            отправка в пвз
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.orderPVZ1 === 'READ' || user.orderPVZ1 === 'WRITE'"
          >
            заказано на сц
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.orderAccount === 'READ' || user.orderAccount === 'WRITE'"
          >
            аккаунт заказа
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.deliveredSC1 === 'READ' || user.deliveredSC1 === 'WRITE'"
          >
            доставлено на сц
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.deliveredPVZ1 === 'READ' || user.deliveredPVZ1 === 'WRITE'"
          >
            доставлено на пвз
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.issued1 === 'READ' || user.issued1 === 'WRITE'"
          >
            выдан клиенту
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.additionally1 === 'READ' || user.additionally1 === 'WRITE'"
          >
            дополнительно
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.profit1 === 'READ' || user.profit1 === 'WRITE'"
          >
            прибыль (доход)
          </th>
          <th scope="col" class="px-6 py-3">создан (время)</th>
          <th scope="col" class="px-6 py-3">изменен (время)</th>
          <th scope="col" class="px-6 py-3">удален (время)</th>
          <th scope="col" class="px-6 py-3">создан</th>
          <th scope="col" class="px-6 py-3">изменен</th>
          <th
            scope="col"
            class="exclude-row px-6 py-3"
            v-if="user.dataOurRansom === 'WRITE'"
          >
            изменение
          </th>
          <th
            scope="col"
            class="exclude-row px-6 py-3"
            v-if="user.dataOurRansom === 'WRITE' && user.role === 'ADMIN'"
          >
            удаление
          </th>
        </tr>
      </thead>
      <tbody>
        <div id="left"></div>
        <tr
          :class="{ 'bg-orange-100': isChecked(row.id) }"
          class="border-b text-center text-sm"
          v-for="row in filteredRows"
        >
          <td
            v-if="user.dataOurRansom === 'WRITE'"
            class="px-6 py-4 border-2 underline text-secondary-color whitespace-nowrap uppercase overflow-hidden max-w-[200px]"
          >
            <input
              type="checkbox"
              :value="row.id"
              :checked="isChecked(row.id)"
              @change="handleCheckboxChange(row.id)"
            />
          </td>

          <th
            scope="row"
            class="px-6 py-4 border-2 font-medium underline text-secondary-color whitespace-nowrap"
          >
            <NuxtLink
              target="_blank"
              class="cursor-pointer hover:text-orange-200 duration-200"
              :to="`/spreadsheets/record/1/${row.id}`"
            >
              {{ row.id }}
            </NuxtLink>
          </th>
          <td
            class="px-3 py-4 border-2 underline text-secondary-color whitespace-nowrap uppercase overflow-hidden max-w-[200px]"
            v-if="user.clientLink1 === 'READ' || user.clientLink1 === 'WRITE'"
          >
            <NuxtLink
              target="_blank"
              class="cursor-pointer hover:text-orange-200 duration-200"
              :to="`/spreadsheets/order/${row.clientLink1}`"
            >
              {{ row.clientLink1 }}
            </NuxtLink>
          </td>
          <td
            v-if="user.cell1 === 'READ' || user.cell1 === 'WRITE'"
            class="px-6 py-4 border-2"
          >
            {{ row.cell }}
          </td>
          <td
            v-if="user.name1 === 'READ' || user.name1 === 'WRITE'"
            class="px-6 py-4 border-2 whitespace-nowrap"
          >
            {{ row.name }}
          </td>
          <td
            v-if="user.fromName1 === 'READ' || user.fromName1 === 'WRITE'"
            class="px-6 py-4 border-2"
          >
            {{ row.fromName }}
          </td>
          <td
            class="underline border-2 text-secondary-color whitespace-nowrap overflow-hidden max-w-[200px]"
            v-if="user.productLink1 === 'READ' || user.productLink1 === 'WRITE'"
          >
            <a
              :href="row.productLink"
              target="_blank"
              class="hover:text-orange-200 duration-200"
              >{{ row.productLink }}</a
            >
          </td>
          <td
            class="py-4 px-6 border-2 whitespace-nowrap"
            v-if="user.productName1 === 'READ' || user.productName1 === 'WRITE'"
          >
            {{ row.productName }}
          </td>
          <td
            class="px-6 py-4 border-2"
            v-if="user.notation1 === 'READ' || user.notation1 === 'WRITE'"
          >
            {{ row.notation ? row.notation : "Пусто" }}
          </td>
          <td
            class="px-6 py-4 border-2"
            v-if="user.priceSite === 'READ' || user.priceSite === 'WRITE'"
          >
            {{ row.priceSite }}
          </td>
          <td
            class="px-6 py-4 border-2"
            v-if="user.prepayment1 === 'READ' || user.prepayment1 === 'WRITE'"
          >
            {{ row.prepayment }}
          </td>
          <td
            class="px-6 py-4 border-2"
            v-if="user.percentClient1 === 'READ' || user.percentClient1 === 'WRITE'"
          >
            {{ row.percentClient }}
          </td>
          <td
            class="px-6 py-4 border-2"
            v-if="user.deliveredKGT1 === 'READ' || user.deliveredKGT1 === 'WRITE'"
          >
            {{ row.deliveredKGT }}
          </td>
          <td
            class="px-6 py-4 border-2"
            v-if="user.amountFromClient1 === 'READ' || user.amountFromClient1 === 'WRITE'"
          >
            {{ Math.round(row.amountFromClient1 / 10) * 10 }}
          </td>
          <td
            class="px-6 py-4 border-2"
            v-if="user.dispatchPVZ1 === 'READ' || user.dispatchPVZ1 === 'WRITE'"
          >
            {{ row.dispatchPVZ }}
          </td>
          <td
            class="px-6 py-4 border-2"
            v-if="user.orderPVZ1 === 'READ' || user.orderPVZ1 === 'WRITE'"
          >
            {{ row.orderPVZ }}
          </td>
          <td
            class="px-6 py-4 border-2"
            v-if="user.orderAccount === 'READ' || user.orderAccount === 'WRITE'"
          >
            {{ row.orderAccount }}
          </td>
          <td
            class="px-3 py-4 border-2"
            v-if="user.deliveredSC1 === 'READ' || user.deliveredSC1 === 'WRITE'"
          >
            <Icon
              @click="updateDeliveryRow(row, 'SC')"
              v-if="!row.deliveredSC && user.deliveredSC1 === 'WRITE'"
              class="text-green-500 cursor-pointer hover:text-green-300 duration-200"
              name="mdi:checkbox-multiple-marked-circle"
              size="32"
            />
            <h1 class="font-bold text-green-500">
              {{ row.deliveredSC ? storeUsers.getNormalizedDate(row.deliveredSC) : "" }}
            </h1>
          </td>
          <td
            class="px-3 py-4 border-2"
            v-if="user.deliveredPVZ1 === 'READ' || user.deliveredPVZ1 === 'WRITE'"
          >
            <Icon
              @click="updateDeliveryRow(row, 'PVZ')"
              v-if="!row.deliveredPVZ && user.deliveredPVZ1 === 'WRITE'"
              class="text-green-500 cursor-pointer hover:text-green-300 duration-200"
              name="mdi:checkbox-multiple-marked-circle"
              size="32"
            />
            <h1 class="font-bold text-green-500">
              {{ row.deliveredPVZ ? storeUsers.getNormalizedDate(row.deliveredPVZ) : "" }}
            </h1>
          </td>
          <td
            class="px-3 py-4 border-2"
            v-if="user.issued1 === 'READ' || user.issued1 === 'WRITE'"
          >
            <Icon
              @click="updateDeliveryRow(row, 'issued')"
              v-if="!row.issued && user.issued1 === 'WRITE'"
              class="text-green-500 cursor-pointer hover:text-green-300 duration-200"
              name="mdi:checkbox-multiple-marked-circle"
              size="32"
            />
            <h1 class="font-bold text-green-500">
              {{ row.issued ? storeUsers.getNormalizedDate(row.issued) : "" }}
            </h1>
          </td>
          <td
            class="px-6 py-4 border-2"
            v-if="user.additionally1 === 'READ' || user.additionally1 === 'WRITE'"
          >
            {{ row.additionally ? row.additionally : "Пусто" }}
          </td>
          <td
            class="px-6 py-4 border-2"
            v-if="user.profit1 === 'READ' || user.profit1 === 'WRITE'"
          >
            {{ row.profit1 }}
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
          <td class="px-6 py-4 border-2" v-if="user.dataOurRansom === 'WRITE'">
            <Icon
              @click="openModal(row)"
              class="text-green-600 cursor-pointer hover:text-green-300 duration-200"
              name="material-symbols:edit"
              size="32"
            />
          </td>
          <td
            class="px-6 py-4 border-2"
            v-if="user.dataOurRansom === 'WRITE' && user.role === 'ADMIN'"
          >
            <Icon
              @click="deleteRow(row.id)"
              class="text-red-600 cursor-pointer hover:text-red-300 duration-200"
              name="material-symbols:playlist-remove-rounded"
              size="32"
            />
          </td>
          <div id="right"></div>
        </tr>
      </tbody>
    </table>
    <div id="down"></div>
  </div>
</template>

<style scoped>
.hidden-row {
  display: none !important;
}
</style>
