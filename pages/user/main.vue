<script setup lang="ts">
import Cookies from "js-cookie";
const storeUsers = useUsersStore();
const router = useRouter();

let user = ref({} as User);
const token = Cookies.get("token");
let isLoading = ref(false);

onBeforeMount(async () => {
  isLoading.value = true;
  user.value = await storeUsers.getUser();
  isLoading.value = false;
});

onMounted(() => {
  if (!token) {
    router.push("/auth/login");
  }
});

definePageMeta({
  layout: 'user',
});
</script>

<template>
  <Head>
    <Title>Главная страница</Title>
  </Head>
  <div v-if="token">
    <div class="py-5">
      <h1 class="text-xl mt-10">Приветствуем, {{ user.username }}!</h1>
      <div class="flex flex-col gap-5 mt-10">
        <h1 class="font-bold text-xl">Список доступных ПВЗ:</h1>
        <div @click="router.push(`/spreadsheets/our-ransom/${pvz}`)" v-for="pvz in user.PVZ"
          class="border-2 border-secondary-color p-10 font-medium hover:bg-secondary-color duration-300 rounded-2xl cursor-pointer">
          {{ pvz }}
        </div>
      </div>
    </div>
  </div>
</template>
