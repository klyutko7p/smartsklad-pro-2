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

let showOurRansomRows = ref(false);
let showClientRansomRows = ref(false);

let copyArrayOurRansom = ref<Array<IOurRansom>>();
let copyArrayClientRansom = ref<Array<IClientRansom>>();
let copyArrayDelivery = ref<Array<IDelivery>>();

let sum1 = ref(0);
let sum2 = ref(0);
let sum3 = ref(0);
let allSum = ref(0);
let showFilters = ref(false);

let selectedPVZ = ref("Все ПВЗ");
let selectedTypeOfTransaction = ref("Доход");

const startingDate = ref<Date | string | null>(null);
const endDate = ref<Date | string | null>(null);
let typesOfTransactions = ref([
    "Доход",
    "Стоимость сайт",
    "Сумма с клиента+предоплата наличные",
    "Сумма с клиента+предоплата онлайн",
    "Сумма с клиента+предоплата всего",
]);

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
    } else if (selectedTypeOfTransaction.value === "Стоимость сайт") {
        if (flag === "OurRansom") {
            return array.reduce((ac: any, curValue: any) => ac + curValue.priceSite, 0);
        }
    } else if (selectedTypeOfTransaction.value === "Сумма с клиента+предоплата наличные") {
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
    } else if (selectedTypeOfTransaction.value === "Сумма с клиента+предоплата онлайн") {
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

            copyArrayDelivery.value = deliveryRansomRows.value
                ?.filter(
                    (row) =>
                        row.paid !== null &&
                        (!startingDate.value || new Date(row.paid) >= new Date(startingDate.value)) &&
                        (!endDate.value || new Date(row.paid) <= new Date(endDate.value))
                )
                .sort((a, b) => new Date(b.paid) - new Date(a.paid));

            sum1.value = reduceArray(copyArrayOurRansom.value, "OurRansom");
            sum2.value = reduceArray(copyArrayClientRansom.value, "ClientRansom");
            sum3.value = reduceArray(copyArrayDelivery.value, "Delivery");
            allSum.value = sum1.value + sum2.value + sum3.value;
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

            copyArrayDelivery.value = deliveryRansomRows.value
                ?.filter(
                    (row) =>
                        row.dispatchPVZ === selectedPVZ.value &&
                        row.paid !== null &&
                        (!startingDate.value || new Date(row.paid) >= new Date(startingDate.value)) &&
                        (!endDate.value || new Date(row.paid) <= new Date(endDate.value))
                )
                .sort((a, b) => new Date(b.paid) - new Date(a.paid));

            sum1.value = reduceArray(copyArrayOurRansom.value, "OurRansom");
            sum2.value = reduceArray(copyArrayClientRansom.value, "ClientRansom");
            sum3.value = reduceArray(copyArrayDelivery.value, "Delivery");
            allSum.value = sum1.value + sum2.value + sum3.value;
        }
    } else if (selectedTypeOfTransaction.value === "Стоимость сайт") {
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
    } else if (selectedTypeOfTransaction.value === "Сумма с клиента+предоплата наличные") {
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

            copyArrayDelivery.value = deliveryRansomRows.value
                ?.filter(
                    (row) =>
                        row.paid !== null &&
                        (!startingDate.value || new Date(row.paid) >= new Date(startingDate.value)) &&
                        (!endDate.value || new Date(row.paid) <= new Date(endDate.value)) &&
                        row.additionally === "Оплата наличными" &&
                        row.dispatchPVZ === selectedPVZ.value
                ).sort((a, b) => new Date(b.paid) - new Date(a.paid));

            sum1.value = reduceArray(copyArrayOurRansom.value, "OurRansom");
            sum2.value = reduceArray(copyArrayClientRansom.value, "ClientRansom");
            sum3.value = reduceArray(copyArrayDelivery.value, "Delivery");
            allSum.value = sum1.value + sum2.value + sum3.value
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

            copyArrayDelivery.value = deliveryRansomRows.value
                ?.filter(
                    (row) =>
                        row.paid !== null &&
                        (!startingDate.value || new Date(row.paid) >= new Date(startingDate.value)) &&
                        (!endDate.value || new Date(row.paid) <= new Date(endDate.value)) &&
                        row.additionally === "Оплата наличными" &&
                        row.dispatchPVZ === selectedPVZ.value
                ).sort((a, b) => new Date(b.paid) - new Date(a.paid));

            sum1.value = reduceArray(copyArrayOurRansom.value, "OurRansom");
            sum2.value = reduceArray(copyArrayClientRansom.value, "ClientRansom");
            sum3.value = reduceArray(copyArrayDelivery.value, "Delivery");
            allSum.value = sum1.value + sum2.value + sum3.value
        }
    } else if (selectedTypeOfTransaction.value === "Сумма с клиента+предоплата онлайн") {
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

            copyArrayDelivery.value = deliveryRansomRows.value
                ?.filter(
                    (row) =>
                        row.paid !== null &&
                        (!startingDate.value || new Date(row.paid) >= new Date(startingDate.value)) &&
                        (!endDate.value || new Date(row.paid) <= new Date(endDate.value)) &&
                        row.additionally === "Оплата онлайн"
                ).sort((a, b) => new Date(b.paid) - new Date(a.paid));

            sum1.value = reduceArray(copyArrayOurRansom.value, "OurRansom");
            sum2.value = reduceArray(copyArrayClientRansom.value, "ClientRansom");
            sum3.value = reduceArray(copyArrayDelivery.value, "Delivery");
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

            copyArrayDelivery.value = deliveryRansomRows.value
                ?.filter(
                    (row) =>
                        row.paid !== null &&
                        (!startingDate.value || new Date(row.paid) >= new Date(startingDate.value)) &&
                        (!endDate.value || new Date(row.paid) <= new Date(endDate.value)) &&
                        row.additionally === "Оплата онлайн" &&
                        row.dispatchPVZ === selectedPVZ.value
                ).sort((a, b) => new Date(b.paid) - new Date(a.paid));

            sum1.value = reduceArray(copyArrayOurRansom.value, "OurRansom");
            sum2.value = reduceArray(copyArrayClientRansom.value, "ClientRansom");
            sum3.value = reduceArray(copyArrayDelivery.value, "Delivery");
            allSum.value = sum1.value + sum2.value + sum3.value
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

            copyArrayDelivery.value = deliveryRansomRows.value
                ?.filter(
                    (row) =>
                        row.paid !== null &&
                        (!startingDate.value || new Date(row.paid) >= new Date(startingDate.value)) &&
                        (!endDate.value || new Date(row.paid) <= new Date(endDate.value))
                ).sort((a, b) => new Date(b.paid) - new Date(a.paid));

            sum1.value = reduceArray(copyArrayOurRansom.value, "OurRansom");
            sum2.value = reduceArray(copyArrayClientRansom.value, "ClientRansom");
            sum3.value = reduceArray(copyArrayDelivery.value, "Delivery");
            allSum.value = sum1.value + sum2.value + sum3.value
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

            copyArrayDelivery.value = deliveryRansomRows.value
                ?.filter(
                    (row) =>
                        row.paid !== null &&
                        (!startingDate.value || new Date(row.paid) >= new Date(startingDate.value)) &&
                        (!endDate.value || new Date(row.paid) <= new Date(endDate.value)) &&
                        row.dispatchPVZ === selectedPVZ.value
                ).sort((a, b) => new Date(b.paid) - new Date(a.paid));

            sum1.value = reduceArray(copyArrayOurRansom.value, "OurRansom");
            sum2.value = reduceArray(copyArrayClientRansom.value, "ClientRansom");
            sum3.value = reduceArray(copyArrayDelivery.value, "Delivery");
            allSum.value = sum1.value + sum2.value + sum3.value
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
        formattedString += numberString.slice(0, remainder) + ".";
    }

    for (let i = remainder; i < numberString.length; i += 3) {
        formattedString += numberString.slice(i, i + 3) + ".";
    }

    return formattedString.slice(0, -1);
}

watch([selectedPVZ, selectedTypeOfTransaction, startingDate, endDate], getAllSum);

function clearFields() {
    selectedPVZ.value = "Все ПВЗ"
    selectedTypeOfTransaction.value = "Доход"
    startingDate.value = ""
    endDate.value = ""
    getAllSum()
}
</script>

<template>
    <Head>
        <Title>Баланс</Title>
    </Head>

    <div v-if="token && user.role === 'ADMIN'">
        <NuxtLayout name="admin">
            <div v-if="!isLoading" class="mt-10">
                <div>
                    <div class="flex items-center gap-3 mt-14 max-xl:mt-0">
                        <h1 class="text-xl font-bold">Фильтры</h1>
                        <Icon @click="showFilters = !showFilters"
                            class="cursor-pointer duration-200 hover:text-secondary-color" name="solar:filters-line-duotone"
                            size="24" />
                    </div>

                    <div v-if="showFilters" class="border-2 border-gray-300 p-3 mt-3 border-dashed">
                        <div class="grid grid-cols-2 max-xl:grid-cols-2 max-md:grid-cols-1">
                            <div class="grid grid-cols-2 m-3 text-center border-b-2 py-2">
                                <h1>Показать для ПВЗ:</h1>
                                <select
                                    class="bg-transparent max-w-[150px] px-3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                                    v-model="selectedPVZ">
                                    <option value="Все ПВЗ" selected>Все ПВЗ</option>
                                    <option v-for="pvzValue in pvz" :value="pvzValue.name">
                                        {{ pvzValue.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="grid grid-cols-2 m-3 text-center border-b-2 py-2">
                                <h1>Тип транзакции:</h1>
                                <select
                                    class="bg-transparent max-w-[150px] px-3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                                    v-model="selectedTypeOfTransaction">
                                    <option v-for="type in typesOfTransactions" :value="type">
                                        {{ type }}
                                    </option>
                                </select>
                            </div>
                            <div class="grid grid-cols-1">
                                <div class="grid grid-cols-2 my-2">
                                    <h1>От Даты Выдачи:</h1>
                                    <input
                                        class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6 disabled:text-gray-400"
                                        type="date" v-model="startingDate" />
                                </div>
                                <div class="grid grid-cols-2 my-2">
                                    <h1>До Даты Выдачи:</h1>
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

                    <div class="grid grid-cols-4 max-xl:grid-cols-2 max-sm:grid-cols-1">
                        <div class="text-center text-2xl mt-10">
                            <h1>Общий баланс</h1>
                            <h1 class="font-bold text-secondary-color text-4xl mt-3">
                                {{ formatNumber(Math.ceil(allSum)) }} ₽
                            </h1>
                        </div>
                        <div class="text-center text-2xl mt-10" v-if="selectedTypeOfTransaction !== 'Стоимость сайт'">
                            <h1>Баланс "Наш Выкуп"</h1>
                            <h1 class="font-bold text-secondary-color text-4xl mt-3">
                                {{ formatNumber(Math.ceil(sum1)) }} ₽
                            </h1>
                        </div>
                        <div class="text-center text-2xl mt-10" v-if="selectedTypeOfTransaction !== 'Стоимость сайт'">
                            <h1>Баланс "Выкуп Клиента"</h1>
                            <h1 class="font-bold text-secondary-color text-4xl mt-3">
                                {{ formatNumber(Math.ceil(sum2)) }} ₽
                            </h1>
                        </div>
                        <div class="text-center text-2xl mt-10" v-if="selectedTypeOfTransaction !== 'Стоимость сайт'">
                            <h1>Баланс "Доставка"</h1>
                            <h1 class="font-bold text-secondary-color text-4xl mt-3">
                                {{ formatNumber(Math.ceil(sum3)) }} ₽
                            </h1>
                        </div>
                    </div>

                    <!-- <div class="mt-20">
                        <div class="flex items-center gap-3 mb-5">
                            <h1 class="font-bold text-2xl">Наш Выкуп</h1>
                            <Icon @click="showOurRansomRows = !showOurRansomRows" name="ci:show" size="32"
                                class="cursor-pointer hover:text-secondary-color duration-200" />
                        </div>
                        <div class="flex flex-col gap-10" v-if="showOurRansomRows">
                            <div v-for="row in copyArrayOurRansom"
                                class="flex items-center gap-5 border-b-2 border-black p-5">
                                <Icon name="material-symbols:add" size="28"
                                    class="text-black border-secondary-color border-2 rounded-full" />
                                <h1 class="font-bold text-2xl text-secondary-color">
                                    {{
                                        Math.ceil(row.amountFromClient1 / 10) * 10 -
                                        row.priceSite +
                                        row.deliveredKGT
                                    }}
                                    ₽
                                </h1>
                                <h1 class="text-xl">в {{ storeUsers.getNormalizedDate(row.issued) }}</h1>
                            </div>
                        </div>
                        <div class="flex items-center gap-3 mb-5">
                            <h1 class="font-bold text-2xl">Выкуп клиента</h1>
                            <Icon @click="showClientRansomRows = !showClientRansomRows" name="ci:show" size="32"
                                class="cursor-pointer hover:text-secondary-color duration-200" />
                        </div>
                        <div class="flex flex-col gap-10" v-if="showClientRansomRows">
                            <div v-for="row in copyArrayClientRansom"
                                class="flex items-center gap-3 border-b-2 border-black p-5">
                                <Icon name="material-symbols:add" size="28" class="text-secondary-color" />
                                <h1 class="font-bold text-2xl text-secondary-color">
                                    {{ Math.ceil(row.amountFromClient2 / 10) * 10 }} ₽
                                </h1>
                            </div>
                        </div>
                    </div> -->
                </div>
            </div>

            <div v-else>
                <UISpinner />
            </div>
        </NuxtLayout>
    </div>

    <div v-else-if="user.role === 'USER'">
        <NuxtLayout name="user">
            <h1>
                У вас недостаточно прав на просмотр этой информации. Обратитесь к администратору
            </h1>
        </NuxtLayout>
    </div>
</template>
