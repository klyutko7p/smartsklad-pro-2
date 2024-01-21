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

function deleteRow(id: number) {
  emit("deleteRow", id);
}

function deleteSelectedRows() {
  emit("deleteSelectedRows", checkedRows.value);
}

defineProps({
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
</script>
<template>
  <div class="flex justify-end">
    <Icon
      v-if="user.role === 'ADMIN'"
      class="duration-200 hover:text-secondary-color cursor-pointer"
      size="40"
      name="material-symbols:sheets-add-on"
      @click="exportToExcel"
    />
  </div>
  <div
    class="fixed z-40 flex flex-col gap-3 top-24 left-1/2 translate-x-[-50%] translate-y-[-50%]"
    v-if="user.dataOurRansom === 'WRITE' && checkedRows.length > 0"
  >
    <UIActionButton v-if="user.role === 'ADMIN'" @click="deleteSelectedRows"
      >Удалить выделенные записи</UIActionButton
    >
    <UIActionButton v-if="user.deliveredSC === 'WRITE'" @click="updateDeliveryRows('SC')"
      >Доставить на сц</UIActionButton
    >
    <UIActionButton
      v-if="user.deliveredPVZ === 'WRITE'"
      @click="updateDeliveryRows('PVZ')"
      >Доставить на пвз</UIActionButton
    >
    <UIActionButton v-if="user.issued === 'WRITE'" @click="updateDeliveryRows('issued')"
      >Выдать клиенту</UIActionButton
    >
  </div>
  <div class="relative max-h-[760px] overflow-x-auto mt-5 mb-10">
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
            v-if="user.cell === 'READ' || user.cell === 'WRITE'"
          >
            ячейка
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.name === 'READ' || user.name === 'WRITE'"
          >
            имя
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.fromName === 'READ' || user.fromName === 'WRITE'"
          >
            телефон
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.productLink === 'READ' || user.productLink === 'WRITE'"
          >
            товар (ссылка)
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.productName === 'READ' || user.productName === 'WRITE'"
          >
            название товара
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.notation === 'READ' || user.notation === 'WRITE'"
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
            v-if="user.percentClient === 'READ' || user.percentClient === 'WRITE'"
          >
            процент с клиента
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.deliveredKGT === 'READ' || user.deliveredKGT === 'WRITE'"
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
            v-if="user.dispatchPVZ === 'READ' || user.dispatchPVZ === 'WRITE'"
          >
            отправка в пвз
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.orderPVZ === 'READ' || user.orderPVZ === 'WRITE'"
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
            v-if="user.deliveredSC === 'READ' || user.deliveredSC === 'WRITE'"
          >
            доставлено на сц
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.deliveredPVZ === 'READ' || user.deliveredPVZ === 'WRITE'"
          >
            доставлено на пвз
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.issued === 'READ' || user.issued === 'WRITE'"
          >
            выдан клиенту
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.additionally === 'READ' || user.additionally === 'WRITE'"
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
            v-if="user.dataOurRansom === 'WRITE'"
          >
            удаление
          </th>
        </tr>
      </thead>
      <tbody>
        <tr :class="{'bg-orange-100': isChecked(row.id)}" class="bg-white border-b text-center text-sm" v-for="row in rows">
          <td
            v-if="user.dataOurRansom === 'WRITE'"
            class="px-6 py-4 underline text-secondary-color whitespace-nowrap uppercase overflow-hidden max-w-[200px]"
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
            class="px-6 py-4 font-medium underline text-secondary-color whitespace-nowrap"
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
            class="px-6 py-4 underline text-secondary-color whitespace-nowrap uppercase overflow-hidden max-w-[200px]"
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
          <td v-if="user.cell === 'READ' || user.cell === 'WRITE'" class="px-6 py-4">
            {{ row.cell }}
          </td>
          <td
            v-if="user.name === 'READ' || user.name === 'WRITE'"
            class="px-6 py-4 whitespace-nowrap"
          >
            {{ row.name }}
          </td>
          <td
            v-if="user.fromName === 'READ' || user.fromName === 'WRITE'"
            class="px-6 py-4"
          >
            {{ row.fromName }}
          </td>
          <td
            class="underline text-secondary-color whitespace-nowrap overflow-hidden max-w-[200px]"
            v-if="user.productLink === 'READ' || user.productLink === 'WRITE'"
          >
            <a
              :href="row.productLink"
              target="_blank"
              class="hover:text-orange-200 duration-200"
              >{{ row.productLink }}</a
            >
          </td>
          <td
            class="py-4 px-6 whitespace-nowrap"
            v-if="user.productName === 'READ' || user.productName === 'WRITE'"
          >
            {{ row.productName }}
          </td>
          <td
            class="px-6 py-4"
            v-if="user.notation === 'READ' || user.notation === 'WRITE'"
          >
            {{ row.notation ? row.notation : "Пусто" }}
          </td>
          <td
            class="px-6 py-4"
            v-if="user.priceSite === 'READ' || user.priceSite === 'WRITE'"
          >
            {{ row.priceSite }}
          </td>
          <td
            class="px-6 py-4"
            v-if="user.percentClient === 'READ' || user.percentClient === 'WRITE'"
          >
            {{ row.percentClient }}
          </td>
          <td
            class="px-6 py-4"
            v-if="user.deliveredKGT === 'READ' || user.deliveredKGT === 'WRITE'"
          >
            {{ row.deliveredKGT }}
          </td>
          <td
            class="px-6 py-4"
            v-if="user.amountFromClient1 === 'READ' || user.amountFromClient1 === 'WRITE'"
          >
            {{ row.amountFromClient1 }}
          </td>
          <td
            class="px-6 py-4"
            v-if="user.dispatchPVZ === 'READ' || user.dispatchPVZ === 'WRITE'"
          >
            {{ row.dispatchPVZ }}
          </td>
          <td
            class="px-6 py-4"
            v-if="user.orderPVZ === 'READ' || user.orderPVZ === 'WRITE'"
          >
            {{ row.orderPVZ }}
          </td>
          <td
            class="px-6 py-4"
            v-if="user.orderAccount === 'READ' || user.orderAccount === 'WRITE'"
          >
            {{ row.orderAccount }}
          </td>
          <td
            class="px-3 py-4"
            v-if="user.deliveredSC === 'READ' || user.deliveredSC === 'WRITE'"
          >
            <Icon
              @click="updateDeliveryRow(row, 'SC')"
              v-if="!row.deliveredSC && user.deliveredSC === 'WRITE'"
              class="text-green-500 cursor-pointer hover:text-green-300 duration-200"
              name="mdi:checkbox-multiple-marked-circle"
              size="32"
            />
            <h1 class="font-bold text-green-500">
              {{ row.deliveredSC ? storeUsers.getNormalizedDate(row.deliveredSC) : "" }}
            </h1>
          </td>
          <td
            class="px-3 py-4"
            v-if="user.deliveredPVZ === 'READ' || user.deliveredPVZ === 'WRITE'"
          >
            <Icon
              @click="updateDeliveryRow(row, 'PVZ')"
              v-if="!row.deliveredPVZ && user.deliveredPVZ === 'WRITE'"
              class="text-green-500 cursor-pointer hover:text-green-300 duration-200"
              name="mdi:checkbox-multiple-marked-circle"
              size="32"
            />
            <h1 class="font-bold text-green-500">
              {{ row.deliveredPVZ ? storeUsers.getNormalizedDate(row.deliveredPVZ) : "" }}
            </h1>
          </td>
          <td class="px-3 py-4" v-if="user.issued === 'READ' || user.issued === 'WRITE'">
            <Icon
              @click="updateDeliveryRow(row, 'issued')"
              v-if="!row.issued && user.issued === 'WRITE'"
              class="text-green-500 cursor-pointer hover:text-green-300 duration-200"
              name="mdi:checkbox-multiple-marked-circle"
              size="32"
            />
            <h1 class="font-bold text-green-500">
              {{ row.issued ? storeUsers.getNormalizedDate(row.issued) : "" }}
            </h1>
          </td>
          <td
            class="px-6 py-4"
            v-if="user.additionally === 'READ' || user.additionally === 'WRITE'"
          >
            {{ row.additionally ? row.additionally : "Пусто" }}
          </td>
          <td
            class="px-6 py-4"
            v-if="user.profit1 === 'READ' || user.profit1 === 'WRITE'"
          >
            {{ row.profit1 }}
          </td>
          <td class="px-6 py-4">
            {{ storeUsers.getNormalizedDate(row.created_at) }}
          </td>
          <td class="px-6 py-4">
            {{ storeUsers.getNormalizedDate(row.updated_at) }}
          </td>
          <td class="px-6 py-4">
            {{ row.createdUser }}
          </td>
          <td class="px-6 py-4">
            {{ row.updatedUser }}
          </td>
          <td class="px-6 py-4" v-if="user.dataOurRansom === 'WRITE'">
            <Icon
              @click="openModal(row)"
              class="text-green-600 cursor-pointer hover:text-green-300 duration-200"
              name="material-symbols:edit"
              size="32"
            />
          </td>
          <td
            class="px-6 py-4"
            v-if="user.dataOurRansom === 'WRITE' && user.role === 'ADMIN'"
          >
            <Icon
              @click="deleteRow(row.id)"
              class="text-red-600 cursor-pointer hover:text-red-300 duration-200"
              name="material-symbols:playlist-remove-rounded"
              size="32"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.hidden-row {
  display: none !important;
}
</style>
