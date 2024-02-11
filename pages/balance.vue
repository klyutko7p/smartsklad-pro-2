<script setup lang="ts">
import Cookies from "js-cookie";

const storeUsers = useUsersStore();
const storePVZ = usePVZStore();
const storeRansom = useRansomStore();
const router = useRouter();

let user = ref({} as User);
let pvz = ref<Array<PVZ>>();
let ourRansomRows = ref<Array<IOurRansom>>();
let clientRansomRows = ref<Array<IClientRansom>>();
let deliveryRansomRows = ref<Array<IDelivery>>();
const token = Cookies.get("token");
let isLoading = ref(false);

onBeforeMount(async () => {
    isLoading.value = true;
    user.value = await storeUsers.getUser();
    pvz.value = await storePVZ.getPVZ();

    ourRansomRows.value = await storeRansom.getRansomRows("OurRansom");
    clientRansomRows.value = await storeRansom.getRansomRows("ClientRansom");
    deliveryRansomRows.value = await storeRansom.getRansomRows("Delivery");

    getAllSum();

    if (user.value.role === 'PVZ') {
        selectedPVZ.value = user.value.visiblePVZ;
    }
    isLoading.value = false;
});

onMounted(() => {
    if (!token) {
        router.push("/auth/login");
    }
});

definePageMeta({
    layout: false,
    name: "Баланс",
});

let copyArrayOurRansom = ref<Array<IOurRansom>>();
let copyArrayClientRansom = ref<Array<IClientRansom>>();

let sum1 = ref(0);
let sum2 = ref(0);
let sum3 = ref(0);
let allSum = ref(0);
let showFilters = ref(false);

let selectedPVZ = ref("Все ПВЗ");
let selectedTypeOfTransaction = ref("Баланс наличные");

const startingDate = ref<Date | string | null>(null);
const endDate = ref<Date | string | null>(null);

function calculateValue(curValue: any) {
    if (!curValue.prepayment) {
        return curValue.additionally !== "Отказ клиент"
            ? Math.ceil(curValue.amountFromClient1 / 10) * 10 -
            curValue.priceSite +
            curValue.deliveredKGT
            : 200;
    } else {
        return curValue.additionally !== "Отказ клиент"
            ? (curValue.priceSite * curValue.percentClient) / 100 + curValue.deliveredKGT
            : 200;
    }
}

function reduceArray(array: any, flag: string) {
    if (selectedTypeOfTransaction.value === "Доход") {
        if (flag === "OurRansom") {
            array = array.filter((row: any) => row.additionally !== "Отказ брак");
            return array.reduce((ac: any, curValue: any) => ac + calculateValue(curValue), 0);
        } else if (flag === "ClientRansom") {
            array = array.filter((row: any) => row.additionally !== "Отказ брак");
            return array.reduce((ac: any, curValue: any) => ac + curValue.profit2, 0);
        } else {
            array = array.filter((row: any) => row.additionally !== "Отказ брак");
            return array.reduce((ac: any, curValue: any) => ac + curValue.profit3, 0);
        }
    } else if (selectedTypeOfTransaction.value === "Заказано") {
        if (flag === "OurRansom") {
            return array.reduce((ac: any, curValue: any) => ac + curValue.priceSite, 0);
        }
    } else if (selectedTypeOfTransaction.value === "Баланс наличные") {
        if (flag === "OurRansom") {
            array = array.filter((row: any) => row.additionally !== "Отказ брак");
            return array.reduce((ac: any, curValue: any) => ac + (Math.ceil(curValue.amountFromClient1 / 10) * 10 + curValue.prepayment), 0);
        } else if (flag === "ClientRansom") {
            array = array.filter((row: any) => row.additionally !== "Отказ брак");
            return array.reduce((ac: any, curValue: any) => ac + (curValue.amountFromClient2 + curValue.prepayment), 0);
        } else {
            array = array.filter((row: any) => row.additionally !== "Отказ брак");
            return array.reduce((ac: any, curValue: any) => ac + (curValue.amountFromClient3), 0);
        }
    } else if (selectedTypeOfTransaction.value === "Баланс безнал") {
        if (flag === "OurRansom") {
            array = array.filter((row: any) => row.additionally !== "Отказ брак");
            return array.reduce((ac: any, curValue: any) => ac + (Math.ceil(curValue.amountFromClient1 / 10) * 10 + curValue.prepayment), 0);
        } else if (flag === "ClientRansom") {
            array = array.filter((row: any) => row.additionally !== "Отказ брак");
            return array.reduce((ac: any, curValue: any) => ac + (curValue.amountFromClient2 + curValue.prepayment), 0);
        } else {
            array = array.filter((row: any) => row.additionally !== "Отказ брак");
            return array.reduce((ac: any, curValue: any) => ac + (curValue.amountFromClient3), 0);
        }
    } else if (selectedTypeOfTransaction.value === "Сумма с клиента+предоплата всего") {
        if (flag === "OurRansom") {
            array = array.filter((row: any) => row.additionally !== "Отказ брак");
            return array.reduce((ac: any, curValue: any) => ac + (Math.ceil(curValue.amountFromClient1 / 10) * 10 + curValue.prepayment), 0);
        } else if (flag === "ClientRansom") {
            array = array.filter((row: any) => row.additionally !== "Отказ брак");
            return array.reduce((ac: any, curValue: any) => ac + (curValue.amountFromClient2 + curValue.prepayment), 0);
        } else {
            array = array.filter((row: any) => row.additionally !== "Отказ брак");
            return array.reduce((ac: any, curValue: any) => ac + (curValue.amountFromClient3), 0);
        }
    }
}

function getAllSum() {
    if (selectedTypeOfTransaction.value === "Доход") {
        if (selectedPVZ.value === "Все ПВЗ") {
            copyArrayOurRansom.value = ourRansomRows.value
                ?.filter(
                    (row) =>
                        row.issued !== null &&
                        (!startingDate.value || new Date(row.issued) >= new Date(startingDate.value)) &&
                        (!endDate.value || new Date(row.issued) <= new Date(endDate.value))
                )
                .sort((a, b) => new Date(b.issued) - new Date(a.issued));

            copyArrayClientRansom.value = clientRansomRows.value
                ?.filter(
                    (row) =>
                        row.issued !== null &&
                        (!startingDate.value || new Date(row.issued) >= new Date(startingDate.value)) &&
                        (!endDate.value || new Date(row.issued) <= new Date(endDate.value))
                )
                .sort((a, b) => new Date(b.issued) - new Date(a.issued));

            sum1.value = reduceArray(copyArrayOurRansom.value, "OurRansom");
            sum2.value = reduceArray(copyArrayClientRansom.value, "ClientRansom");
            allSum.value = sum1.value + sum2.value;
        } else {
            copyArrayOurRansom.value = ourRansomRows.value
                ?.filter(
                    (row) =>
                        row.dispatchPVZ === selectedPVZ.value &&
                        row.issued !== null &&
                        (!startingDate.value || new Date(row.issued) >= new Date(startingDate.value)) &&
                        (!endDate.value || new Date(row.issued) <= new Date(endDate.value))
                )
                .sort((a, b) => new Date(b.issued) - new Date(a.issued));

            copyArrayClientRansom.value = clientRansomRows.value
                ?.filter(
                    (row) =>
                        row.dispatchPVZ === selectedPVZ.value &&
                        row.issued !== null &&
                        (!startingDate.value || new Date(row.issued) >= new Date(startingDate.value)) &&
                        (!endDate.value || new Date(row.issued) <= new Date(endDate.value))
                )
                .sort((a, b) => new Date(b.issued) - new Date(a.issued));

            sum1.value = reduceArray(copyArrayOurRansom.value, "OurRansom");
            sum2.value = reduceArray(copyArrayClientRansom.value, "ClientRansom");
            allSum.value = sum1.value + sum2.value;
        }
    } else if (selectedTypeOfTransaction.value === "Заказано") {
        if (selectedPVZ.value === "Все ПВЗ") {
            copyArrayOurRansom.value = ourRansomRows.value
                ?.filter(
                    (row) =>
                        row.issued !== null &&
                        (!startingDate.value || new Date(row.issued) >= new Date(startingDate.value)) &&
                        (!endDate.value || new Date(row.issued) <= new Date(endDate.value))
                )
                .sort((a, b) => new Date(b.issued) - new Date(a.issued));
            sum1.value = reduceArray(copyArrayOurRansom.value, "OurRansom");
            allSum.value = sum1.value;
        } else {
            copyArrayOurRansom.value = ourRansomRows.value
                ?.filter((row) => row.dispatchPVZ === selectedPVZ.value && row.issued !== null &&
                    (!startingDate.value || new Date(row.issued) >= new Date(startingDate.value)) &&
                    (!endDate.value || new Date(row.issued) <= new Date(endDate.value)))
                .sort((a, b) => new Date(b.issued) - new Date(a.issued));
            sum1.value = reduceArray(copyArrayOurRansom.value, "OurRansom");
            allSum.value = sum1.value;
        }
    } else if (selectedTypeOfTransaction.value === "Баланс наличные") {
        if (selectedPVZ.value === "Все ПВЗ") {
            copyArrayOurRansom.value = ourRansomRows.value
                ?.filter(
                    (row) =>
                        row.issued !== null &&
                        (!startingDate.value || new Date(row.issued) >= new Date(startingDate.value)) &&
                        (!endDate.value || new Date(row.issued) <= new Date(endDate.value)) &&
                        row.additionally === "Оплата наличными"
                )
                .sort((a, b) => new Date(b.issued) - new Date(a.issued));

            copyArrayClientRansom.value = clientRansomRows.value
                ?.filter(
                    (row) =>
                        row.issued !== null &&
                        (!startingDate.value || new Date(row.issued) >= new Date(startingDate.value)) &&
                        (!endDate.value || new Date(row.issued) <= new Date(endDate.value)) &&
                        row.additionally === "Оплата наличными"
                ).sort((a, b) => new Date(b.issued) - new Date(a.issued));

            sum1.value = reduceArray(copyArrayOurRansom.value, "OurRansom");
            sum2.value = reduceArray(copyArrayClientRansom.value, "ClientRansom");
            allSum.value = sum1.value + sum2.value
        } else {
            copyArrayOurRansom.value = ourRansomRows.value
                ?.filter(
                    (row) =>
                        row.issued !== null &&
                        (!startingDate.value || new Date(row.issued) >= new Date(startingDate.value)) &&
                        (!endDate.value || new Date(row.issued) <= new Date(endDate.value)) &&
                        row.additionally === "Оплата наличными" &&
                        row.dispatchPVZ === selectedPVZ.value
                )
                .sort((a, b) => new Date(b.issued) - new Date(a.issued));

            copyArrayClientRansom.value = clientRansomRows.value
                ?.filter(
                    (row) =>
                        row.issued !== null &&
                        (!startingDate.value || new Date(row.issued) >= new Date(startingDate.value)) &&
                        (!endDate.value || new Date(row.issued) <= new Date(endDate.value)) &&
                        row.additionally === "Оплата наличными" &&
                        row.dispatchPVZ === selectedPVZ.value
                ).sort((a, b) => new Date(b.issued) - new Date(a.issued));

            sum1.value = reduceArray(copyArrayOurRansom.value, "OurRansom");
            sum2.value = reduceArray(copyArrayClientRansom.value, "ClientRansom");
            allSum.value = sum1.value + sum2.value
        }
    } else if (selectedTypeOfTransaction.value === "Баланс безнал") {
        if (selectedPVZ.value === "Все ПВЗ") {
            copyArrayOurRansom.value = ourRansomRows.value
                ?.filter(
                    (row) =>
                        row.issued !== null &&
                        (!startingDate.value || new Date(row.issued) >= new Date(startingDate.value)) &&
                        (!endDate.value || new Date(row.issued) <= new Date(endDate.value)) &&
                        row.additionally === "Оплачено онлайн"
                )
                .sort((a, b) => new Date(b.issued) - new Date(a.issued));

            copyArrayClientRansom.value = clientRansomRows.value
                ?.filter(
                    (row) =>
                        row.issued !== null &&
                        (!startingDate.value || new Date(row.issued) >= new Date(startingDate.value)) &&
                        (!endDate.value || new Date(row.issued) <= new Date(endDate.value)) &&
                        row.additionally === "Оплачено онлайн"
                ).sort((a, b) => new Date(b.issued) - new Date(a.issued));

            sum1.value = reduceArray(copyArrayOurRansom.value, "OurRansom");
            sum2.value = reduceArray(copyArrayClientRansom.value, "ClientRansom");
            allSum.value = sum1.value + sum2.value + sum3.value
        } else {
            copyArrayOurRansom.value = ourRansomRows.value
                ?.filter(
                    (row) =>
                        row.issued !== null &&
                        (!startingDate.value || new Date(row.issued) >= new Date(startingDate.value)) &&
                        (!endDate.value || new Date(row.issued) <= new Date(endDate.value)) &&
                        row.additionally === "Оплачено онлайн" &&
                        row.dispatchPVZ === selectedPVZ.value
                )
                .sort((a, b) => new Date(b.issued) - new Date(a.issued));

            copyArrayClientRansom.value = clientRansomRows.value
                ?.filter(
                    (row) =>
                        row.issued !== null &&
                        (!startingDate.value || new Date(row.issued) >= new Date(startingDate.value)) &&
                        (!endDate.value || new Date(row.issued) <= new Date(endDate.value)) &&
                        row.additionally === "Оплачено онлайн" &&
                        row.dispatchPVZ === selectedPVZ.value
                ).sort((a, b) => new Date(b.issued) - new Date(a.issued));

            sum1.value = reduceArray(copyArrayOurRansom.value, "OurRansom");
            sum2.value = reduceArray(copyArrayClientRansom.value, "ClientRansom");
            allSum.value = sum1.value + sum2.value
        }
    } else if (selectedTypeOfTransaction.value === "Сумма с клиента+предоплата всего") {
        if (selectedPVZ.value === "Все ПВЗ") {
            copyArrayOurRansom.value = ourRansomRows.value
                ?.filter(
                    (row) =>
                        row.issued !== null &&
                        (!startingDate.value || new Date(row.issued) >= new Date(startingDate.value)) &&
                        (!endDate.value || new Date(row.issued) <= new Date(endDate.value))
                )
                .sort((a, b) => new Date(b.issued) - new Date(a.issued));

            copyArrayClientRansom.value = clientRansomRows.value
                ?.filter(
                    (row) =>
                        row.issued !== null &&
                        (!startingDate.value || new Date(row.issued) >= new Date(startingDate.value)) &&
                        (!endDate.value || new Date(row.issued) <= new Date(endDate.value))
                ).sort((a, b) => new Date(b.issued) - new Date(a.issued));

            sum1.value = reduceArray(copyArrayOurRansom.value, "OurRansom");
            sum2.value = reduceArray(copyArrayClientRansom.value, "ClientRansom");
            allSum.value = sum1.value + sum2.value
        } else {
            copyArrayOurRansom.value = ourRansomRows.value
                ?.filter(
                    (row) =>
                        row.issued !== null &&
                        (!startingDate.value || new Date(row.issued) >= new Date(startingDate.value)) &&
                        (!endDate.value || new Date(row.issued) <= new Date(endDate.value)) &&
                        row.dispatchPVZ === selectedPVZ.value
                )
                .sort((a, b) => new Date(b.issued) - new Date(a.issued));

            copyArrayClientRansom.value = clientRansomRows.value
                ?.filter(
                    (row) =>
                        row.issued !== null &&
                        (!startingDate.value || new Date(row.issued) >= new Date(startingDate.value)) &&
                        (!endDate.value || new Date(row.issued) <= new Date(endDate.value)) &&
                        row.dispatchPVZ === selectedPVZ.value
                ).sort((a, b) => new Date(b.issued) - new Date(a.issued));

            sum1.value = reduceArray(copyArrayOurRansom.value, "OurRansom");
            sum2.value = reduceArray(copyArrayClientRansom.value, "ClientRansom");
            allSum.value = sum1.value + sum2.value
        }
    }
}

function formatNumber(number: number) {
    let numberString = number.toString();

    if (numberString.length <= 3) {
        return numberString;
    }

    let formattedString = "";
    let remainder = numberString.length % 3;

    if (remainder !== 0) {
        formattedString += numberString.slice(0, remainder) + " ";
    }

    for (let i = remainder; i < numberString.length; i += 3) {
        formattedString += numberString.slice(i, i + 3) + " ";
    }

    return formattedString.slice(0, -1);
}

watch([selectedPVZ, selectedTypeOfTransaction, startingDate, endDate], getAllSum);

function clearFields() {
    selectedPVZ.value = "Все ПВЗ"
    selectedTypeOfTransaction.value = "Баланс наличные"
    startingDate.value = ""
    endDate.value = ""
    getAllSum()
}

let rowData = ref({} as IBalance);
let isOpen = ref(false);

function openModal(row: IBalance) {
  isOpen.value = true;
  if (row.id) {
    rowData.value = JSON.parse(JSON.stringify(row));
    rowData.value.issued = rowData.value.issued
      ? storeUsers.getISODateTime(rowData.value.issued)
      : null;
    rowData.value.received = rowData.value.received
      ? storeUsers.getISODateTime(rowData.value.received)
      : null;
  } else {
    rowData.value = {} as IBalance;
  }
}

function closeModal() {
  isOpen.value = false;
  rowData.value = {} as IBalance;
}

</script>

<template>
    <Head>
        <Title>Баланс</Title>
    </Head>

    <div v-if="!isLoading">
        <div v-if="token && user.role === 'ADMIN'">
            <NuxtLayout name="admin">
                <div class="mt-10">
                    <div>
                        <div class="flex items-center gap-3 mt-14 max-xl:mt-0">
                            <h1 class="text-xl font-bold">Фильтры</h1>
                            <Icon @click="showFilters = !showFilters"
                                class="cursor-pointer duration-200 hover:text-secondary-color"
                                name="solar:filters-line-duotone" size="24" />
                        </div>

                        <div v-if="showFilters" class="border-2 border-gray-300 p-3 mt-3 border-dashed">
                            <div class="grid grid-cols-2 max-xl:grid-cols-2 max-md:grid-cols-1">
                                <div class="grid grid-cols-2 m-3 text-center border-b-2 py-2">
                                    <h1>Показать для ПВЗ:</h1>
                                    <select
                                        class="bg-transparent max-w-[150px] px-3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                                        v-model="selectedPVZ">
                                        <option value="Все ПВЗ" selected>Все ПВЗ</option>
                                        <option v-for="pvzValue in pvz?.filter((pvzData) => pvzData.name !== 'НаДом')"
                                            :value="pvzValue.name">
                                            {{ pvzValue.name }}
                                        </option>
                                    </select>
                                </div>
                                <div class="grid grid-cols-2 m-3 text-center border-b-2 py-2">
                                    <h1>Тип транзакции:</h1>
                                    <select
                                        class="bg-transparent max-w-[150px] px-3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                                        v-model="selectedTypeOfTransaction">
                                        <option v-if="user.role !== 'ADMINISTRATOR' && user.role !== 'PVZ'" value="Доход">
                                            Доход</option>
                                        <option v-if="user.role !== 'ADMINISTRATOR' && user.role !== 'PVZ'"
                                            value="Заказано">Заказано</option>
                                        <option value="Баланс наличные">Баланс наличные</option>
                                        <option v-if="user.role !== 'PVZ'" value="Баланс безнал">Баланс безнал</option>
                                    </select>
                                </div>
                                <div class="grid grid-cols-1">
                                    <div class="grid grid-cols-2 my-2">
                                        <h1>От Даты:</h1>
                                        <input
                                            class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                                            type="date" v-model="startingDate" />
                                    </div>
                                    <div class="grid grid-cols-2 my-2">
                                        <h1>До Даты:</h1>
                                        <input
                                            class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                                            type="date" v-model="endDate" />
                                    </div>
                                </div>
                            </div>
                            <div class="flex justify-end">
                                <UIActionButton @click="clearFields">Очистить фильтры</UIActionButton>
                            </div>
                        </div>

                        <div class="grid grid-cols-3 max-xl:grid-cols-1 max-sm:grid-cols-1">
                            <div class="text-center text-2xl mt-10" v-if="selectedTypeOfTransaction !== 'Заказано'">
                                <h1>Баланс "Наш Выкуп"</h1>
                                <h1 class="font-bold text-secondary-color text-4xl mt-3">
                                    {{ formatNumber(Math.ceil(sum1)) }} ₽
                                </h1>
                            </div>
                            <div class="text-center text-2xl mt-10">
                                <h1>Общий баланс</h1>
                                <h1 class="font-bold text-secondary-color text-4xl mt-3">
                                    {{ formatNumber(Math.ceil(allSum)) }} ₽
                                </h1>
                            </div>
                            <div class="text-center text-2xl mt-10" v-if="selectedTypeOfTransaction !== 'Заказано'">
                                <h1>Баланс "Выкуп Клиента"</h1>
                                <h1 class="font-bold text-secondary-color text-4xl mt-3">
                                    {{ formatNumber(Math.ceil(sum2)) }} ₽
                                </h1>
                            </div>
                        </div>
                    </div>
                    <UIMainButton class="mt-10" @click="openModal">Заявка на вывод средств</UIMainButton>

                    <UIModal v-show="isOpen" @close-modal="closeModal">
                        <template v-slot:header>
                          <div class="custom-header" v-if="rowData.id">
                            Изменение строки с ID - <b> {{ rowData.id }}</b>
                          </div>
                          <div class="custom-header" v-else>Создание новой строки</div>
                        </template>
                        <div class="text-black">
            
                          <div class="grid grid-cols-2 mb-5" v-if="user.name3 === 'READ' || user.name3 === 'WRITE'">
                            <label for="name">Имя</label>
                            <div>
                              <input
                                class="bg-transparent w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                                v-model="rowData.name" type="text" @input="getFromNameFromName" />
                              <div class="flex gap-3 items-center justify-center mt-1">
                                <h1>АВТО</h1>
                                <input type="checkbox" v-model="isAutoName" />
                              </div>
                            </div>
                          </div>
            
                          <div class="grid grid-cols-2 mb-5" v-if="user.fromName3 === 'READ' || user.fromName3 === 'WRITE'">
                            <label for="fromName">Телефон <sup>*</sup> </label>
                            <div>
                              <input :disabled="user.fromName3 === 'READ'"
                                class="bg-transparent w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                                v-model="rowData.fromName" type="text" @input="getNameFromName" />
                              <div class="flex gap-3 items-center justify-center mt-1">
                                <h1>АВТО</h1>
                                <input type="checkbox" v-model="isAutoFromName" />
                              </div>
                            </div>
                          </div>
            
                          <div class="grid grid-cols-2 mb-5"
                            v-if="user.purchaseOfGoods === 'READ' || user.purchaseOfGoods === 'WRITE'">
                            <label for="purchaseOfGoods">Стоимость товаров <br> сортировки</label>
                            <input :disabled="user.purchaseOfGoods === 'READ'"
                              class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                              v-model="rowData.purchaseOfGoods" type="text" />
                          </div>
            
                          <div class="grid grid-cols-2 mb-5" v-if="user.percentClient3 === 'READ' || user.percentClient3 === 'WRITE'">
                            <label for="percentClient1">Процент с клиента</label>
                            <input :disabled="user.percentClient3 === 'READ'"
                              class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                              v-model="rowData.percentClient" placeholder="По умолчанию: 2" type="number" />
                          </div>
            
                          <div class="grid grid-cols-2 mb-5"
                            v-if="user.purchaseOfGoods === 'READ' || user.purchaseOfGoods === 'WRITE'">
                            <label for="purchaseOfGoods">Стоимость товаров <br> доставки</label>
                            <input :disabled="user.purchaseOfGoods === 'READ'"
                              class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                              v-model="rowData.purchaseOfGoods2" type="text" />
                          </div>
            
                          <div class="grid grid-cols-2 mb-5" v-if="user.percentClient3 === 'READ' || user.percentClient3 === 'WRITE'">
                            <label for="percentClient1">Процент с клиента</label>
                            <input :disabled="user.percentClient3 === 'READ'"
                              class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                              v-model="rowData.percentClient2" placeholder="По умолчанию: 2" type="number" />
                          </div>
            
                          <div class="grid grid-cols-2 mb-5" v-if="user.dispatchPVZ3 === 'READ' || user.dispatchPVZ3 === 'WRITE'">
                            <label for="dispatchPVZ1">Отправка в ПВЗ</label>
                            <select class="py-1 px-2 border-2 bg-transparent rounded-lg text-base disabled:text-gray-400"
                              v-model="rowData.dispatchPVZ" :disabled="user.dispatchPVZ3 === 'READ'">
                              <option v-for="pvzData in pvz" :value="pvzData.name">
                                {{ pvzData.name }}
                              </option>
                            </select>
                          </div>
            
                          <div class="grid grid-cols-2 mb-5" v-if="user.orderPVZ3 === 'READ' || user.orderPVZ3 === 'WRITE'">
                            <label for="orderPVZ1">Заказано на СЦ</label>
                            <select class="py-1 px-2 border-2 bg-transparent rounded-lg text-base disabled:text-gray-400"
                              v-model="rowData.orderPVZ" :disabled="user.orderPVZ3 === 'READ'">
                              <option v-for="sortingCenter in sortingCenters" :value="sortingCenter.name">
                                {{ sortingCenter.name }}
                              </option>
                            </select>
                          </div>
            
                          <div class="grid grid-cols-2 mb-5" v-if="user.sorted === 'READ' || user.sorted === 'WRITE'">
                            <label for="deliveredSC1">Отсортировано</label>
                            <input :disabled="user.sorted === 'READ'"
                              class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                              v-model="rowData.sorted" type="datetime-local" />
                          </div>
            
                          <div class="grid grid-cols-2 mb-5" v-if="user.paid === 'READ' || user.paid === 'WRITE'">
                            <label for="deliveredPVZ1">Оплачено</label>
                            <input :disabled="user.paid === 'READ'"
                              class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                              v-model="rowData.paid" type="datetime-local" />
                          </div>
            
                          <div class="grid grid-cols-2 mb-5" v-if="user.additionally3 === 'READ' || user.additionally3 === 'WRITE'">
                            <label for="additionally1">Дополнительно</label>
                            <select class="py-1 px-2 border-2 bg-transparent rounded-lg text-base disabled:text-gray-400"
                              v-model="rowData.additionally" :disabled="user.additionally3 === 'READ'">
                              <option value="">Отменить</option>
                              <option value="Оплачено онлайн">Оплачено онлайн</option>
                              <option value="Отказ клиент">Отказ клиент</option>
                              <option value="Отказ брак">Отказ брак</option>
                            </select>
                          </div>
                        </div>
            
                        <div class="flex items-center justify-center gap-3 mt-10" v-if="rowData.id">
                          <UIMainButton @click="updateRow">Сохранить
                          </UIMainButton>
                          <UIErrorButton @click="closeModal">Отменить </UIErrorButton>
                        </div>
                        <div class="flex items-center justify-center gap-3 mt-10" v-else>
                          <UIMainButton :disabled="rowData.fromName === '' || rowData.fromName === null" @click="createRow">Создать
                          </UIMainButton>
                          <UIErrorButton @click="closeModal">Отменить </UIErrorButton>
                        </div>
                      </UIModal>
                </div>
            </NuxtLayout>
        </div>

        <div v-else>
            <NuxtLayout name="user">
                <div class="mt-10">
                    <div>
                        <div class="flex items-center gap-3 mt-14 max-xl:mt-0">
                            <h1 class="text-xl font-bold">Фильтры</h1>
                            <Icon @click="showFilters = !showFilters"
                                class="cursor-pointer duration-200 hover:text-secondary-color"
                                name="solar:filters-line-duotone" size="24" />
                        </div>

                        <div v-if="showFilters" class="border-2 border-gray-300 p-3 mt-3 border-dashed">
                            <div class="grid grid-cols-2 max-xl:grid-cols-2 max-md:grid-cols-1">
                                <div class="grid grid-cols-2 m-3 text-center border-b-2 py-2">
                                    <h1>Показать для ПВЗ:</h1>
                                    <select
                                        class="bg-transparent max-w-[150px] px-3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                                        v-model="selectedPVZ">
                                        <option v-if="user.role !== 'PVZ'" value="Все ПВЗ" selected>Все ПВЗ</option>
                                        <option v-if="user.role !== 'PVZ'"
                                            v-for="pvzValue in pvz?.filter((pvzData) => pvzData.name !== 'НаДом')"
                                            :value="pvzValue.name">
                                            {{ pvzValue.name }}
                                        </option>
                                        <option v-if="user.role === 'PVZ'" :value="user.visiblePVZ"> {{ user.visiblePVZ }}
                                        </option>
                                    </select>
                                </div>
                                <div class="grid grid-cols-2 m-3 text-center border-b-2 py-2">
                                    <h1>Тип транзакции:</h1>
                                    <select
                                        class="bg-transparent max-w-[150px] px-3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                                        v-model="selectedTypeOfTransaction">
                                        <option v-if="user.role !== 'ADMINISTRATOR' && user.role !== 'PVZ'" value="Доход">
                                            Доход</option>
                                        <option v-if="user.role !== 'ADMINISTRATOR' && user.role !== 'PVZ'"
                                            value="Заказано">Заказано</option>
                                        <option value="Баланс наличные">Баланс наличные</option>
                                        <option v-if="user.role !== 'PVZ'" value="Баланс безнал">Баланс безнал</option>
                                    </select>
                                </div>
                                <div class="grid grid-cols-1">
                                    <div class="grid grid-cols-2 my-2">
                                        <h1>От Даты:</h1>
                                        <input
                                            class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                                            type="date" v-model="startingDate" />
                                    </div>
                                    <div class="grid grid-cols-2 my-2">
                                        <h1>До Даты:</h1>
                                        <input
                                            class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                                            type="date" v-model="endDate" />
                                    </div>
                                </div>
                            </div>
                            <div class="flex justify-end">
                                <UIActionButton @click="clearFields">Очистить фильтры</UIActionButton>
                            </div>
                        </div>

                        <div class="grid grid-cols-3 max-xl:grid-cols-1 max-sm:grid-cols-1">
                            <div class="text-center text-2xl mt-10" v-if="selectedTypeOfTransaction !== 'Заказано'">
                                <h1>Баланс "Наш Выкуп"</h1>
                                <h1 class="font-bold text-secondary-color text-4xl mt-3">
                                    {{ formatNumber(Math.ceil(sum1)) }} ₽
                                </h1>
                            </div>
                            <div class="text-center text-2xl mt-10">
                                <h1>Общий баланс</h1>
                                <h1 class="font-bold text-secondary-color text-4xl mt-3">
                                    {{ formatNumber(Math.ceil(allSum)) }} ₽
                                </h1>
                            </div>
                            <div class="text-center text-2xl mt-10" v-if="selectedTypeOfTransaction !== 'Заказано'">
                                <h1>Баланс "Выкуп Клиента"</h1>
                                <h1 class="font-bold text-secondary-color text-4xl mt-3">
                                    {{ formatNumber(Math.ceil(sum2)) }} ₽
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </NuxtLayout>
        </div>
    </div>

    <div v-else class="flex items-center justify-center">
        <UISpinner />
    </div>
</template>
