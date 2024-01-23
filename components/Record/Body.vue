<script setup lang="ts">
const router = useRouter();
const storeUsers = useUsersStore();
defineProps({
  row: { type: Object as PropType<IOurRansom | IClientRansom>, required: true },
  user: { type: Object as PropType<User>, required: true },
});

const emit = defineEmits(["updateDeliveryRow"]);

function updateDeliveryRow(row: IOurRansom | IClientRansom, flag: string) {
  emit("updateDeliveryRow", { row: row, flag: flag });
}
</script>

<template>
  <h1 class="text-4xl">
    Запись: <span class="text-secondary-color">{{ row.id }}</span>
  </h1>
  <div class="mt-5 text-lg grid grid-cols-2 max-lg:grid-cols-1 gap-5">
    <div class="grid grid-cols-2 border-2 border-black p-3 border-dashed text-center">
      <h1>Телефон:</h1>
      <h1
        v-if="row.clientLink1"
        class="cursor-pointer underline text-secondary-color duration-200 hover:opacity-50"
        @click="router.push(`/spreadsheets/order/${row.clientLink1}`)"
      >
        {{ row.fromName }}
      </h1>
      <h1
        v-if="row.clientLink2"
        class="cursor-pointer underline text-secondary-color duration-200 hover:opacity-50"
        @click="router.push(`/spreadsheets/order/${row.clientLink2}`)"
      >
        {{ row.fromName }}
      </h1>
    </div>
    <div v-if="row.clientLink1" class="grid grid-cols-2 border-2 border-black p-3 border-dashed text-center">
      <h1>Доставлено на СЦ:</h1>
      <Icon
        @click="updateDeliveryRow(row, 'SC')"
        v-if="
          !row.deliveredSC &&
          user.dataOurRansom === 'WRITE' &&
          user.deliveredSC1 === 'WRITE'
        "
        class="text-green-500 mx-auto cursor-pointer hover:text-green-300 duration-200"
        name="mdi:checkbox-multiple-marked-circle"
        size="32"
      />
      <h1 class="font-bold text-green-500">
        {{ row.deliveredSC ? storeUsers.getNormalizedDate(row.deliveredSC) : "" }}
      </h1>
    </div>

    <div v-if="row.clientLink2" class="grid grid-cols-2 border-2 border-black p-3 border-dashed text-center">
      <h1>Доставлено на СЦ:</h1>
      <Icon
        @click="updateDeliveryRow(row, 'SC')"
        v-if="
          !row.deliveredSC &&
          user.dataClientRansom === 'WRITE' &&
          user.deliveredSC2 === 'WRITE'
        "
        class="text-green-500 mx-auto cursor-pointer hover:text-green-300 duration-200"
        name="mdi:checkbox-multiple-marked-circle"
        size="32"
      />
      <h1 class="font-bold text-green-500">
        {{ row.deliveredSC ? storeUsers.getNormalizedDate(row.deliveredSC) : "" }}
      </h1>
    </div>
   
    <div class="grid grid-cols-2 border-2 border-black p-3 border-dashed text-center">
      <h1>Ячейка:</h1>
      <h1>{{ row.cell }}</h1>
    </div>
    <div v-if="row.clientLink1" class="grid grid-cols-2 border-2 border-black p-3 border-dashed text-center">
      <h1>Доставлено на ПВЗ:</h1>
      <Icon
        @click="updateDeliveryRow(row, 'PVZ')"
        v-if="
          !row.deliveredPVZ &&
          user.dataOurRansom === 'WRITE' &&
          user.deliveredPVZ1 === 'WRITE'
        "
        class="text-green-500 mx-auto cursor-pointer hover:text-green-300 duration-200"
        name="mdi:checkbox-multiple-marked-circle"
        size="32"
      />
      <h1 class="font-bold text-green-500">
        {{ row.deliveredPVZ ? storeUsers.getNormalizedDate(row.deliveredPVZ) : "" }}
      </h1>
    </div>
    <div v-if="row.clientLink2" class="grid grid-cols-2 border-2 border-black p-3 border-dashed text-center">
      <h1>Доставлено на ПВЗ:</h1>
      <Icon
        @click="updateDeliveryRow(row, 'PVZ')"
        v-if="
          !row.deliveredPVZ &&
          user.dataClientRansom === 'WRITE' &&
          user.deliveredPVZ2 === 'WRITE'
        "
        class="text-green-500 mx-auto cursor-pointer hover:text-green-300 duration-200"
        name="mdi:checkbox-multiple-marked-circle"
        size="32"
      />
      <h1 class="font-bold text-green-500">
        {{ row.deliveredPVZ ? storeUsers.getNormalizedDate(row.deliveredPVZ) : "" }}
      </h1>
    </div>
    <div class="grid grid-cols-2 border-2 border-black p-3 border-dashed text-center">
      <h1>Название товара:</h1>
      <h1>{{ row.productName }}</h1>
    </div>
    <div v-if="row.clientLink1" class="grid grid-cols-2 border-2 border-black p-3 border-dashed text-center">
      <h1>Выдан клиенту:</h1>
      <Icon
        @click="updateDeliveryRow(row, 'issued')"
        v-if="!row.issued && user.dataOurRansom === 'WRITE' && user.issued1 === 'WRITE'"
        class="text-green-500 mx-auto cursor-pointer hover:text-green-300 duration-200"
        name="mdi:checkbox-multiple-marked-circle"
        size="32"
      />
      <h1 class="font-bold text-green-500">
        {{ row.issued ? storeUsers.getNormalizedDate(row.issued) : "" }}
      </h1>
    </div>
    <div v-if="row.clientLink2" class="grid grid-cols-2 border-2 border-black p-3 border-dashed text-center">
      <h1>Выдан клиенту:</h1>
      <Icon
        @click="updateDeliveryRow(row, 'issued')"
        v-if="!row.issued && user.dataClientRansom === 'WRITE' && user.issued2 === 'WRITE'"
        class="text-green-500 mx-auto cursor-pointer hover:text-green-300 duration-200"
        name="mdi:checkbox-multiple-marked-circle"
        size="32"
      />
      <h1 class="font-bold text-green-500">
        {{ row.issued ? storeUsers.getNormalizedDate(row.issued) : "" }}
      </h1>
    </div>
  </div>
</template>
