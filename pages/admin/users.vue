<script setup lang="ts">
import Cookies from "js-cookie";
const storeUsers = useUsersStore();
const router = useRouter();

const isOpen = ref(false);

const fields = [
  "имя пользователя",
  "роль",
  "дата создания",
  "ячейка (наш выкуп)",
  "ячейка (выкуп клиента)",
  "дополнительно (наш выкуп)",
  "дополнительно (выкуп клиента)",
  "доставлено на СЦ (наш выкуп)",
  "доставлено на СЦ (выкуп клиента)",
  "доставлено на ПВЗ (наш выкуп)",
  "доставлено на ПВЗ (выкуп клиента)",
  "доставлено КГТ (наш выкуп)",
  "доставлено КГТ (выкуп клиента)",
  "отправка в ПВЗ (наш выкуп)",
  "отправка в ПВЗ (выкуп клиента)",
  "имя (наш выкуп)",
  "имя (выкуп клиента)",
  "телефон (наш выкуп)",
  "телефон (выкуп клиента)",
  "выдан клиенту (наш выкуп)",
  "выдан клиенту (выкуп клиента)",
  "аккаунт заказа",
  "заказано на сортировочный центр (наш выкуп)",
  "заказано на сортировочный центр (выкуп клиента)",
  "процент с клиента (наш выкуп)",
  "процент с клиента (выкуп клиента)",
  "примечание (наш выкуп)",
  "примечание (выкуп клиента)",
  "стоимость выкупа товара",
  "стоимость сайт",
  "предоплата (наш выкуп)",
  "предоплата (выкуп клиента)",
  "товар (ссылка) (наш выкуп)",
  "товар (ссылка) (выкуп клиента)",
  "название товара (наш выкуп)",
  "название товара (выкуп клиента)",
  "данные (Наш выкуп)",
  "данные (Выкуп клиента)",
  "сумма с клиента (Наш выкуп)",
  "сумма с клиента (Выкуп клиента)",
  "ссылка для клиента (Наш выкуп)",
  "ссылка для клиента (Выкуп клиента)",
  "прибыль (доход) (Наш выкуп)",
  "прибыль (доход) (Выкуп клиента)",
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
            <div class="custom-header">
              Изменение пользователя - <b> {{ userData.username }}</b>
            </div>
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
              <label for="cell"
                >Ячейка <br />
                (Наш выкуп)</label
              >
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.cell1"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell"
                >Ячейка <br />
                (Выкуп клиента)</label
              >
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.cell2"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Дополнительно <br> (Наш выкуп)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.additionally1"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Дополнительно <br> (Выкуп клиента)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.additionally2"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Доставлено на СЦ <br> (Наш выкуп)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.deliveredSC1"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Доставлено на СЦ <br> (Выкуп клиента)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.deliveredSC2"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Доставлено на ПВЗ <br> (Наш выкуп)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.deliveredPVZ1"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Доставлено на ПВЗ <br> (Выкуп клиента)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.deliveredPVZ2"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Доставлено КГТ <br> (Наш выкуп)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.deliveredKGT1"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Доставлено КГТ <br> (Выкуп клиента)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.deliveredKGT2"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Отправка в ПВЗ <br> (Наш выкуп)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.dispatchPVZ1"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Отправка в ПВЗ <br> (Выкуп клиента)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.dispatchPVZ2"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Имя <br> (Наш выкуп)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.name1"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Имя <br> (Выкуп клиента)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.name2"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Телефон <br> (Наш выкуп)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.fromName1"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Телефон <br> (Выкуп клиента)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.fromName2"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Выдан клиенту <br> (Наш выкуп)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.issued1"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Выдан клиенту <br> (Выкуп клиента)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.issued2"
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
              <label for="cell">Заказано на СЦ <br> (Наш выкуп)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.orderPVZ1"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Заказано на СЦ <br> (Выкуп клиента)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.orderPVZ2"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Процент с клиента <br> (Наш выкуп)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.percentClient1"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Процент с клиента <br> (Выкуп клиента)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.percentClient2"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Примечание <br> (Наш выкуп)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.notation1"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Примечание <br> (Выкуп клиента)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.notation2"
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
              <label for="cell">Предоплата <br> (Наш выкуп)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.prepayment1"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Предоплата <br> (Выкуп клиента)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.prepayment2"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Товар (ссылка) <br> (Наш выкуп)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.productLink1"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Товар (ссылка) <br> (Выкуп клиента)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.productLink2"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Название товара <br> (Наш выкуп)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.productName1"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell">Название товара <br> (Выкуп клиента)</label>
              <select
                class="py-1 px-2 border-2 bg-transparent rounded-lg text-base"
                v-model="userData.productName2"
              >
                <option value="NONE">NONE</option>
                <option value="READ">READ</option>
                <option value="WRITE">WRITE</option>
              </select>
            </div>

            <div class="grid grid-cols-2 mb-5">
              <label for="cell"
                >Данные <br />
                (Наш Выкуп)</label
              >
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
              <label for="cell"
                >Данные <br />
                (Выкуп Клиента)</label
              >
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
              <label for="cell">Сумма с клиента <br> (Наш выкуп)</label>
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
              <label for="cell">Сумма с клиента <br> (Выкуп клиента)</label>
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
              <label for="cell">Ссылка для клиента <br> (Наш выкуп)</label>
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
              <label for="cell">Ссылка для клиента <br> (Выкуп клиента)<br></label>
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
              <label for="cell">Прибыль (доход) <br> (Наш выкуп)</label>
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
              <label for="cell">Прибыль (доход) <br> (Выкуп клиента)</label>
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
