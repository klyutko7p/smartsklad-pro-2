<script lang="ts" setup>
import { useUsersStore } from "../stores/users";

const router = useRouter();
const storeUsers = useUsersStore();
let user = ref({} as User);
let isOpen = ref(false);

function signOut() {
  storeUsers.signOut();
}

function editMenu() {
  isOpen.value = !isOpen.value;
}

onBeforeMount(() => {
  user.value = storeUsers.getUser();
});
</script>
<template>
  <div
    class="relative h-screen flex flex-col bg-clip-border rounded-xl bg-white text-gray-700 w-full max-w-[16rem] p-4 shadow-xl shadow-blue-gray-900/5 max-xl:hidden"
    v-if="isOpen">
    <div class="p-4 flex justify-between items-center">
      <h1 class="font-bold text-xl text-secondary-color">DAROM.PRO</h1>
      <Icon @click="editMenu" name="ooui:arrow-previous-ltr" size="20"
        class="hover:text-orange-300 duration-200 cursor-pointer" />
    </div>
    <nav class="flex flex-col gap-1 min-w-[240px] p-2 font-sans text-base font-normal text-gray-700">
      <div role="button" @click="router.push('/admin/main')" tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-orange-50 hover:bg-opacity-80 focus:bg-orange-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-orange-900 focus:text-orange-900 active:text-orange-900 outline-none">
        <div class="grid place-items-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
            class="h-5 w-5">
            <path fill-rule="evenodd"
              d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.04 16.5l.5-1.5h6.42l.5 1.5H8.29zm7.46-12a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm-3 2.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9zm-3 2.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z"
              clip-rule="evenodd"></path>
          </svg>
        </div>
        <h1>Главная</h1>
      </div>
      <div role="button" @click="router.push('/spreadsheets/our-ransom')" tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-orange-50 hover:bg-opacity-80 focus:bg-orange-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-orange-900 focus:text-orange-900 active:text-orange-900 outline-none"
        v-if="user.dataOurRansom === 'READ' || user.dataOurRansom === 'WRITE'">
        <div class="grid place-items-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
            class="h-5 w-5">
            <path fill-rule="evenodd"
              d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z"
              clip-rule="evenodd"></path>
          </svg>
        </div>
        <h1>Наш Выкуп</h1>
      </div>
      <div role="button" tabindex="0" @click="router.push('/spreadsheets/client-ransom')"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-orange-50 hover:bg-opacity-80 focus:bg-orange-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-orange-900 focus:text-orange-900 active:text-orange-900 outline-none"
        v-if="user.dataClientRansom === 'READ' || user.dataClientRansom === 'WRITE'">
        <div class="grid place-items-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
            class="h-5 w-5">
            <path fill-rule="evenodd"
              d="M6.912 3a3 3 0 00-2.868 2.118l-2.411 7.838a3 3 0 00-.133.882V18a3 3 0 003 3h15a3 3 0 003-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0017.088 3H6.912zm13.823 9.75l-2.213-7.191A1.5 1.5 0 0017.088 4.5H6.912a1.5 1.5 0 00-1.434 1.059L3.265 12.75H6.11a3 3 0 012.684 1.658l.256.513a1.5 1.5 0 001.342.829h3.218a1.5 1.5 0 001.342-.83l.256-.512a3 3 0 012.684-1.658h2.844z"
              clip-rule="evenodd"></path>
          </svg>
        </div>
        <h1>Выкуп Клиента</h1>
      </div>
      <div v-if="user.dataDelivery === 'READ' || user.dataDelivery === 'WRITE' || user.role !== 'ADMINISTRATOR'" role="button" @click="router.push('/spreadsheets/delivery')" tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-orange-50 hover:bg-opacity-80 focus:bg-orange-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-orange-900 focus:text-orange-900 active:text-orange-900 outline-none">
        <div class="grid place-items-center mr-4">
          <Icon name="carbon:delivery" size="20" />
        </div>
        <h1>Доставка</h1>
      </div>
      <div v-if="user.username !== 'Светлана' && user.role !== 'ADMINISTRATOR'" role="button" @click="router.push('/admin/users')" tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-orange-50 hover:bg-opacity-80 focus:bg-orange-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-orange-900 focus:text-orange-900 active:text-orange-900 outline-none">
        <div class="grid place-items-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
            class="h-5 w-5">
            <path fill-rule="evenodd"
              d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              clip-rule="evenodd"></path>
          </svg>
        </div>
        <h1>Пользователи</h1>
      </div>
      <div v-if="user.username !== 'Светлана' && user.role !== 'ADMINISTRATOR'" role="button" @click="router.push('/admin/pvz')" tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-orange-50 hover:bg-opacity-80 focus:bg-orange-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-orange-900 focus:text-orange-900 active:text-orange-900 outline-none">
        <div class="grid place-items-center mr-4">
          <Icon name="tabler:reorder" size="20" />
        </div>
        <h1>Пункты выдачи заказов (ПВЗ)</h1>
      </div>
      <div v-if="user.username !== 'Светлана' && user.role !== 'ADMINISTRATOR'" role="button" @click="router.push('/admin/sorting-centers')" tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-orange-50 hover:bg-opacity-80 focus:bg-orange-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-orange-900 focus:text-orange-900 active:text-orange-900 outline-none">
        <div class="grid place-items-center mr-4">
          <Icon name="material-symbols-light:box-sharp" size="20" />
        </div>
        <h1>Сортировочные центры (СЦ)</h1>
      </div>
      <div v-if="user.username !== 'Светлана' && user.role !== 'ADMINISTRATOR'" role="button" @click="router.push('/admin/order-accounts')" tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-orange-50 hover:bg-opacity-80 focus:bg-orange-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-orange-900 focus:text-orange-900 active:text-orange-900 outline-none">
        <div class="grid place-items-center mr-4">
          <Icon name="material-symbols:deployed-code-account-outline-rounded" size="20" />
        </div>
        <h1>Аккаунты заказа</h1>
      </div>
      <div role="button" tabindex="0" @click="signOut()"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-orange-50 hover:bg-opacity-80 focus:bg-orange-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-orange-900 focus:text-orange-900 active:text-orange-900 outline-none">
        <div class="grid place-items-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
            class="h-5 w-5">
            <path fill-rule="evenodd"
              d="M12 2.25a.75.75 0 01.75.75v9a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM6.166 5.106a.75.75 0 010 1.06 8.25 8.25 0 1011.668 0 .75.75 0 111.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 011.06 0z"
              clip-rule="evenodd"></path>
          </svg>
        </div>
        Выйти
      </div>
    </nav>
  </div>

  <div
    class="absolute bg-gradient-to-tr from-white via-white to-yellow-100 bg-image top-0 bottom-0 left-0 right-0 z-50 hidden max-xl:flex items-center justify-center bg-white"
    v-if="isOpen">
    <Icon name="material-symbols:close" class="absolute duration-200 cursor-pointer hover:text-orange-400 top-2 right-4"
      size="40" @click="editMenu" />
    <nav class="flex flex-col gap-1 min-w-[240px] p-2 font-sans text-base font-normal text-black">
      <h1 class="text-center font-bold text-3xl text-secondary-color mb-5">DAROM.PRO</h1>
      <div role="button" @click="router.push('/admin/main')" tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-orange-50 hover:bg-opacity-80 focus:bg-orange-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-orange-900 focus:text-orange-900 active:text-orange-900 outline-none">
        <div class="grid place-items-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
            class="h-5 w-5">
            <path fill-rule="evenodd"
              d="M2.25 2.25a.75.75 0 000 1.5H3v10.5a3 3 0 003 3h1.21l-1.172 3.513a.75.75 0 001.424.474l.329-.987h8.418l.33.987a.75.75 0 001.422-.474l-1.17-3.513H18a3 3 0 003-3V3.75h.75a.75.75 0 000-1.5H2.25zm6.04 16.5l.5-1.5h6.42l.5 1.5H8.29zm7.46-12a.75.75 0 00-1.5 0v6a.75.75 0 001.5 0v-6zm-3 2.25a.75.75 0 00-1.5 0v3.75a.75.75 0 001.5 0V9zm-3 2.25a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0v-1.5z"
              clip-rule="evenodd"></path>
          </svg>
        </div>
        <h1>Главная</h1>
      </div>
      <div role="button" @click="router.push('/spreadsheets/our-ransom')" tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-orange-50 hover:bg-opacity-80 focus:bg-orange-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-orange-900 focus:text-orange-900 active:text-orange-900 outline-none"
        v-if="user.dataOurRansom === 'READ' || user.dataOurRansom === 'WRITE'">
        <div class="grid place-items-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
            class="h-5 w-5">
            <path fill-rule="evenodd"
              d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z"
              clip-rule="evenodd"></path>
          </svg>
        </div>
        <h1>Наш Выкуп</h1>
      </div>
      <div role="button" tabindex="0" @click="router.push('/spreadsheets/client-ransom')"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-orange-50 hover:bg-opacity-80 focus:bg-orange-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-orange-900 focus:text-orange-900 active:text-orange-900 outline-none"
        v-if="user.dataClientRansom === 'READ' || user.dataClientRansom === 'WRITE'">
        <div class="grid place-items-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
            class="h-5 w-5">
            <path fill-rule="evenodd"
              d="M6.912 3a3 3 0 00-2.868 2.118l-2.411 7.838a3 3 0 00-.133.882V18a3 3 0 003 3h15a3 3 0 003-3v-4.162c0-.299-.045-.596-.133-.882l-2.412-7.838A3 3 0 0017.088 3H6.912zm13.823 9.75l-2.213-7.191A1.5 1.5 0 0017.088 4.5H6.912a1.5 1.5 0 00-1.434 1.059L3.265 12.75H6.11a3 3 0 012.684 1.658l.256.513a1.5 1.5 0 001.342.829h3.218a1.5 1.5 0 001.342-.83l.256-.512a3 3 0 012.684-1.658h2.844z"
              clip-rule="evenodd"></path>
          </svg>
        </div>
        <h1>Выкуп Клиента</h1>
      </div>
      <div v-if="user.dataDelivery === 'READ' || user.dataDelivery === 'WRITE' || user.role !== 'ADMINISTRATOR'" role="button" @click="router.push('/spreadsheets/delivery')" tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-orange-50 hover:bg-opacity-80 focus:bg-orange-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-orange-900 focus:text-orange-900 active:text-orange-900 outline-none">
        <div class="grid place-items-center mr-4">
          <Icon name="carbon:delivery" size="20" />
        </div>
        <h1>Доставка</h1>
      </div>
      <div v-if="user.username !== 'Светлана' && user.role !== 'ADMINISTRATOR'" role="button" @click="router.push('/admin/users')" tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-orange-50 hover:bg-opacity-80 focus:bg-orange-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-orange-900 focus:text-orange-900 active:text-orange-900 outline-none">
        <div class="grid place-items-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
            class="h-5 w-5">
            <path fill-rule="evenodd"
              d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              clip-rule="evenodd"></path>
          </svg>
        </div>
        <h1>Пользователи</h1>
      </div>
      <div v-if="user.username !== 'Светлана' && user.role !== 'ADMINISTRATOR'" role="button" @click="router.push('/admin/pvz')" tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-orange-50 hover:bg-opacity-80 focus:bg-orange-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-orange-900 focus:text-orange-900 active:text-orange-900 outline-none">
        <div class="grid place-items-center mr-4">
          <Icon name="tabler:reorder" size="20" />
        </div>
        <h1>Пункты выдачи заказов (ПВЗ)</h1>
      </div>
      <div v-if="user.username !== 'Светлана' && user.role !== 'ADMINISTRATOR'" role="button" @click="router.push('/admin/sorting-centers')" tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-orange-50 hover:bg-opacity-80 focus:bg-orange-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-orange-900 focus:text-orange-900 active:text-orange-900 outline-none">
        <div class="grid place-items-center mr-4">
          <Icon name="material-symbols-light:box-sharp" size="20" />
        </div>
        <h1>Сортировочные центры (СЦ)</h1>
      </div>
      <div v-if="user.username !== 'Светлана' && user.role !== 'ADMINISTRATOR'" role="button" @click="router.push('/admin/order-accounts')" tabindex="0"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-orange-50 hover:bg-opacity-80 focus:bg-orange-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-orange-900 focus:text-orange-900 active:text-orange-900 outline-none">
        <div class="grid place-items-center mr-4">
          <Icon name="material-symbols:deployed-code-account-outline-rounded" size="20" />
        </div>
        <h1>Аккаунты заказа</h1>
      </div>
      <div role="button" tabindex="0" @click="signOut()"
        class="flex items-center w-full p-3 rounded-lg text-start leading-tight transition-all hover:bg-orange-50 hover:bg-opacity-80 focus:bg-orange-50 focus:bg-opacity-80 active:bg-gray-50 active:bg-opacity-80 hover:text-orange-900 focus:text-orange-900 active:text-orange-900 outline-none">
        <div class="grid place-items-center mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"
            class="h-5 w-5">
            <path fill-rule="evenodd"
              d="M12 2.25a.75.75 0 01.75.75v9a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM6.166 5.106a.75.75 0 010 1.06 8.25 8.25 0 1011.668 0 .75.75 0 111.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 011.06 0z"
              clip-rule="evenodd"></path>
          </svg>
        </div>
        Выйти
      </div>
    </nav>
  </div>
  <div v-else class="p-5 absolute z-40 max-xl:right-0 flex flex-col">
    {{ user.username }}
    <Icon @click="editMenu" size="40" name="material-symbols-light:menu"
      class="hover:text-orange-300 duration-200 cursor-pointer" />
  </div>
</template>
