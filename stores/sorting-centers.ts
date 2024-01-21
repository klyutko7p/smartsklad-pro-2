import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

const toast = useToast()

export const useSortingCentersStore = defineStore("sorting-centers", () => {

    async function getSortingCenters() {
        try {
            let { data }: Data = await useFetch('/api/sorting-centers/get-sc', {
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

    async function createSortingCenter(name: string) {
        try {
            if (name === '') {
                toast.warning("Название Сортировочного Центра не должно быть пустым")
            } else {
                let data = await useFetch('/api/sorting-centers/create-sc', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: name }),
                });
                toast.success("Сортировочный Центр успешно добавлен!")
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    }

    async function updateSortingCenters(sortingCenter: SortingCenter) {
        try {
            let data = await useFetch('/api/sorting-centers/edit-sc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sortingCenter: sortingCenter }),
            })
            toast.success("Сортировочный Центр успешно обновлен!")
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    }

    async function deleteSortingCenter(id: number) {
        try {
            let data = await useFetch('/api/sorting-centers/delete-sc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id }),
            });
            toast.success("Сортировочный Центр успешно удален!")
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    }

    return { getSortingCenters, createSortingCenter, updateSortingCenters, deleteSortingCenter }
})