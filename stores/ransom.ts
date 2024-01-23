import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import crypto from 'crypto-js';

const toast = useToast()

function generateLink(phoneNumber: string, flag: string) {
    const formattedPhoneNumber = phoneNumber.replace("+", "").replace(" ", "");

    const hash = crypto.SHA256(formattedPhoneNumber).toString();

    let link = ''

    if (flag === 'OurRansom') {
        link = `1-${hash}`;
    } else {
        link = `2-${hash}`;
    }

    return link;
}

export const useRansomStore = defineStore("ransom", () => {

    async function createCopyRow(id: number, flag: string) {
        try {
            let data = await useFetch('/api/ransom/create-copy-row', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id, flag: flag }),
            });

            if (data.data.value === undefined) {
                toast.success("Запись успешно скопирована!")
            } else {
                console.log(data.data.value);
                toast.error("Произошла ошибка")
            }

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    }

    async function createRansomRow(row: IOurRansom | IClientRansom, username: string, flag: string) {

        try {
            if (flag === 'OurRansom') {
                if (row.percentClient === undefined) row.percentClient = 10;
                if (row.priceSite === undefined) row.priceSite = 0;
                if (row.deliveredKGT === undefined) row.deliveredKGT = 0;
                if (row.productName === undefined) row.productName = '';
                if (row.prepayment === undefined) row.prepayment = 0;


                row.createdUser = username;
                row.updatedUser = username;

                if (row.fromName) {
                    row.clientLink1 = generateLink(row.fromName, 'OurRansom');
                } else {
                    row.clientLink1 = ''
                }

                row.amountFromClient1 = Math.round(row.priceSite + (row.priceSite * row.percentClient / 100) + row.deliveredKGT - row.prepayment);
                row.profit1 = row.amountFromClient1 - row.priceSite + row.prepayment;

            } else if (flag === 'ClientRansom') {
                if (row.percentClient === undefined) row.percentClient = 10;
                if (row.priceProgram === undefined) row.priceProgram = 0;
                if (row.deliveredKGT === undefined) row.deliveredKGT = 0;
                if (row.productName === undefined) row.productName = '';
                if (row.prepayment === undefined) row.prepayment = 0;

                row.createdUser = username;
                row.updatedUser = username;

                if (row.fromName) {
                    row.clientLink2 = generateLink(row.fromName, 'ClientRansom');
                } else {
                    row.clientLink2 = ''
                }

                row.amountFromClient2 = row.priceProgram * row.percentClient / 100 - row.prepayment;
                row.profit2 = row.amountFromClient2 + row.prepayment;
            }


            let data = await useFetch('/api/ransom/create-row', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ row: row, flag: flag }),
            });

            if (data.data.value === undefined) {
                toast.success("Запись успешно создана!")
            } else {
                toast.error("Произошла ошибка")
            }

        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    }

    async function getRansomRows(flag: string) {
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

    async function getRansomRowsByLink(link: string, flag: string) {
        try {
            let { data }: any = await useFetch('/api/ransom/get-rows-by-link', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ link: link, flag: flag }),
            });
            return data.value;
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    }

    async function updateRansomRow(row: IOurRansom | IClientRansom, username: string, flag: string) {
        try {
            if (flag === 'OurRansom') {
                if (row.percentClient === undefined || row.percentClient === 0) row.percentClient = 10;
                if (row.priceSite === undefined || row.priceSite === 0) row.priceSite = 0;
                if (row.deliveredKGT === undefined || row.deliveredKGT === 0) row.deliveredKGT = 0;
                if (row.productName === undefined || row.productName === '') row.productName = '';
                if (row.prepayment === undefined) row.prepayment = 0;

                row.updatedUser = username;
                row.updated_at = new Date().toISOString();

                if (row.fromName) {
                    row.clientLink1 = generateLink(row.fromName, 'OurRansom');
                } else {
                    row.clientLink1 = ''
                }

                row.amountFromClient1 = Math.round(row.priceSite + (row.priceSite * row.percentClient / 100) + row.deliveredKGT - row.prepayment);
                row.profit1 = row.amountFromClient1 - row.priceSite + row.prepayment;


            } else if (flag === 'ClientRansom') {
                if (row.percentClient === undefined || row.percentClient === 0) row.percentClient = 10;
                if (row.priceProgram === undefined || row.priceProgram === 0) row.priceProgram = 0;
                if (row.deliveredKGT === undefined || row.deliveredKGT === 0) row.deliveredKGT = 0;
                if (row.productName === undefined || row.productName === '') row.productName = '';
                if (row.prepayment === undefined) row.prepayment = 0;

                row.updatedUser = username;
                row.updated_at = new Date().toISOString();

                if (row.fromName) {
                    row.clientLink2 = generateLink(row.fromName, 'ClientRansom');
                } else {
                    row.clientLink2 = ''
                }

                row.amountFromClient2 = row.priceProgram * row.percentClient / 100 - row.prepayment;
                row.profit2 = row.amountFromClient2 + row.prepayment;
            }

            let data = await useFetch('/api/ransom/edit-row', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ row: row, flag: flag }),
            })
            toast.success("Запись успешно обновлена!")

        } catch (error) {
            if (error instanceof Error) {
                console.error(error.message)
                toast.error(error.message);
            }
        }
    }

    async function updateDeliveryStatus(row: IOurRansom, flag: string, flagRansom: string) {
        try {
            let data = await useFetch('/api/ransom/update-delivery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ row: row, flag: flag, flagRansom: flagRansom }),
            })
            toast.success("Доставка успешно обновлена!")
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    }

    async function updateDeliveryRowsStatus(idArray: number[], flag: string, flagRansom: string) {
        try {
            let data = await useFetch('/api/ransom/update-rows-delivery', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idArray: idArray, flag: flag, flagRansom: flagRansom }),
            })
            toast.success("Доставка у записей успешно обновлена!")
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    }

    async function deleteRansomRow(id: number, flag: string) {
        try {
            let data = await useFetch('/api/ransom/delete-row', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id, flag: flag }),
            });
            toast.success("Запись успешно удалена!")
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    }

    async function deleteIssuedRows(flag: string) {
        try {
            let data = await useFetch('/api/ransom/delete-issued-rows', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ flag: flag }),
            });
            toast.success("Записи успешно удалены!")
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    }

    async function deleteRansomSelectedRows(idArray: number[], flag: string) {
        try {
            let data = await useFetch('/api/ransom/delete-selected-rows', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ idArray: idArray, flag: flag }),
            });
            toast.success("Записи успешно удалены!")
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    }

    async function getRansomRow(id: number, flag: string) {
        try {
            let { data }: any = await useFetch('/api/ransom/get-row', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id, flag: flag }),
            })
            return data.value;
        } catch (error) {
            if (error instanceof Error) {
                toast.error(error.message);
            }
        }
    }

    const getUniqueNonEmptyValues = (rows: IOurRansom[] | IClientRansom[], fieldName: keyof IOurRansom | IClientRansom): string[] => {
        const uniqueNonEmptyValues = new Set<string>();
        rows.forEach((row) => {
            const value = row[fieldName];
            if (value !== "" && value !== null && value !== undefined) {
                uniqueNonEmptyValues.add(value);
            }
        });
        return Array.from(uniqueNonEmptyValues);
    };

    return { createRansomRow, getRansomRows, updateRansomRow, deleteRansomRow, updateDeliveryStatus, getUniqueNonEmptyValues, getRansomRow, deleteRansomSelectedRows, getRansomRowsByLink, updateDeliveryRowsStatus, createCopyRow, deleteIssuedRows }
})