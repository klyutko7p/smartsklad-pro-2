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
                cell: user.cell,
                additionally: user.additionally,
                deliveredSC: user.deliveredSC,
                deliveredPVZ: user.deliveredPVZ,
                deliveredKGT: user.deliveredKGT,
                dispatchPVZ: user.dispatchPVZ,
                name: user.name,
                fromName: user.fromName,
                issued: user.issued,
                orderAccount: user.orderAccount,
                orderPVZ: user.orderPVZ,
                percentClient: user.percentClient,
                notation: user.notation,
                priceProgram: user.priceProgram,
                priceSite: user.priceSite,
                productLink: user.productLink,
                productName: user.productName,
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
