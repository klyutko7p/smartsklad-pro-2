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

function updateDeliveryRow(row: IDelivery, flag: string) {
  emit("updateDeliveryRow", { row: row, flag: flag });
}

function updateDeliveryRows(flag: string) {
  emit("updateDeliveryRows", { idArray: checkedRows.value, flag: flag });
}

function openModal(row: IDelivery) {
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
  rows: { type: Array as PropType<IDelivery[]> },
});

function exportToExcel() {
  let table = document.querySelector("#theTable");

  let wb = utils.table_to_book(table);

  writeFile(wb, "доставка.xlsx");
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
    v-if="user.dataDelivery === 'WRITE' && checkedRows.length > 0"
  >
    <UIActionButton
      v-if="user.dataDelivery === 'WRITE' && checkedRows.length === 1"
      @click="createCopyRow"
      >Скопировать запись</UIActionButton
    >
    <UIActionButton
      v-if="user.role === 'ADMIN' && user.dataDelivery === 'WRITE'"
      @click="deleteSelectedRows"
      >Удалить выделенные записи</UIActionButton
    >
    <UIActionButton v-if="user.sorted === 'WRITE'" @click="updateDeliveryRows('sorted')"
      >Отсортировано</UIActionButton
    >
    <UIActionButton
      v-if="user.paid === 'WRITE'"
      @click="updateDeliveryRows('paid')"
      >Оплачено</UIActionButton
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
          <th scope="col" class="px-6 py-3" v-if="user.dataDelivery === 'WRITE'">
            Выделение
          </th>
          <th scope="col" class="px-6 py-3">id</th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.clientLink3 === 'READ' || user.clientLink3 === 'WRITE'"
          >
            ссылка для клиента
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.name3 === 'READ' || user.name3 === 'WRITE'"
          >
            имя
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.fromName3 === 'READ' || user.fromName3 === 'WRITE'"
          >
            телефон
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.nameOfAction === 'READ' || user.nameOfAction === 'WRITE'"
          >
            название
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.purchaseOfGoods === 'READ' || user.purchaseOfGoods === 'WRITE'"
          >
            стоимость выкупа товара
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.percentClient3 === 'READ' || user.percentClient3 === 'WRITE'"
          >
            процент с клиента (%)
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.amountFromClient3 === 'READ' || user.amountFromClient3 === 'WRITE'"
          >
            сумма с клиента
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.dispatchPVZ3 === 'READ' || user.dispatchPVZ3 === 'WRITE'"
          >
            отправка в пвз
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.orderPVZ3 === 'READ' || user.orderPVZ3 === 'WRITE'"
          >
            заказано на сц
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.sorted === 'READ' || user.sorted === 'WRITE'"
          >
            отсортировано
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.paid === 'READ' || user.paid === 'WRITE'"
          >
            оплачено
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.additionally3 === 'READ' || user.additionally3 === 'WRITE'"
          >
            дополнительно
          </th>
          <th
            scope="col"
            class="px-6 py-3"
            v-if="user.profit3 === 'READ' || user.profit3 === 'WRITE'"
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
            v-if="user.dataDelivery === 'WRITE'"
          >
            изменение
          </th>
          <th
            scope="col"
            class="exclude-row px-6 py-3"
            v-if="user.dataDelivery === 'WRITE' && user.role === 'ADMIN'"
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
            v-if="user.dataDelivery === 'WRITE'"
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
              :to="`/spreadsheets/record/3/${row.id}`"
            >
              {{ row.id }}
            </NuxtLink>
          </th>
          <td
            class="px-3 py-4 border-2 underline text-secondary-color whitespace-nowrap uppercase overflow-hidden max-w-[200px]"
            v-if="user.clientLink3 === 'READ' || user.clientLink3 === 'WRITE'"
          >
            <NuxtLink
              target="_blank"
              class="cursor-pointer hover:text-orange-200 duration-200"
              :to="`/spreadsheets/order/${row.clientLink3}`"
            >
              {{ row.clientLink3 }}
            </NuxtLink>
          </td>
          <td
            v-if="user.name3 === 'READ' || user.name3 === 'WRITE'"
            class="px-6 py-4 border-2 whitespace-nowrap"
          >
            {{ row.name }}
          </td>
          <td
            v-if="user.fromName3 === 'READ' || user.fromName3 === 'WRITE'"
            class="px-6 py-4 border-2"
          >
            {{ row.fromName }}
          </td>
          <td
            v-if="user.nameOfAction === 'READ' || user.nameOfAction === 'WRITE'"
            class="px-6 py-4 border-2"
          >
            {{ row.nameOfAction }}
          </td>
          <td
            class="px-6 py-4 border-2"
            v-if="user.purchaseOfGoods === 'READ' || user.purchaseOfGoods === 'WRITE'"
          >
            {{ row.purchaseOfGoods }}
          </td>
          <td
            class="px-6 py-4 border-2"
            v-if="user.percentClient3 === 'READ' || user.percentClient3 === 'WRITE'"
          >
            {{ row.percentClient }}
          </td>
          <td
            class="px-6 py-4 border-2"
            v-if="user.amountFromClient3 === 'READ' || user.amountFromClient3 === 'WRITE'"
          >
            {{ row.amountFromClient3 }}
          </td>
          <td
            class="px-6 py-4 border-2"
            v-if="user.dispatchPVZ3 === 'READ' || user.dispatchPVZ3 === 'WRITE'"
          >
            {{ row.dispatchPVZ }}
          </td>
          <td
            class="px-6 py-4 border-2"
            v-if="user.orderPVZ3 === 'READ' || user.orderPVZ3 === 'WRITE'"
          >
            {{ row.orderPVZ }}
          </td>
          <td
            class="px-3 py-4 border-2"
            v-if="user.sorted === 'READ' || user.sorted === 'WRITE'"
          >
            <Icon
              @click="updateDeliveryRow(row, 'sorted')"
              v-if="!row.sorted && user.sorted === 'WRITE'"
              class="text-green-500 cursor-pointer hover:text-green-300 duration-200"
              name="mdi:checkbox-multiple-marked-circle"
              size="32"
            />
            <h1 class="font-bold text-green-500">
              {{ row.sorted ? storeUsers.getNormalizedDate(row.sorted) : "" }}
            </h1>
          </td>
          <td
            class="px-3 py-4 border-2"
            v-if="user.paid === 'READ' || user.paid === 'WRITE'"
          >
            <Icon
              @click="updateDeliveryRow(row, 'paid')"
              v-if="!row.paid && user.paid === 'WRITE'"
              class="text-green-500 cursor-pointer hover:text-green-300 duration-200"
              name="mdi:checkbox-multiple-marked-circle"
              size="32"
            />
            <h1 class="font-bold text-green-500">
              {{ row.paid ? storeUsers.getNormalizedDate(row.paid) : "" }}
            </h1>
          </td>
          <td
            class="px-6 py-4 border-2"
            v-if="user.additionally3 === 'READ' || user.additionally3 === 'WRITE'"
          >
            {{ row.additionally ? row.additionally : "Пусто" }}
          </td>
          <td
            class="px-6 py-4 border-2"
            v-if="user.profit3 === 'READ' || user.profit3 === 'WRITE'"
          >
            {{ row.profit3 }}
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
          <td class="px-6 py-4 border-2" v-if="user.dataDelivery === 'WRITE'">
            <Icon
              @click="openModal(row)"
              class="text-green-600 cursor-pointer hover:text-green-300 duration-200"
              name="material-symbols:edit"
              size="32"
            />
          </td>
          <td
            class="px-6 py-4 border-2"
            v-if="user.dataDelivery === 'WRITE' && user.role === 'ADMIN'"
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
