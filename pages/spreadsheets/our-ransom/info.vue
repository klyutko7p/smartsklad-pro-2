<script setup lang="ts">
import Cookies from "js-cookie";
const storeUsers = useUsersStore();
const storeRansom = useRansomStore();
const router = useRouter();

let user = ref({} as User);
let rowsOurRansom = ref<Array<IOurRansom>>();
const token = Cookies.get("token");
let isLoading = ref(false);

onBeforeMount(async () => {
  isLoading.value = true;
  user.value = await storeUsers.getUser();
  rowsOurRansom.value = await storeRansom.getRansomRows("OurRansom");
  isLoading.value = false;
});

onMounted(() => {
  if (!token) {
    router.push("/auth/login");
  }
});

function getCountOfItemsByPVZOurRansom(PVZ: string) {
  if (user.value.role !== "PVZ") {
    return rowsOurRansom.value?.filter((row) => row.dispatchPVZ === PVZ).length;
  } else if (user.value.role === "PVZ") {
    let today = new Date().toLocaleDateString("ru-RU", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      });
    return rowsOurRansom.value?.filter(
      (row) =>
        row.dispatchPVZ === PVZ &&
        row.deliveredSC !== null &&
        row.deliveredSC !== null &&
        (new Date(row.issued).toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }) === today ||
          row.issued === null) &&
        row.deliveredPVZ !== null
    ).length;
  }
}

definePageMeta({
  layout: false,
});

</script>

<template>
  <Head>
    <Title>Главная страница</Title>
  </Head>
  <div v-if="!isLoading">
    <div v-if="token && user.role === 'ADMIN'">
      <NuxtLayout name="admin">
        <div class="py-5">
          <div class="flex flex-col gap-5 mt-10">
            <div class="flex items-center gap-5">
              <h1 class="font-bold text-xl">Список доступных ПВЗ (Наш Выкуп):</h1>
              <UIMainButton
                v-if="(user.role === 'ADMIN' || user.role === 'ADMINISTRATOR') || user.role === 'SORTIROVKA'"
                @click="router.push('/spreadsheets/our-ransom')"
                >Все товары</UIMainButton
              >
            </div>
            <div
              @click="router.push(`/spreadsheets/our-ransom/${pvz}`)"
              v-for="pvz in user.PVZ"
              class="border-2 border-secondary-color p-10 font-medium hover:bg-secondary-color duration-300 rounded-2xl cursor-pointer"
            >
              <h1 class="text-xl">{{ pvz }}</h1>
              <h1>
                Товаров в работе:
                <span class="font-bold">{{ getCountOfItemsByPVZOurRansom(pvz) }}</span>
              </h1>
            </div>
          </div>
        </div>
      </NuxtLayout>
    </div>
    <div v-else>
      <NuxtLayout name="user">
        <div class="py-5">
          <div class="flex flex-col gap-5 mt-10">
            <div class="flex items-center gap-5">
              <h1 class="font-bold text-xl">Список доступных ПВЗ (Наш Выкуп):</h1>
              <UIMainButton
                v-if="(user.role === 'ADMIN' || user.role === 'ADMINISTRATOR') || user.role === 'SORTIROVKA'"
                @click="router.push('/spreadsheets/our-ransom')"
                >Все товары</UIMainButton
              >
            </div>
            <div
              @click="router.push(`/spreadsheets/our-ransom/${pvz}`)"
              v-for="pvz in user.PVZ"
              class="border-2 border-secondary-color p-10 font-medium hover:bg-secondary-color duration-300 rounded-2xl cursor-pointer"
            >
              <h1 class="text-xl">{{ pvz }}</h1>
              <h1>
                Товаров в работе:
                <span class="font-bold">{{ getCountOfItemsByPVZOurRansom(pvz) }}</span>
              </h1>
            </div>
          </div>
        </div>
      </NuxtLayout>
    </div>
  </div>
  <div v-else>
    <UISpinner />
  </div>
</template>
