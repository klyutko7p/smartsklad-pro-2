import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
    user: User;
}


export default defineEventHandler(async (event) => {
    try {
        const { user } = await readBody<IRequestBody>(event);

        const updateUser = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                username: user.username,
                role: user.role,
                cell1: user.cell1,
                cell2: user.cell2,
                additionally1: user.additionally2,
                additionally2: user.additionally2,
                deliveredSC1: user.deliveredSC1,
                deliveredSC2: user.deliveredSC2,
                deliveredPVZ1: user.deliveredPVZ1,
                deliveredPVZ2: user.deliveredPVZ2,
                deliveredKGT1: user.deliveredKGT1,
                deliveredKGT2: user.deliveredKGT2,
                dispatchPVZ1: user.dispatchPVZ1,
                dispatchPVZ2: user.dispatchPVZ2,
                name1: user.name1,
                name2: user.name2,
                fromName1: user.fromName1,
                fromName2: user.fromName2,
                issued1: user.issued1,
                issued2: user.issued2,
                orderAccount: user.orderAccount,
                orderPVZ1: user.orderPVZ1,
                orderPVZ2: user.orderPVZ2,
                percentClient1: user.percentClient1,
                percentClient2: user.percentClient2,
                notation1: user.notation1,
                notation2: user.notation2,
                priceProgram: user.priceProgram,
                priceSite: user.priceSite,
                prepayment1: user.prepayment1,
                prepayment2: user.prepayment2,
                productLink1: user.productLink1,
                productLink2: user.productLink2,
                productName1: user.productName1,
                productName2: user.productName2,
                dataOurRansom: user.dataOurRansom,
                dataClientRansom: user.dataClientRansom,
                amountFromClient1: user.amountFromClient1,
                amountFromClient2: user.amountFromClient2,
                clientLink1: user.clientLink1,
                clientLink2: user.clientLink2,
                profit1: user.profit1,
                profit2: user.profit2,
            },
        })

    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        }
    }

});
