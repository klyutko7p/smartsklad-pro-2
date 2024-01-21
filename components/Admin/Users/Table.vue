<script setup lang="ts">
import type { PropType } from "vue";

const storeUsers = useUsersStore();

const emit = defineEmits(['openModal', 'deleteUser'])

function openModal(user: User) {
  emit('openModal', user)
}

function deleteUser(username: string) {
  emit('deleteUser', username)
}

defineProps({
  fields: { type: Array as PropType<String[]>, required: true },
  users: { type: Array as PropType<User[]> }
})
</script>

<template>
  <div class="relative overflow-x-auto mt-5">
    <table class="w-full text-sm text-left border-x-2 border-gray-50 rtl:text-right text-gray-500">
      <thead class="text-xs text-gray-700 uppercase text-center bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3" v-for="field in fields">{{ field }}</th>
        </tr>
      </thead>
      <tbody>
        <tr class="bg-white border-b text-center" v-for="userData in users">
          <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
            {{ userData.username }}
          </th>
          <td class="px-6 py-4">{{ userData.role }}</td>
          <td class="px-6 py-4">
            {{ storeUsers.getNormalizedDate(userData.created_at) }}
          </td>
          <td class="px-6 py-4">
            {{ userData.cell }}
          </td>
          <td class="px-6 py-4">
            {{ userData.additionally }}
          </td>
          <td class="px-6 py-4">
            {{ userData.deliveredSC }}
          </td>
          <td class="px-6 py-4">
            {{ userData.deliveredPVZ }}
          </td>
          <td class="px-6 py-4">
            {{ userData.deliveredKGT }}
          </td>
          <td class="px-6 py-4">
            {{ userData.dispatchPVZ }}
          </td>
          <td class="px-6 py-4">
            {{ userData.name }}
          </td>
          <td class="px-6 py-4">
            {{ userData.fromName }}
          </td>
          <td class="px-6 py-4">
            {{ userData.issued }}
          </td>
          <td class="px-6 py-4">
            {{ userData.orderAccount }}
          </td>
          <td class="px-6 py-4">
            {{ userData.orderPVZ }}
          </td>
          <td class="px-6 py-4">
            {{ userData.percentClient }}
          </td>
          <td class="px-6 py-4">
            {{ userData.notation }}
          </td>
          <td class="px-6 py-4">
            {{ userData.priceProgram }}
          </td>
          <td class="px-6 py-4">
            {{ userData.priceSite }}
          </td>
          <td class="px-6 py-4">
            {{ userData.productLink }}
          </td>
          <td class="px-6 py-4">
            {{ userData.productName }}
          </td>
          <td class="px-6 py-4">
            {{ userData.dataOurRansom }}
          </td>
          <td class="px-6 py-4">
            {{ userData.dataClientRansom }}
          </td>
          <td class="px-6 py-4">
            {{ userData.amountFromClient1 }}
          </td>
          <td class="px-6 py-4">
            {{ userData.amountFromClient2 }}
          </td>
          <td class="px-6 py-4">
            {{ userData.clientLink1 }}
          </td>
          <td class="px-6 py-4">
            {{ userData.clientLink2 }}
          </td>
          <td class="px-6 py-4">
            {{ userData.profit1 }}
          </td>
          <td class="px-6 py-4">
            {{ userData.profit2 }}
          </td>
          <td class="px-6 py-4">
            <Icon
              @click="openModal(userData)"
              class="text-green-600 cursor-pointer hover:text-green-300 duration-200"
              name="material-symbols:person-edit-outline"
              size="32"
            />
          </td>
          <td class="px-6 py-4">
            <Icon
              @click="deleteUser(userData.username)"
              class="text-red-600 cursor-pointer hover:text-red-300 duration-200"
              name="material-symbols:person-remove-outline"
              size="32"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
