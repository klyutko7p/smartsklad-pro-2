<script setup lang="ts">
import Cookies from "js-cookie";
const storeUsers = useUsersStore();
const router = useRouter();

let user = ref({} as User);

onBeforeMount(async () => {
  user.value = await storeUsers.getUser();
  if (!token) {
    router.push('/auth/login')
    console.log("21312");
  } 
});

const token = Cookies.get("token");

definePageMeta({
  layout: "user",
});
</script>

<template>
  <Head>
    <Title>Главная страница</Title>
  </Head>
  <div v-if="token">
    <div class="py-5">
      <h1 class="text-xl">Приветствуем, {{ user.username }}!</h1>
      <div class="mt-3">
        <div class="flex items-center gap-3 mb-3">
          <div
            class="border-2 border-green-500 w-10 rounded-2xl border-dashed h-10"
          ></div>
          <h1>– Редактирование</h1>
        </div>
        <div class="flex items-center gap-3 mb-3">
          <div
            class="border-2 border-yellow-300 w-10 rounded-2xl border-dashed h-10"
          ></div>
          <h1>– Чтение</h1>
        </div>
        <div class="flex items-center gap-3">
          <div
            class="border-2 border-red-500 w-10 rounded-2xl border-dashed h-10"
          ></div>
          <h1>– Нет прав</h1>
        </div>

        <h1 class="text-2xl mb-3 mt-5">Ваши права на доступ:</h1>

        <div class="mt-6 grid grid-cols-3 gap-10">
          <div
            :class="{
              'border-red-500': user.cell === 'NONE',
              'border-yellow-300': user.cell === 'READ',
              'border-green-500': user.cell === 'WRITE',
            }"
            class="border-2 p-10 rounded-2xl border-dashed"
          >
            <h1 class="font-bold uppercase">Ячейка</h1>
          </div>

          <div
            :class="{
              'border-red-500': user.additionally === 'NONE',
              'border-yellow-300': user.additionally === 'READ',
              'border-green-500': user.additionally === 'WRITE',
            }"
            class="border-2 p-10 rounded-2xl border-dashed"
          >
            <h1 class="font-bold uppercase">Дополнительно</h1>
          </div>

          <div
            :class="{
              'border-red-500': user.deliveredSC === 'NONE',
              'border-yellow-300': user.deliveredSC === 'READ',
              'border-green-500': user.deliveredSC === 'WRITE',
            }"
            class="border-2 p-10 rounded-2xl border-dashed"
          >
            <h1 class="font-bold uppercase">Доставлено на СЦ</h1>
          </div>

          <div
            :class="{
              'border-red-500': user.deliveredPVZ === 'NONE',
              'border-yellow-300': user.deliveredPVZ === 'READ',
              'border-green-500': user.deliveredPVZ === 'WRITE',
            }"
            class="border-2 p-10 rounded-2xl border-dashed"
          >
            <h1 class="font-bold uppercase">Доставлено на ПВЗ</h1>
          </div>

          <div
            :class="{
              'border-red-500': user.deliveredKGT === 'NONE',
              'border-yellow-300': user.deliveredKGT === 'READ',
              'border-green-500': user.deliveredKGT === 'WRITE',
            }"
            class="border-2 p-10 rounded-2xl border-dashed"
          >
            <h1 class="font-bold uppercase">Доставлено КГТ</h1>
          </div>

          <div
            :class="{
              'border-red-500': user.dispatchPVZ === 'NONE',
              'border-yellow-300': user.dispatchPVZ === 'READ',
              'border-green-500': user.dispatchPVZ === 'WRITE',
            }"
            class="border-2 p-10 rounded-2xl border-dashed"
          >
            <h1 class="font-bold uppercase">отправка в ПВЗ</h1>
          </div>

          <div
            :class="{
              'border-red-500': user.fromName === 'NONE',
              'border-yellow-300': user.fromName === 'READ',
              'border-green-500': user.fromName === 'WRITE',
            }"
            class="border-2 p-10 rounded-2xl border-dashed"
          >
            <h1 class="font-bold uppercase">телефон</h1>
          </div>

          <div
            :class="{
              'border-red-500': user.issued === 'NONE',
              'border-yellow-300': user.issued === 'READ',
              'border-green-500': user.issued === 'WRITE',
            }"
            class="border-2 p-10 rounded-2xl border-dashed"
          >
            <h1 class="font-bold uppercase">выдан клиенту</h1>
          </div>

          <div
            :class="{
              'border-red-500': user.orderAccount === 'NONE',
              'border-yellow-300': user.orderAccount === 'READ',
              'border-green-500': user.orderAccount === 'WRITE',
            }"
            class="border-2 p-10 rounded-2xl border-dashed"
          >
            <h1 class="font-bold uppercase">аккаунт заказа</h1>
          </div>

          <div
            :class="{
              'border-red-500': user.orderPVZ === 'NONE',
              'border-yellow-300': user.orderPVZ === 'READ',
              'border-green-500': user.orderPVZ === 'WRITE',
            }"
            class="border-2 p-10 rounded-2xl border-dashed"
          >
            <h1 class="font-bold uppercase">заказано на сортировочном центре</h1>
          </div>

          <div
            :class="{
              'border-red-500': user.percentClient === 'NONE',
              'border-yellow-300': user.percentClient === 'READ',
              'border-green-500': user.percentClient === 'WRITE',
            }"
            class="border-2 p-10 rounded-2xl border-dashed"
          >
            <h1 class="font-bold uppercase">процент с клиента</h1>
          </div>

          <div
            :class="{
              'border-red-500': user.notation === 'NONE',
              'border-yellow-300': user.notation === 'READ',
              'border-green-500': user.notation === 'WRITE',
            }"
            class="border-2 p-10 rounded-2xl border-dashed"
          >
            <h1 class="font-bold uppercase">примечание</h1>
          </div>

          <div
            :class="{
              'border-red-500': user.priceProgram === 'NONE',
              'border-yellow-300': user.priceProgram === 'READ',
              'border-green-500': user.priceProgram === 'WRITE',
            }"
            class="border-2 p-10 rounded-2xl border-dashed"
          >
            <h1 class="font-bold uppercase">стоимость выкупа товара</h1>
          </div>

          <div
            :class="{
              'border-red-500': user.priceSite === 'NONE',
              'border-yellow-300': user.priceSite === 'READ',
              'border-green-500': user.priceSite === 'WRITE',
            }"
            class="border-2 p-10 rounded-2xl border-dashed"
          >
            <h1 class="font-bold uppercase">стоимость сайт</h1>
          </div>

          <div
            :class="{
              'border-red-500': user.productLink === 'NONE',
              'border-yellow-300': user.productLink === 'READ',
              'border-green-500': user.productLink === 'WRITE',
            }"
            class="border-2 p-10 rounded-2xl border-dashed"
          >
            <h1 class="font-bold uppercase">товар (ссылка)</h1>
          </div>

          <div
            :class="{
              'border-red-500': user.productName === 'NONE',
              'border-yellow-300': user.productName === 'READ',
              'border-green-500': user.productName === 'WRITE',
            }"
            class="border-2 p-10 rounded-2xl border-dashed"
          >
            <h1 class="font-bold uppercase">название товара</h1>
          </div>

          <div
            :class="{
              'border-red-500': user.dataOurRansom === 'NONE',
              'border-yellow-300': user.dataOurRansom === 'READ',
              'border-green-500': user.dataOurRansom === 'WRITE',
            }"
            class="border-2 p-10 rounded-2xl border-dashed"
          >
            <h1 class="font-bold uppercase">ДАННЫЕ (НАШ ВЫКУП)</h1>
          </div>

          <div
            :class="{
              'border-red-500': user.dataClientRansom === 'NONE',
              'border-yellow-300': user.dataClientRansom === 'READ',
              'border-green-500': user.dataClientRansom === 'WRITE',
            }"
            class="border-2 p-10 rounded-2xl border-dashed"
          >
            <h1 class="font-bold uppercase">дАННЫЕ (ВЫКУП КЛИЕНТА)</h1>
          </div>

          <div
            :class="{
              'border-red-500': user.amountFromClient1 === 'NONE',
              'border-yellow-300': user.amountFromClient1 === 'READ',
              'border-green-500': user.amountFromClient1 === 'WRITE',
            }"
            class="border-2 p-10 rounded-2xl border-dashed"
          >
            <h1 class="font-bold uppercase">сумма с клиента</h1>
          </div>

          <div
            :class="{
              'border-red-500': user.amountFromClient2 === 'NONE',
              'border-yellow-300': user.amountFromClient2 === 'READ',
              'border-green-500': user.amountFromClient2 === 'WRITE',
            }"
            class="border-2 p-10 rounded-2xl border-dashed"
          >
            <h1 class="font-bold uppercase">сумма с клиента</h1>
          </div>

          <div
            :class="{
              'border-red-500': user.clientLink1 === 'NONE',
              'border-yellow-300': user.clientLink1 === 'READ',
              'border-green-500': user.clientLink1 === 'WRITE',
            }"
            class="border-2 p-10 rounded-2xl border-dashed"
          >
            <h1 class="font-bold uppercase">ссылка для клиента</h1>
          </div>

          <div
            :class="{
              'border-red-500': user.clientLink2 === 'NONE',
              'border-yellow-300': user.clientLink2 === 'READ',
              'border-green-500': user.clientLink2 === 'WRITE',
            }"
            class="border-2 p-10 rounded-2xl border-dashed"
          >
            <h1 class="font-bold uppercase">ссылка для клиента</h1>
          </div>

          <div
            :class="{
              'border-red-500': user.profit1 === 'NONE',
              'border-yellow-300': user.profit1 === 'READ',
              'border-green-500': user.profit1 === 'WRITE',
            }"
            class="border-2 p-10 rounded-2xl border-dashed"
          >
            <h1 class="font-bold uppercase">прибыль (доход)</h1>
          </div>

          <div
            :class="{
              'border-red-500': user.profit2 === 'NONE',
              'border-yellow-300': user.profit2 === 'READ',
              'border-green-500': user.profit2 === 'WRITE',
            }"
            class="border-2 p-10 rounded-2xl border-dashed"
          >
            <h1 class="font-bold uppercase">прибыль (доход)</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
