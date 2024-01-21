import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

const toast = useToast()

export const usePVZStore = defineStore("pvz", () => {

    async function getPVZ() {
        try {
            let { data }: Data = await useFetch('/api/pvz/get-pvz', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            return data.value;
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    }

    async function createPVZ(name: string) {
        try {
            if (name === '') {
                toast.warning("Название ПВЗ не должно быть пустым")
            } else {
                let data = await useFetch('/api/pvz/create-pvz', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: name }),
                });
                toast.success("ПВЗ успешно добавлено!")
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    }

    async function updatePVZ(pvz: PVZ) {
        try {
            let data = await useFetch('/api/pvz/edit-pvz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pvz: pvz }),
            })
            toast.success("ПВЗ успешно обновлено!")
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    }

    async function deletePVZ(id: number) {
        try {
            let data = await useFetch('/api/pvz/delete-pvz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id }),
            });
            toast.success("ПВЗ успешно удалено!")
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    }

    return { getPVZ, createPVZ, updatePVZ, deletePVZ }
})