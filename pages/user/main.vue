<script setup lang="ts">
import Cookies from "js-cookie";
const storeUsers = useUsersStore();
const router = useRouter();

let user = ref({} as User);

onBeforeMount(async () => {
  user.value = await storeUsers.getUser();
  if (!token) {
    router.push("/auth/login");
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
    </div>
  </div>
</template>
