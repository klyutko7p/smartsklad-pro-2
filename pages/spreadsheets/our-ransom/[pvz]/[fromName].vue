<script setup lang="ts">
import { useToast } from "vue-toastification";
import Cookies from "js-cookie";

let toast = useToast();

const route = useRoute();
let fromNameString = route.params.fromName;
let cellString = route.params.cell;
let pvzLink = route.params.pvz;

const storeUsers = useUsersStore();
const storeRansom = useRansomStore();
const storePVZ = usePVZStore();
const storeSortingCenters = useSortingCentersStore();
const storeOrderAccounts = useOrderAccountStore();

const router = useRouter();

let isLoading = ref(false);

let user = ref({} as User);

let rows = ref<Array<IOurRansom>>();
let pvz = ref<Array<PVZ>>();
let sortingCenters = ref<Array<SortingCenter>>();
let orderAccounts = ref<Array<OrderAccount>>();

let rowData = ref({} as IOurRansom);

let isOpen = ref(false);

function openModal(row: IOurRansom) {
  isOpen.value = true;
  if (row.id) {
    rowData.value = JSON.parse(JSON.stringify(row));
    rowData.value.deliveredSC = rowData.value.deliveredSC
      ? storeUsers.getISODateTime(rowData.value.deliveredSC)
      : null;
    rowData.value.deliveredPVZ = rowData.value.deliveredPVZ
      ? storeUsers.getISODateTime(rowData.value.deliveredPVZ)
      : null;
    rowData.value.issued = rowData.value.issued
      ? storeUsers.getISODateTime(rowData.value.issued)
      : null;
    console.log(rowData.value.deliveredSC);
  } else {
    rowData.value = {} as IOurRansom;
    rowData.value.fromName = "";
  }
}

function closeModal() {
  isOpen.value = false;
  rowData.value = {} as IOurRansom;
}

async function updateDeliveryRow(obj: any) {
  let answer = confirm("Вы точно хотите изменить статус доставки?");
  if (answer) await storeRansom.updateDeliveryStatus(obj.row, obj.flag, "OurRansom");
  filteredRows.value = await storeRansom.getRansomRowsByFromName(fromNameString, cellString, "OurRansom");
  rows.value = await storeRansom.getRansomRowsByFromName(fromNameString, cellString, "OurRansom");
}

async function updateDeliveryRows(obj: any) {
  isLoading.value = true;
  let answer = confirm(
    `Вы точно хотите изменить статус доставки? Количество записей: ${obj.idArray.length}`
  );
  if (answer)
    await storeRansom.updateDeliveryRowsStatus(obj.idArray, obj.flag, "OurRansom");
  filteredRows.value = await storeRansom.getRansomRowsByFromName(fromNameString, cellString, "OurRansom");
  rows.value = await storeRansom.getRansomRowsByFromName(fromNameString, cellString, "OurRansom");
  isLoading.value = false;
}

async function deleteRow(id: number) {
  let answer = confirm("Вы точно хотите удалить данную строку?");
  if (answer) await storeRansom.deleteRansomRow(id, "OurRansom");
  filteredRows.value = await storeRansom.getRansomRowsByFromName(fromNameString, cellString, "OurRansom");
  rows.value = await storeRansom.getRansomRowsByFromName(fromNameString, cellString, "OurRansom");
}

async function deleteSelectedRows(idArray: number[]) {
  let answer = confirm(
    `Вы точно хотите удалить данные строки? Количество записей: ${idArray.length}`
  );
  if (answer) await storeRansom.deleteRansomSelectedRows(idArray, "OurRansom");
  filteredRows.value = await storeRansom.getRansomRowsByFromName(fromNameString, cellString, "OurRansom");
  rows.value = await storeRansom.getRansomRowsByFromName(fromNameString, cellString, "OurRansom");
}

async function updateRow() {
  isLoading.value = true;
  await storeRansom.updateRansomRow(rowData.value, user.value.username, "OurRansom");
  filteredRows.value = await storeRansom.getRansomRowsByFromName(fromNameString, cellString, "OurRansom");
  rows.value = await storeRansom.getRansomRowsByFromName(fromNameString, cellString, "OurRansom");
  closeModal();
  isLoading.value = false;
}

async function createRow() {
  isLoading.value = true;
  await storeRansom.createRansomRow(rowData.value, user.value.username, "OurRansom");
  filteredRows.value = await storeRansom.getRansomRowsByFromName(fromNameString, cellString, "OurRansom");
  rows.value = await storeRansom.getRansomRowsByFromName(fromNameString, cellString, "OurRansom");
  closeModal();
  isLoading.value = false;
}

async function createCopyRow(id: number) {
  await storeRansom.createCopyRow(id, "OurRansom");
  filteredRows.value = await storeRansom.getRansomRowsByFromName(fromNameString, cellString, "OurRansom");
  rows.value = await storeRansom.getRansomRowsByFromName(fromNameString, cellString, "OurRansom");
}

async function deleteIssuedRowsTimer() {
  isLoading.value = true;
  await storeRansom.deleteIssuedRows("OurRansom");
  filteredRows.value = await storeRansom.getRansomRowsByFromName(fromNameString, cellString, "OurRansom");
  rows.value = await storeRansom.getRansomRowsByFromName(fromNameString, cellString, "OurRansom");
  isLoading.value = false;
}

const filteredRows = ref<Array<IOurRansom>>();
function handleFilteredRows(filteredRowsData: IOurRansom[]) {
  if (user.value.visiblePVZ === "ВСЕ" && user.value.visibleSC === "ВСЕ") {
    filteredRows.value = filteredRowsData;
  } else if (user.value.visiblePVZ === "ВСЕ" && user.value.visibleSC !== "ВСЕ") {
    filteredRows.value = filteredRowsData.filter(
      (row) => row.orderPVZ === user.value.visibleSC && row.deliveredSC !== null
    );
  } else if (user.value.visiblePVZ !== "ВСЕ" && user.value.visibleSC === "ВСЕ") {
    filteredRows.value = filteredRowsData.filter(
      (row) => row.dispatchPVZ === user.value.visiblePVZ && row.deliveredSC !== null
    );
  } else if (user.value.visiblePVZ !== "ВСЕ" && user.value.visibleSC !== "ВСЕ") {
    filteredRows.value = filteredRowsData.filter(
      (row) =>
        row.dispatchPVZ === user.value.visiblePVZ &&
        row.orderPVZ === user.value.visibleSC &&
        row.deliveredSC !== null
    );
  }

  if (filteredRows.value) {
    if (user.value.role === "SORTIROVKA") {
      filteredRows.value = filteredRows.value.filter((row) => row.deliveredPVZ === null);
    } else if (user.value.role === "PVZ") {
      let today = new Date().toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
      filteredRows.value = filteredRows.value.filter(
        (row) =>
          row.deliveredSC !== null &&
          (new Date(row.issued).toLocaleDateString("ru-RU", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
          }) === today ||
            row.issued === null) &&
          row.deliveredPVZ !== null
      );
    }
  }
}

function timeUntilSunday2359() {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;

  const nextSunday1337 = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + daysUntilSunday,
    23,
    59,
    0,
    0
  );

  return nextSunday1337.getTime() - now.getTime();
}

function scheduleDeleteIssuedRows() {
  const timeUntilSunday2359Data = timeUntilSunday2359();

  setTimeout(async () => {
    await deleteIssuedRowsTimer();
  }, timeUntilSunday2359Data);
}

scheduleDeleteIssuedRows();

onMounted(async () => {
  isLoading.value = true;
  user.value = await storeUsers.getUser();
  rows.value = await storeRansom.getRansomRowsByFromName(fromNameString, cellString, "OurRansom");
  pvz.value = await storePVZ.getPVZ();
  sortingCenters.value = await storeSortingCenters.getSortingCenters();
  orderAccounts.value = await storeOrderAccounts.getOrderAccounts();

  if (rows.value) {
    handleFilteredRows(rows.value);
  }

  if (!user.value.PVZ.includes(pvzLink)) {
    toast.error("У вас нет прав на просмотр товаров этого ПВЗ!");
    router.push("/spreadsheets/our-ransom");
  }

  isLoading.value = false;
});

onBeforeMount(() => {
  if (!token || user.value.dataOurRansom === "NONE") {
    router.push("/auth/login");
  }
});

definePageMeta({
  layout: false,
});

const token = Cookies.get("token");
let showAddFields = ref(false);

function getCellFromName() {
  if (rowData.value.fromName.trim().length === 12) {
    let rowCell = rows.value?.filter((row) => row.fromName === rowData.value.fromName);
    if (rowCell) {
      rowData.value.cell = rowCell[0].cell;
    }
  }
}

function getFromNameFromCell() {
  if (rowData.value.cell.trim()) {
    let rowFromName = rows.value?.filter((row) => row.cell === rowData.value.cell);
    if (rowFromName) {
      rowData.value.fromName = rowFromName[0].fromName;
    }
  }
}
</script>

<template>
  <Head>
    <Title>Наш выкуп</Title>
  </Head>
  <div>
    <div v-if="user.role === 'ADMIN'">
      <NuxtLayout name="admin">
        <div v-if="!isLoading" class="mt-3">
          <div>
            <SpreadsheetsOurRansomFilters
              v-if="rows"
              @filtered-rows="handleFilteredRows"
              :rows="rows"
              :user="user"
            />
            <div
              class="mt-5 flex items-center gap-3"
              v-if="user.dataOurRansom === 'WRITE'"
            >
              <UIMainButton
                v-if="user.role === 'ADMIN' || user.role === 'ADMINISTRATOR'"
                @click="openModal"
              >
                Создать новую запись</UIMainButton
              >
            </div>
          </div>

          <SpreadsheetsOurRansomTable1
            @update-delivery-row="updateDeliveryRow"
            :rows="filteredRows"
            :user="user"
            @delete-row="deleteRow"
            @open-modal="openModal"
            @delete-selected-rows="deleteSelectedRows"
            @update-delivery-rows="updateDeliveryRows"
            @create-copy-row="createCopyRow"
            :pvz-link="pvzLink"
          />

          <UIModal v-show="isOpen" @close-modal="closeModal">
            <template v-slot:header>
              <div class="custom-header" v-if="rowData.id">
                Изменение строки с ID - <b> {{ rowData.id }}</b>
              </div>
              <div class="custom-header" v-else>Создание новой строки</div>
            </template>
            <div class="text-black">
              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.cell1 === 'READ' || user.cell1 === 'WRITE'"
              >
                <label for="cell">Ячейка</label>
                <input
                  :disabled="user.cell1 === 'READ'"
                  class="bg-transparent rounded-md border-2 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.cell"
                  @input="getFromNameFromCell"
                  type="text"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.fromName1 === 'READ' || user.fromName1 === 'WRITE'"
              >
                <label for="fromName">Телефон <sup>*</sup></label>
                <input
                  :disabled="user.fromName1 === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.fromName"
                  @input="getCellFromName"
                  type="text"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.productLink1 === 'READ' || user.productLink1 === 'WRITE'"
              >
                <label for="productLink1">Товар (ссылка)</label>
                <input
                  :disabled="user.productLink1 === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.productLink"
                  type="text"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.productName1 === 'READ' || user.productName1 === 'WRITE'"
              >
                <label for="productName1">Название товара</label>
                <input
                  :disabled="user.productName1 === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.productName"
                  type="text"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.notation1 === 'READ' || user.notation1 === 'WRITE'"
              >
                <label for="notation1">Примечание</label>
                <input
                  :disabled="user.notation1 === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.notation"
                  placeholder="По умолчанию: Пусто"
                  type="text"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.priceSite === 'READ' || user.priceSite === 'WRITE'"
              >
                <label for="priceSite">Стоимость сайт</label>
                <input
                  :disabled="user.priceSite === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.priceSite"
                  type="number"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.prepayment1 === 'READ' || user.prepayment1 === 'WRITE'"
              >
                <label for="prepayment1">Предоплата</label>
                <input
                  :disabled="user.prepayment1 === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.prepayment"
                  type="number"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.percentClient1 === 'READ' || user.percentClient1 === 'WRITE'"
              >
                <label for="percentClient1">Процент с клиента</label>
                <input
                  :disabled="user.percentClient1 === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.percentClient"
                  placeholder="По умолчанию: 10"
                  type="number"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.deliveredKGT1 === 'READ' || user.deliveredKGT1 === 'WRITE'"
              >
                <label for="deliveredKGT1"
                  >Дополнительная <br />
                  стоимость</label
                >
                <input
                  :disabled="user.deliveredKGT1 === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.deliveredKGT"
                  placeholder="По умолчанию: 0"
                  type="number"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.dispatchPVZ1 === 'READ' || user.dispatchPVZ1 === 'WRITE'"
              >
                <label for="dispatchPVZ1">Отправка в ПВЗ</label>
                <select
                  class="py-1 px-2 border-2 bg-transparent rounded-lg text-base disabled:text-gray-400"
                  v-model="rowData.dispatchPVZ"
                  :disabled="user.dispatchPVZ1 === 'READ'"
                >
                  <option v-for="pvzData in pvz" :value="pvzData.name">
                    {{ pvzData.name }}
                  </option>
                </select>
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.orderPVZ1 === 'READ' || user.orderPVZ1 === 'WRITE'"
              >
                <label for="orderPVZ1">Заказано на СЦ</label>
                <select
                  class="py-1 px-2 border-2 bg-transparent rounded-lg text-base disabled:text-gray-400"
                  v-model="rowData.orderPVZ"
                  :disabled="user.orderPVZ1 === 'READ'"
                >
                  <option
                    v-for="sortingCenter in sortingCenters"
                    :value="sortingCenter.name"
                  >
                    {{ sortingCenter.name }}
                  </option>
                </select>
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.orderAccount === 'READ' || user.orderAccount === 'WRITE'"
              >
                <label for="orderAccount">Аккаунт заказа</label>
                <select
                  :disabled="user.orderAccount === 'READ'"
                  class="py-1 px-2 border-2 bg-transparent rounded-lg text-base disabled:text-gray-400"
                  v-model="rowData.orderAccount"
                >
                  <option
                    v-for="orderAccount in orderAccounts"
                    :value="orderAccount.name"
                  >
                    {{ orderAccount.name }}
                  </option>
                </select>
              </div>

              <div class="grid grid-cols-2 mb-5" v-if="!rowData.id">
                <label for="quantity">Количество строк</label>
                <input
                  type="number"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  min="1"
                  v-model="rowData.quantity"
                />
              </div>

              <h1
                @click="showAddFields = !showAddFields"
                class="cursor-pointer hover:opacity-50 text-secondary-color font-bold duration-200 mb-5"
              >
                Показать ещё настройки
              </h1>
              <div v-if="showAddFields">
                <div
                  class="grid grid-cols-2 mb-5"
                  v-if="user.deliveredSC1 === 'READ' || user.deliveredSC1 === 'WRITE'"
                >
                  <label for="deliveredSC1">Доставлено на СЦ</label>
                  <input
                    :disabled="user.deliveredSC1 === 'READ'"
                    class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                    v-model="rowData.deliveredSC"
                    type="datetime-local"
                  />
                </div>

                <div
                  class="grid grid-cols-2 mb-5"
                  v-if="user.deliveredPVZ1 === 'READ' || user.deliveredPVZ1 === 'WRITE'"
                >
                  <label for="deliveredPVZ1">Доставлено на ПВЗ</label>
                  <input
                    :disabled="user.deliveredPVZ1 === 'READ'"
                    class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                    v-model="rowData.deliveredPVZ"
                    type="datetime-local"
                  />
                </div>

                <div
                  class="grid grid-cols-2 mb-5"
                  v-if="user.issued1 === 'READ' || user.issued1 === 'WRITE'"
                >
                  <label for="issued1">Выдан клиенту</label>
                  <input
                    :disabled="user.issued1 === 'READ'"
                    class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                    v-model="rowData.issued"
                    type="datetime-local"
                  />
                </div>

                <div
                  class="grid grid-cols-2 mb-5"
                  v-if="user.additionally1 === 'READ' || user.additionally1 === 'WRITE'"
                >
                  <label for="additionally1">Дополнительно</label>
                  <select
                    class="py-1 px-2 border-2 bg-transparent rounded-lg text-base disabled:text-gray-400"
                    v-model="rowData.additionally"
                    :disabled="user.additionally1 === 'READ'"
                  >
                    <option value="">Отменить</option>
                    <option value="Оплачено онлайн">Оплачено онлайн</option>
                    <option value="Отказ клиент">Отказ клиент</option>
                    <option value="Отказ брак">Отказ брак</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-center gap-3 mt-10" v-if="rowData.id">
              <UIMainButton @click="updateRow">Сохранить </UIMainButton>
              <UIMainButton @click="closeModal">Отменить </UIMainButton>
            </div>
            <div class="flex items-center justify-center gap-3 mt-10" v-else>
              <UIMainButton
                :disabled="rowData.fromName === '' || rowData.fromName === null"
                @click="createRow"
                >Создать
              </UIMainButton>
              <UIMainButton @click="closeModal">Отменить </UIMainButton>
            </div>
          </UIModal>
        </div>
        <div v-else>
          <UISpinner />
        </div>
      </NuxtLayout>
    </div>
    <div v-else>
      <NuxtLayout name="user">
        <div v-if="!isLoading" class="mt-3">
          <div>
            <SpreadsheetsOurRansomFilters
              v-if="rows && user.role !== 'PVZ'"
              @filtered-rows="handleFilteredRows"
              :rows="rows"
              :user="user"
            />
            <div
              class="mt-5 flex items-center gap-3"
              v-if="user.dataOurRansom === 'WRITE'"
            >
              <UIMainButton
                v-if="user.role === 'ADMIN' || user.role === 'ADMINISTRATOR'"
                @click="openModal"
              >
                Создать новую запись</UIMainButton
              >
            </div>
          </div>

          <SpreadsheetsOurRansomTable1
            @update-delivery-row="updateDeliveryRow"
            :rows="filteredRows"
            :user="user"
            @delete-row="deleteRow"
            @open-modal="openModal"
            @delete-selected-rows="deleteSelectedRows"
            @update-delivery-rows="updateDeliveryRows"
            @create-copy-row="createCopyRow"
            :pvz-link="pvzLink"
          />

          <UIModal v-show="isOpen" @close-modal="closeModal">
            <template v-slot:header>
              <div class="custom-header" v-if="rowData.id">
                Изменение строки с ID - <b> {{ rowData.id }}</b>
              </div>
              <div class="custom-header" v-else>Создание новой строки</div>
            </template>
            <div class="text-black">
              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.cell1 === 'READ' || user.cell1 === 'WRITE'"
              >
                <label for="cell">Ячейка</label>
                <input
                  :disabled="user.cell1 === 'READ'"
                  class="bg-transparent rounded-md border-2 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.cell"
                  type="text"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.fromName1 === 'READ' || user.fromName1 === 'WRITE'"
              >
                <label for="fromName">Телефон <sup>*</sup></label>
                <input
                  :disabled="user.fromName1 === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.fromName"
                  @input="getCellFromName"
                  type="text"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.productLink1 === 'READ' || user.productLink1 === 'WRITE'"
              >
                <label for="productLink1">Товар (ссылка)</label>
                <input
                  :disabled="user.productLink1 === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.productLink"
                  type="text"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.productName1 === 'READ' || user.productName1 === 'WRITE'"
              >
                <label for="productName1">Название товара</label>
                <input
                  :disabled="user.productName1 === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.productName"
                  type="text"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.notation1 === 'READ' || user.notation1 === 'WRITE'"
              >
                <label for="notation1">Примечание</label>
                <input
                  :disabled="user.notation1 === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.notation"
                  placeholder="По умолчанию: Пусто"
                  type="text"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.priceSite === 'READ' || user.priceSite === 'WRITE'"
              >
                <label for="priceSite">Стоимость сайт</label>
                <input
                  :disabled="user.priceSite === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.priceSite"
                  type="number"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.prepayment1 === 'READ' || user.prepayment1 === 'WRITE'"
              >
                <label for="prepayment1">Предоплата</label>
                <input
                  :disabled="user.prepayment1 === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.prepayment"
                  type="number"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.percentClient1 === 'READ' || user.percentClient1 === 'WRITE'"
              >
                <label for="percentClient1">Процент с клиента</label>
                <input
                  :disabled="user.percentClient1 === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.percentClient"
                  placeholder="По умолчанию: 10"
                  type="number"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.deliveredKGT1 === 'READ' || user.deliveredKGT1 === 'WRITE'"
              >
                <label for="deliveredKGT1"
                  >Дополнительная <br />
                  стоимость</label
                >
                <input
                  :disabled="user.deliveredKGT1 === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.deliveredKGT"
                  placeholder="По умолчанию: 0"
                  type="number"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.dispatchPVZ1 === 'READ' || user.dispatchPVZ1 === 'WRITE'"
              >
                <label for="dispatchPVZ1">Отправка в ПВЗ</label>
                <select
                  class="py-1 px-2 border-2 bg-transparent rounded-lg text-base disabled:text-gray-400"
                  v-model="rowData.dispatchPVZ"
                  :disabled="user.dispatchPVZ1 === 'READ'"
                >
                  <option v-for="pvzData in pvz" :value="pvzData.name">
                    {{ pvzData.name }}
                  </option>
                </select>
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.orderPVZ1 === 'READ' || user.orderPVZ1 === 'WRITE'"
              >
                <label for="orderPVZ1">Заказано на СЦ</label>
                <select
                  class="py-1 px-2 border-2 bg-transparent rounded-lg text-base disabled:text-gray-400"
                  v-model="rowData.orderPVZ"
                  :disabled="user.orderPVZ1 === 'READ'"
                >
                  <option
                    v-for="sortingCenter in sortingCenters"
                    :value="sortingCenter.name"
                  >
                    {{ sortingCenter.name }}
                  </option>
                </select>
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.orderAccount === 'READ' || user.orderAccount === 'WRITE'"
              >
                <label for="orderAccount">Аккаунт заказа</label>
                <select
                  :disabled="user.orderAccount === 'READ'"
                  class="py-1 px-2 border-2 bg-transparent rounded-lg text-base disabled:text-gray-400"
                  v-model="rowData.orderAccount"
                >
                  <option
                    v-for="orderAccount in orderAccounts"
                    :value="orderAccount.name"
                  >
                    {{ orderAccount.name }}
                  </option>
                </select>
              </div>

              <div class="grid grid-cols-2 mb-5" v-if="!rowData.id">
                <label for="quantity">Количество строк</label>
                <input
                  type="number"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  min="1"
                  v-model="rowData.quantity"
                />
              </div>

              <h1
                @click="showAddFields = !showAddFields"
                class="cursor-pointer hover:opacity-50 text-secondary-color font-bold duration-200 mb-5"
              >
                Показать ещё настройки
              </h1>
              <div v-if="showAddFields">
                <div
                  class="grid grid-cols-2 mb-5"
                  v-if="user.deliveredSC1 === 'READ' || user.deliveredSC1 === 'WRITE'"
                >
                  <label for="deliveredSC1">Доставлено на СЦ</label>
                  <input
                    :disabled="user.deliveredSC1 === 'READ'"
                    class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                    v-model="rowData.deliveredSC"
                    type="datetime-local"
                  />
                </div>

                <div
                  class="grid grid-cols-2 mb-5"
                  v-if="user.deliveredPVZ1 === 'READ' || user.deliveredPVZ1 === 'WRITE'"
                >
                  <label for="deliveredPVZ1">Доставлено на ПВЗ</label>
                  <input
                    :disabled="user.deliveredPVZ1 === 'READ'"
                    class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                    v-model="rowData.deliveredPVZ"
                    type="datetime-local"
                  />
                </div>

                <div
                  class="grid grid-cols-2 mb-5"
                  v-if="user.issued1 === 'READ' || user.issued1 === 'WRITE'"
                >
                  <label for="issued1">Выдан клиенту</label>
                  <input
                    :disabled="user.issued1 === 'READ'"
                    class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                    v-model="rowData.issued"
                    type="datetime-local"
                  />
                </div>

                <div
                  class="grid grid-cols-2 mb-5"
                  v-if="user.additionally1 === 'READ' || user.additionally1 === 'WRITE'"
                >
                  <label for="additionally1">Дополнительно</label>
                  <select
                    class="py-1 px-2 border-2 bg-transparent rounded-lg text-base disabled:text-gray-400"
                    v-model="rowData.additionally"
                    :disabled="user.additionally1 === 'READ'"
                  >
                    <option value="">Отменить</option>
                    <option value="Оплачено онлайн">Оплачено онлайн</option>
                    <option value="Отказ клиент">Отказ клиент</option>
                    <option value="Отказ брак">Отказ брак</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-center gap-3 mt-10" v-if="rowData.id">
              <UIMainButton @click="updateRow">Сохранить </UIMainButton>
              <UIMainButton @click="closeModal">Отменить </UIMainButton>
            </div>
            <div class="flex items-center justify-center gap-3 mt-10" v-else>
              <UIMainButton
                :disabled="rowData.fromName === '' || rowData.fromName === null"
                @click="createRow"
                >Создать
              </UIMainButton>
              <UIMainButton @click="closeModal">Отменить </UIMainButton>
            </div>
          </UIModal>
        </div>
        <div v-else>
          <UISpinner />
        </div>
      </NuxtLayout>
    </div>
  </div>
</template>
