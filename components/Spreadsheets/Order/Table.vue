import type updateDelivery from "~/server/api/ransom/update-delivery"; import type {
userInfo } from "os";
<script setup lang="ts">
import type { PropType } from "vue";
import { read, utils, writeFile } from "xlsx";

const storeUsers = useUsersStore();

defineProps({
  rows: { type: Array as PropType<IOurRansom[] | IClientRansom[]> },
});

function exportToExcel() {
  let table = document.querySelector("#theTable");

  let wb = utils.table_to_book(table);

  writeFile(wb, "информация_о_заказе.xlsx");
}
</script>

<template>
  <div class="flex justify-end">
    <Icon
      class="duration-200 hover:text-secondary-color cursor-pointer"
      size="40"
      name="material-symbols:sheets-add-on"
      @click="exportToExcel"
    />
  </div>
  <div class="relative max-h-[760px] overflow-x-auto mt-5">
    <table
      id="theTable"
      class="w-full border-x-2 border-gray-50 text-sm text-left rtl:text-right text-gray-500"
    >
      <thead
        class="text-xs sticky top-0 z-30 text-gray-700 uppercase text-center bg-gray-50"
      >
        <tr>
          <th
            scope="col"
            class="px-6 py-3"
          >
            ячейка
          </th>
          <th
            scope="col"
            class="px-6 py-3"
          >
            телефон
          </th>
          <th
            scope="col"
            class="px-6 py-3"
          >
            товар (ссылка)
          </th>
          <th
            scope="col"
            class="px-6 py-3"
          >
            название товара
          </th>
          <th
            scope="col"
            class="px-6 py-3"
          >
            сумма с клиента
          </th>
          <th
          scope="col"
          class="px-6 py-3"
        >
          предоплата
        </th>
          <th
            scope="col"
            class="px-6 py-3"
          >
            доставлено на сц
          </th>
          <th
            scope="col"
            class="px-6 py-3"
          >
            доставлено на пвз
          </th>
          <th
            scope="col"
            class="px-6 py-3"
          >
            выдан клиенту
          </th>
          <th
            scope="col"
            class="px-6 py-3"
          >
            дополнительно
          </th>
          <th scope="col" class="px-6 py-3">создан (время)</th>
        </tr>
      </thead>
      <tbody>
        <tr class="bg-white border-b text-center text-sm" v-for="row in rows">
          <td class="px-6 py-4 border-2">
            {{ row.cell }}
          </td>
          <td
            class="px-6 py-4 border-2"
          >
            {{ row.fromName }}
          </td>
          <td
            class="underline border-2 text-secondary-color whitespace-nowrap overflow-hidden max-w-[200px]"
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
          >
            {{ row.productName }}
          </td>
          <td v-if="row.amountFromClient1"
            class="px-6 py-4 border-2"
          >
            {{ Math.round(row.amountFromClient1 / 10) * 10 }}
          </td>
          <td v-if="row.amountFromClient2"
            class="px-6 py-4 border-2"
          >
            {{ Math.round(row.amountFromClient2 / 10) * 10 }}
          </td>
          <td
            class="px-6 py-4 border-2"
          >
            {{ row.prepayment }}
          </td>
          <td
            class="px-3 py-4 border-2"
          >
            <h1 class="font-bold text-green-500">
              {{ row.deliveredSC ? storeUsers.getNormalizedDate(row.deliveredSC) : "" }}
            </h1>
          </td>
          <td
            class="px-3 py-4 border-2"
          >
            <h1 class="font-bold text-green-500">
              {{ row.deliveredPVZ ? storeUsers.getNormalizedDate(row.deliveredPVZ) : "" }}
            </h1>
          </td>
          <td class="px-3 py-4 border-2" >
            <h1 class="font-bold text-green-500">
              {{ row.issued ? storeUsers.getNormalizedDate(row.issued) : "" }}
            </h1>
          </td>
          <td
            class="px-6 py-4 border-2"
          >
            {{ row.additionally ? row.additionally : "Пусто" }}
          </td>
          <td class="px-6 py-4 border-2">
            {{ storeUsers.getNormalizedDate(row.created_at) }}
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
