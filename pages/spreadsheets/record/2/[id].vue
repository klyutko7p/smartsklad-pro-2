<script setup lang="ts">
import Cookies from "js-cookie";
const storeUsers = useUsersStore();
const storeRansom = useRansomStore();
const router = useRouter();
const route = useRoute();
const id = +route.params.id;

let isLoading = ref(false);

let user = ref({} as User);
let row = ref({} as IClientRansom);

async function updateDeliveryRow(obj: any) {
  isLoading.value = true;
  let answer = confirm("Вы точно хотите изменить статус доставки?");
  if (answer) await storeRansom.updateDeliveryStatus(obj.row, obj.flag, "ClientRansom");
  row.value = await storeRansom.getRansomRow(id, "ClientRansom");
  isLoading.value = false;
}

onMounted(async () => {
  isLoading.value = true;
  user.value = await storeUsers.getUser();
  row.value = await storeRansom.getRansomRow(id, "ClientRansom");
  isLoading.value = false;
});

definePageMeta({
  layout: false,
});

onMounted(() => {
  if (!token) {
    router.push("/auth/login");
  }
});

const token = Cookies.get("token");
</script>

<template>
  <Head>
    <Title>Запись - {{ id }}</Title>
  </Head>
  <div>
    <div v-if="user.role === 'ADMIN'">
      <NuxtLayout name="admin">
        <div class="mt-5" v-if="!isLoading">
          <RecordBody :user="user" :row="row" @update-delivery-row="updateDeliveryRow" />
          <RecordQR class="mt-10" :row="row" :value="route.fullPath" />
        </div>
        <div v-else>
          <UISpinner />
        </div>
      </NuxtLayout>
    </div>
    <div v-else>
      <NuxtLayout name="user">
        <div class="mt-5" v-if="!isLoading">
          <RecordBody :user="user" :row="row" @update-delivery-row="updateDeliveryRow" />
          <RecordQR class="mt-10" :row="row" :value="route.fullPath" />
        </div>
        <div v-else>
          <UISpinner />
        </div>
      </NuxtLayout>
    </div>
  </div>
</template>
