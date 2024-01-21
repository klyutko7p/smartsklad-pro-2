<script setup lang="ts">
import Cookies from "js-cookie";
const storeUsers = useUsersStore();
const storeRansom = useRansomStore();
const route = useRoute();
const link = route.params.link;

let isLoading = ref(false);

let user = ref({} as User);
let rows = ref<Array<OurRansom>>();
let copyRows = ref<Array<OurRansom>>();
let name = ref<string>();

function getAmountToBePaid(flag: string) {
  let amountToPaid = 0;
  if (rows.value && flag === "NONE") {
    amountToPaid = rows.value
      .filter((value) => !value.issued)
      .reduce((acc, value) => acc + value.amountFromClient1, 0);
  } else if (rows.value && flag === "PVZ") {
    amountToPaid = rows.value
      .filter((value) => value.deliveredPVZ && !value.issued)
      .reduce((acc, value) => acc + value.amountFromClient1, 0);
  }
  return amountToPaid;
}
let showReceivedItems = ref(true);

function disableReceivedItems() {
  showReceivedItems.value = false;
  copyRows.value = rows.value?.filter((value) => !value.issued);
}

function enableReceivedItems() {
  showReceivedItems.value = true;
  copyRows.value = rows.value;
}

onMounted(async () => {
  isLoading.value = true;
  user.value = await storeUsers.getUser();
  rows.value = await storeRansom.getRansomRowsByLink(link);
  if (rows.value) {
    copyRows.value = [...rows.value];
    name.value = rows.value.find((value) => value.name)?.name;
  }
  isLoading.value = false;
});

const token = Cookies.get("token");
</script>

<template>
  <Head>
    <Title>Заказ - {{ route.params.link }}</Title>
  </Head>
  <div v-if="!isLoading">
    <div class="mt-5">
      <div class="max-lg:p-3">
        <h1 class="text-2xl overflow-auto">
          Информация о заказе: <span class="uppercase">{{ route.params.link }}</span>
        </h1>
        <h1 class="text-xl mt-5">Заказ на имя – {{ name ? name : "Пусто" }}</h1>
        <h1 class="text-xl">
          Оставшаяся сумма к оплате: {{ getAmountToBePaid("NONE") }} руб.
        </h1>
        <h1 class="text-xl">
          Сумма к оплате на выдачу: {{ getAmountToBePaid("PVZ") }} руб.
        </h1>
        <UIMainButton v-if="showReceivedItems" class="mt-5" @click="disableReceivedItems"
          >Скрыть полученные товары</UIMainButton
        >
        <UIMainButton v-if="!showReceivedItems" class="mt-5" @click="enableReceivedItems"
          >Показать полученные товары</UIMainButton
        >
      </div>
      <SpreadsheetsOrderTable :rows="copyRows" :user="user" />
    </div>
  </div>
  <div v-else>
    <UISpinner />
  </div>
</template>
