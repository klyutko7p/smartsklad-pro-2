import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface IRequestBody {
  row: IOurRansom | IClientRansom;
}

export default defineEventHandler(async (event) => {
  try {
    let { row } = await readBody<IRequestBody>(event);
    if ('priceSite' in row) {
      const rowData = await prisma.ourRansom.create({
        data: {
          id: row.id,
          clientLink1: row.clientLink1,
          cell: row.cell,
          name: row.name,
          fromName: row.fromName,
          productLink: row.productLink,
          productName: row.productName,
          notation: row.notation,
          priceSite: +row.priceSite,
          prepayment: +row.prepayment,
          percentClient: +row.percentClient,
          deliveredKGT: +row.deliveredKGT,
          amountFromClient1: +row.amountFromClient1,
          dispatchPVZ: row.dispatchPVZ,
          orderPVZ: row.orderPVZ,
          orderAccount: row.orderAccount,
          deliveredSC: row.deliveredSC,
          deliveredPVZ: row.deliveredPVZ,
          issued: row.issued,
          additionally: row.additionally,
          profit1: +row.profit1,
          deleted: row.deleted,
          created_at: row.created_at,
          updated_at: row.updated_at,
          createdUser: row.createdUser,
          updatedUser: row.updatedUser,
        },
      });
    } else if ('priceProgram' in row) {
      const rowData = await prisma.clientRansom.create({
        data: {
          id: row.id,
          clientLink2: row.clientLink2,
          cell: row.cell,
          name: row.name,
          fromName: row.fromName,
          productLink: row.productLink,
          productName: row.productName,
          priceProgram: +row.priceProgram,
          prepayment: +row.prepayment,
          percentClient: +row.percentClient,
          deliveredKGT: +row.deliveredKGT,
          amountFromClient2: +row.amountFromClient2,
          dispatchPVZ: row.dispatchPVZ,
          orderPVZ: row.orderPVZ,
          deliveredSC: row.deliveredSC,
          deliveredPVZ: row.deliveredPVZ,
          issued: row.issued,
          additionally: row.additionally,
          profit2: +row.profit2,
          deleted: row.deleted,
          created_at: row.created_at,
          updated_at: row.updated_at,
          createdUser: row.createdUser,
          updatedUser: row.updatedUser,
        },
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message)
      return { error: error.message };
    }
  }
});
