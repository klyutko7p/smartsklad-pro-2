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
          <h1 class="text-xl mt-10">Приветствуем, {{ user.username }}!</h1>
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
  </div>
  <div v-else>
    <UISpinner />
  </div>
</template>
