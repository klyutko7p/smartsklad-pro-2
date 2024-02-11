import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import crypto from 'crypto-js';

const toast = useToast()

export const useBalanceStore = defineStore("balance", () => {

    async function createBalanceRow(row: IBalance, username: string, flag: string) {

        try {
            if (row.sum === undefined) row.sum = '0';
            if (row.pvz === undefined) row.pvz = '';

            row.createdUser = username;

            let data = await useFetch('/api/balance/create-row', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ row: row, flag: flag }),
            });
            if (data.data.value === undefined) {
                toast.success("Запись успешно создана!")
            } else {
                console.log(data.data.value);
                toast.error("Произошла ошибка при создании записи")
            }

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    }

    async function getBalanceRows(flag: string) {
        try {
            let { data }: any = await useFetch('/api/ransom/get-rows', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ flag: flag })
            })
            return data.value;
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    }

    async function updateBalanceRow(row: IBalance, username: string) {
        try {
                if (row.sum === undefined) row.sum = '0';
                if (row.pvz === undefined) row.pvz = '';

                row.createdUser = username;

            let data = await useFetch('/api/ransom/edit-row', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ row: row }),
            })

            if (data.data.value === undefined) {
                toast.success("Запись успешно обновлена!")
            } else {
                toast.error("Произошла ошибка при обновлении записи!")
            }

        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message)
                toast.error(error.message);
            }
        }
    }

    async function updateDeliveryStatus(row: IBalance, flag: string) {
        try {
            let data = await useFetch('/api/ransom/update-delivery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ row: row, flag: flag }),
            })
            if (data.data.value === undefined) {
                toast.success("Статус успешно обновлен!")
            } else {
                console.log(data.data.value);
                toast.error("Произошла ошибка")
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message)
                toast.error(error.message);
            }
        }
    }


    return { updateDeliveryStatus, updateBalanceRow, getBalanceRows, createBalanceRow }
})