<script setup lang="ts">
import Cookies from "js-cookie";
const storeUsers = useUsersStore();
const router = useRouter();

const isOpen = ref(false);

const fields = [
  "имя пользователя",
  "роль",
  "дата создания",
  "ячейка",
  "дополнительно",
  "доставлено на СЦ",
  "доставлено на ПВЗ",
  "доставлено КГТ",
  "отправка в ПВЗ",
  "имя",
  "телефон",
  "выдан клиенту",
  "аккаунт заказа",
  "заказано на сортировочный центр",
  "процент с клиента",
  "примечание",
  "стоимость выкупа товара",
  "стоимость сайт",
  "товар (ссылка)",
  "название товара",
  "данные (Наш выкуп)",
  "данные (Выкуп клиента)",
  "сумма с клиента",
  "сумма с клиента",
  "ссылка для клиента",
  "ссылка для клиента",
  "прибыль (доход)",
  "прибыль (доход)",
  "изменение",
  "удаление",
];

let userData = ref({} as User);

function openModal(user: User) {
  isOpen.value = true;
  userData.value = JSON.parse(JSON.stringify(user));
}

function closeModal() {
  isOpen.value = false;
  userData.value = {} as User;
}

async function createUser(userData: User) {
  isLoading.value = true;
  await storeUsers.createUser(userData.username, userData.password, userData.role);
  users.value = await storeUsers.getUsers();
  isLoading.value = false;
}

async function updateUser() {
  isLoading.value = true;
  await storeUsers.updateUser(userData.value);
  users.value = await storeUsers.getUsers();
  closeModal();
  isLoading.value = false;
}

async function deleteUser(usernameData: string) {
  isLoading.value = true;
  let answer = confirm("Вы точно хотите удалить данного пользователя?");
  if (answer) await storeUsers.deleteUser(usernameData);
  users.value = await storeUsers.getUsers();
  isLoading.value = false;
}

let user = ref({} as User);
let users = ref<Array<User>>();
const token = Cookies.get("token");
let isLoading = ref(false);

onBeforeMount(async () => {
  isLoading.value = true;
  user.value = await storeUsers.getUser();
  users.value = await storeUsers.getUsers();
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
    <Title>Пользователи</Title>
  </Head>

  <div v-if="token && user.role === 'ADMIN'">
    <NuxtLayout name="admin">
      <div v-if="!isLoading">
        <AdminUsersTable
          :fields="fields"
          :users="users"
          @delete-user="deleteUser"
          @open-modal="openModal"
        />

        <AdminUsersCreate @create-user="createUser" />

        <UIModal v-show="isOpen" @close-modal="closeModal">
          <template v-slot:header>
            <div class="custom-header">Изменение пользователя - <b> {{ userData.username }}</b> </div>
          </template>
          <div class="text-black max-sm:text-sm">
            <div class="grid grid-cols-2 mb-5">
              <label for="name">Имя пользователя</label>
              <input
              class="bg-transparent rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-600 sm:text-sm sm:leading-6"
                v-model="userData.username"
                type="text"
              />
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="role">Роль</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.role"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="USER">USER</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Ячейка</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.cell"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Дополнительно</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.additionally"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Доставлено на СЦ</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.deliveredSC"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Доставлено на ПВЗ</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.deliveredPVZ"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Доставлено КГТ</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.deliveredKGT"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Отправка в ПВЗ</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.dispatchPVZ"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Имя</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.name"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>


            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Телефон</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.fromName"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Выдан клиенту</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.issued"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Выдан клиенту</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.issued"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Аккаунт заказа</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.orderAccount"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Заказано на СЦ</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.orderPVZ"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Процент с клиента</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.percentClient"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Примечание</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.notation"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Стоимость выкупа товара</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.priceProgram"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Стоимость сайт</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.priceSite"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Товар (ссылка)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.productLink"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Название товара</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.productName"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Данные <br> (Наш Выкуп)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.dataOurRansom"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Данные <br> (Выкуп Клиента)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.dataClientRansom"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Сумма с клиента</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.amountFromClient1"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Сумма с клиента</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.amountFromClient2"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Ссылка для клиента</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.clientLink1"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Ссылка для клиента</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.clientLink2"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Прибыль (доход)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.profit1"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Прибыль (доход)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.profit2"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>
          </div>

          <div class="flex items-center justify-center gap-3 mt-10">
            <UIMainButton @click="updateUser">Сохранить</UIMainButton>
            <UIErrorButton @click="closeModal">Отменить</UIErrorButton>
          </div>
        </UIModal>
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
