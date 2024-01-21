<script setup lang="ts">
import { useToast } from "vue-toastification";
import Cookies from "js-cookie";

const storeUsers = useUsersStore();
const storeRansom = useRansomStore();
const storePVZ = usePVZStore();
const storeSortingCenters = useSortingCentersStore();

const router = useRouter();

let isLoading = ref(false);

let user = ref({} as User);

let rows = ref<Array<IClientRansom>>();
let pvz = ref<Array<PVZ>>();
let sortingCenters = ref<Array<SortingCenter>>();

let rowData = ref({} as IClientRansom);

let isOpen = ref(false);

function openModal(row: IClientRansom) {
  isOpen.value = true;
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
}

function closeModal() {
  isOpen.value = false;
  rowData.value = {} as IClientRansom;
}

async function updateDeliveryRow(obj: any) {
  isLoading.value = true;
  let answer = confirm("Вы точно хотите изменить статус доставки?");
  if (answer) await storeRansom.updateDeliveryStatus(obj.row, obj.flag, 'ClientRansom');
  filteredRows.value = await storeRansom.getRansomRows('ClientRansom');
  rows.value = await storeRansom.getRansomRows('ClientRansom');
  isLoading.value = false;
}

async function updateDeliveryRows(obj: any) {
  isLoading.value = true;
  let answer = confirm("Вы точно хотите изменить статус доставки?");
  if (answer) await storeRansom.updateDeliveryRowsStatus(obj.idArray, obj.flag, 'ClientRansom');
  filteredRows.value = await storeRansom.getRansomRows('ClientRansom');
  rows.value = await storeRansom.getRansomRows('ClientRansom');
  isLoading.value = false;
}


async function deleteRow(id: number) {
  isLoading.value = true;
  let answer = confirm("Вы точно хотите удалить данную строку?");
  if (answer) await storeRansom.deleteRansomRow(id, 'ClientRansom');
  filteredRows.value = await storeRansom.getRansomRows('ClientRansom');
  rows.value = await storeRansom.getRansomRows('ClientRansom');
  isLoading.value = false;
}

async function deleteSelectedRows(idArray: number[]) {
  isLoading.value = true;
  let answer = confirm("Вы точно хотите удалить данные строки?");
  if (answer) await storeRansom.deleteRansomSelectedRows(idArray, 'ClientRansom');
  filteredRows.value = await storeRansom.getRansomRows('ClientRansom');
  rows.value = await storeRansom.getRansomRows('ClientRansom');
  isLoading.value = false;
}

async function updateRow() {
  isLoading.value = true;
  await storeRansom.updateRansomRow(rowData.value, user.value.username, 'ClientRansom');
  filteredRows.value = await storeRansom.getRansomRows('ClientRansom');
  rows.value = await storeRansom.getRansomRows('ClientRansom');
  closeModal();
  isLoading.value = false;
}

async function createRow() {
  isLoading.value = true;
  await storeRansom.createRansomRow(rowData.value, user.value.username, 'ClientRansom');
  filteredRows.value = await storeRansom.getRansomRows('ClientRansom');
  rows.value = await storeRansom.getRansomRows('ClientRansom');
  closeModal();
  isLoading.value = false;
}

const filteredRows = ref<Array<IClientRansom>>();

function handleFilteredRows(filteredRowsData: IClientRansom[]) {
  filteredRows.value = filteredRowsData
}

onMounted(async () => {
  isLoading.value = true;
  user.value = await storeUsers.getUser();
  rows.value = await storeRansom.getRansomRows('ClientRansom');
  pvz.value = await storePVZ.getPVZ();
  sortingCenters.value = await storeSortingCenters.getSortingCenters();

  if (rows.value) {
    handleFilteredRows(rows.value)
  }

  isLoading.value = false;

  if (!token || user.value.dataClientRansom === "NONE") {
    router.push("/auth/login");
  }
});

definePageMeta({
  layout: false,
});

const token = Cookies.get("token");
</script>

<template>
  <Head>
    <Title>Выкуп клиента</Title>
  </Head>
  <div>
    <div v-if="user.role === 'ADMIN'">
      <NuxtLayout name="admin">
        <div v-if="!isLoading" class="mt-3">
          <div>
            <SpreadsheetsClientRansomFilters v-if="rows" @filtered-rows="handleFilteredRows" :rows="rows" />

            <div class="mt-5" v-if="user.dataOurRansom === 'WRITE'">
              <UIMainButton @click="openModal">Создать новую запись</UIMainButton>
            </div>
          </div>

          <SpreadsheetsClientRansomTable
            @update-delivery-row="updateDeliveryRow"
            :rows="filteredRows"
            :user="user"
            @delete-row="deleteRow"
            @open-modal="openModal"
            @delete-selected-rows="deleteSelectedRows"
            @update-delivery-rows="updateDeliveryRows"
            v-if="filteredRows"
          />

          <div v-else class="flex items-center flex-col justify-center mt-10 text-2xl">
            <Icon name="ion:ios-close-empty" size="100" class="text-red-500" />
            <h1>Извините, записи по данным фильтрам не были найдены!</h1>
            <h1>Попробуйте поставить другие фильтры или очистить их</h1>
          </div>

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
                v-if="user.cell === 'READ' || user.cell === 'WRITE'"
              >
                <label for="name">Ячейка</label>
                <input
                  :disabled="user.cell === 'READ'"
                  class="bg-transparent rounded-md border-2 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.cell"
                  type="text"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.fromName === 'READ' || user.fromName === 'WRITE'"
              >
                <label for="name">Имя</label>
                <input
                  :disabled="user.name === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.name"
                  type="text"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.fromName === 'READ' || user.fromName === 'WRITE'"
              >
                <label for="name">Телефон</label>
                <input
                  :disabled="user.fromName === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.fromName"
                  type="text"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.productLink === 'READ' || user.productLink === 'WRITE'"
              >
                <label for="name">Товар (ссылка)</label>
                <input
                  :disabled="user.productLink === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.productLink"
                  type="text"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.productName === 'READ' || user.productName === 'WRITE'"
              >
                <label for="name">Название товара</label>
                <input
                  :disabled="user.productName === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.productName"
                  type="text"
                />
              </div>



              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.priceProgram === 'READ' || user.priceProgram === 'WRITE'"
              >
                <label for="name">Стоимость выкупа товара</label>
                <input
                  :disabled="user.priceProgram === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.priceProgram"
                  type="number"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.percentClient === 'READ' || user.percentClient === 'WRITE'"
              >
                <label for="name">Процент с клиента</label>
                <input
                  :disabled="user.percentClient === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.percentClient"
                  placeholder="По умолчанию: 0.1"
                  type="number"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.productLink === 'READ' || user.productLink === 'WRITE'"
              >
                <label for="name">Доставка КГТ</label>
                <input
                  :disabled="user.deliveredKGT === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.deliveredKGT"
                  placeholder="По умолчанию: 0"
                  type="number"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.dispatchPVZ === 'READ' || user.dispatchPVZ === 'WRITE'"
              >
                <label for="name">Отправка в ПВЗ</label>
                <select
                  class="py-1 px-2 border-2 bg-transparent rounded-lg text-base disabled:text-gray-400"
                  v-model="rowData.dispatchPVZ"
                  :disabled="user.dispatchPVZ === 'READ'"
                >
                  <option v-for="pvzData in pvz" :value="pvzData.name">
                    {{ pvzData.name }}
                  </option>
                </select>
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.orderPVZ === 'READ' || user.orderPVZ === 'WRITE'"
              >
                <label for="name">Заказано на СЦ</label>
                <select
                  class="py-1 px-2 border-2 bg-transparent rounded-lg text-base disabled:text-gray-400"
                  v-model="rowData.orderPVZ"
                  :disabled="user.orderPVZ === 'READ'"
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
                v-if="user.deliveredSC === 'READ' || user.deliveredSC === 'WRITE'"
              >
                <label for="name">Доставлено на СЦ</label>
                <input
                  :disabled="user.deliveredSC === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.deliveredSC"
                  type="datetime-local"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.deliveredPVZ === 'READ' || user.deliveredPVZ === 'WRITE'"
              >
                <label for="name">Доставлено на ПВЗ</label>
                <input
                  :disabled="user.deliveredPVZ === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.deliveredPVZ"
                  type="datetime-local"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.issued === 'READ' || user.issued === 'WRITE'"
              >
                <label for="name">Выдан клиенту</label>
                <input
                  :disabled="user.issued === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.issued"
                  type="datetime-local"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.additionally === 'READ' || user.additionally === 'WRITE'"
              >
                <label for="name">Дополнительно</label>
                <select
                  class="py-1 px-2 border-2 bg-transparent rounded-lg text-base disabled:text-gray-400"
                  v-model="rowData.additionally"
                  :disabled="user.additionally === 'READ'"
                >
                  <option value="Оплачено онлайн">Оплачено онлайн</option>
                  <option value="Отказ клиент">Отказ клиент</option>
                  <option value="Отказ брак">Отказ брак</option>
                </select>
              </div>
            </div>

            <div
              class="flex items-center justify-center gap-3 mt-10"
              v-if="rowData.id"
            >
              <UIMainButton @click="updateRow">Сохранить</UIMainButton>
              <UIErrorButton @click="closeModal">Отменить </UIErrorButton>
            </div>
            <div class="flex items-center justify-center gap-3 mt-10" v-else>
              <UIMainButton @click="createRow">Создать</UIMainButton>
              <UIErrorButton @click="closeModal">Отменить </UIErrorButton>
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
            <SpreadsheetsClientRansomFilters v-if="rows" @filtered-rows="handleFilteredRows" :rows="rows" />
            <div class="mt-5" v-if="user.dataOurRansom === 'WRITE'">
              <UIMainButton @click="openModal">Создать новую запись</UIMainButton>
            </div>
          </div>

          <SpreadsheetsClientRansomTable
            @update-delivery-row="updateDeliveryRow"
            :rows="filteredRows"
            :user="user"
            @delete-row="deleteRow"
            @open-modal="openModal"
            @update-delivery-rows="updateDeliveryRows"
            v-if="filteredRows"
          />

          <div v-else class="flex items-center flex-col justify-center mt-10 text-2xl">
            <Icon name="ion:ios-close-empty" size="100" class="text-red-500" />
            <h1>Извините, записи по данным фильтрам не были найдены!</h1>
            <h1>Попробуйте поставить другие фильтры или очистить их</h1>
          </div>
          
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
                v-if="user.cell === 'READ' || user.cell === 'WRITE'"
              >
                <label for="name">Ячейка</label>
                <input
                  :disabled="user.cell === 'READ'"
                  class="bg-transparent rounded-md border-2 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.cell"
                  type="text"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.fromName === 'READ' || user.fromName === 'WRITE'"
              >
                <label for="name">Имя</label>
                <input
                  :disabled="user.name === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.name"
                  type="text"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.fromName === 'READ' || user.fromName === 'WRITE'"
              >
                <label for="name">Телефон</label>
                <input
                  :disabled="user.fromName === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.fromName"
                  type="text"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.productLink === 'READ' || user.productLink === 'WRITE'"
              >
                <label for="name">Товар (ссылка)</label>
                <input
                  :disabled="user.productLink === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.productLink"
                  type="text"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.productName === 'READ' || user.productName === 'WRITE'"
              >
                <label for="name">Название товара</label>
                <input
                  :disabled="user.productName === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.productName"
                  type="text"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.priceProgram === 'READ' || user.priceProgram === 'WRITE'"
              >
                <label for="name">Стоимость выкупа товара</label>
                <input
                  :disabled="user.priceProgram === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.priceProgram"
                  type="number"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.percentClient === 'READ' || user.percentClient === 'WRITE'"
              >
                <label for="name">Процент с клиента</label>
                <input
                  :disabled="user.percentClient === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.percentClient"
                  placeholder="По умолчанию: 0.1"
                  type="number"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.productLink === 'READ' || user.productLink === 'WRITE'"
              >
                <label for="name">Доставка КГТ</label>
                <input
                  :disabled="user.deliveredKGT === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.deliveredKGT"
                  placeholder="По умолчанию: 0"
                  type="number"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.dispatchPVZ === 'READ' || user.dispatchPVZ === 'WRITE'"
              >
                <label for="name">Отправка в ПВЗ</label>
                <select
                  class="py-1 px-2 border-2 bg-transparent rounded-lg text-base disabled:text-gray-400"
                  v-model="rowData.dispatchPVZ"
                  :disabled="user.dispatchPVZ === 'READ'"
                >
                  <option v-for="pvzData in pvz" :value="pvzData.name">
                    {{ pvzData.name }}
                  </option>
                </select>
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.orderPVZ === 'READ' || user.orderPVZ === 'WRITE'"
              >
                <label for="name">Заказано на СЦ</label>
                <select
                  class="py-1 px-2 border-2 bg-transparent rounded-lg text-base disabled:text-gray-400"
                  v-model="rowData.orderPVZ"
                  :disabled="user.orderPVZ === 'READ'"
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
                v-if="user.deliveredSC === 'READ' || user.deliveredSC === 'WRITE'"
              >
                <label for="name">Доставлено на СЦ</label>
                <input
                  :disabled="user.deliveredSC === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.deliveredSC"
                  type="datetime-local"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.deliveredPVZ === 'READ' || user.deliveredPVZ === 'WRITE'"
              >
                <label for="name">Доставлено на ПВЗ</label>
                <input
                  :disabled="user.deliveredPVZ === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.deliveredPVZ"
                  type="datetime-local"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.issued === 'READ' || user.issued === 'WRITE'"
              >
                <label for="name">Выдан клиенту</label>
                <input
                  :disabled="user.issued === 'READ'"
                  class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                  v-model="rowData.issued"
                  type="datetime-local"
                />
              </div>

              <div
                class="grid grid-cols-2 mb-5"
                v-if="user.additionally === 'READ' || user.additionally === 'WRITE'"
              >
                <label for="name">Дополнительно</label>
                <select
                  class="py-1 px-2 border-2 bg-transparent rounded-lg text-base disabled:text-gray-400"
                  v-model="rowData.additionally"
                  :disabled="user.additionally === 'READ'"
                >
                  <option value="Оплачено онлайн">Оплачено онлайн</option>
                  <option value="Отказ клиент">Отказ клиент</option>
                  <option value="Отказ брак">Отказ брак</option>
                </select>
              </div>
            </div>

            <div
              class="flex items-center justify-center gap-3 mt-10"
              v-if="rowData.id"
            >
              <UIMainButton @click="updateRow">Сохранить</UIMainButton>
              <UIErrorButton @click="closeModal">Отменить</UIErrorButton>
            </div>
            <div class="flex items-center justify-center gap-3 mt-10" v-else>
              <UIMainButton @click="createRow">Создать</UIMainButton>
              <UIErrorButton @click="closeModal">Отменить </UIErrorButton>
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
