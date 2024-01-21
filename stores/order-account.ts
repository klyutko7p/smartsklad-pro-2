import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

const toast = useToast()

export const useOrderAccountStore = defineStore("order-accounts", () => {

    async function getOrderAccounts() {
        try {
            let { data }: Data = await useFetch('/api/order-accounts/get-oa', {
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

    async function createOrderAccount(name: string) {
        try {
            if (name === '') {
                toast.warning("Название Аккаунта Заказа не должно быть пустым")
            } else {
                let data = await useFetch('/api/order-accounts/create-oa', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: name }),
                });
                toast.success("Аккаунт Заказа успешно добавлен!")
            }
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    }

    async function updateOrderAccount(orderAccount: OrderAccount) {
        try {
            let data = await useFetch('/api/order-accounts/edit-oa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderAccount: orderAccount }),
            })
            toast.success("Аккаунт заказа успешно обновлен!")
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    }

    async function deleteOrderAccount(id: number) {
        try {
            let data = await useFetch('/api/order-accounts/delete-oa', {
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

    return { getOrderAccounts, createOrderAccount, updateOrderAccount, deleteOrderAccount }
})