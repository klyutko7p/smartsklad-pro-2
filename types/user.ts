
interface User {
    id: number;
    username: string;
    password: string;
    role: string | Role;
    created_at: Date | number;
    cell: string;
    additionally: string;
    deliveredSC: string;
    deliveredPVZ: string;
    deliveredKGT: string;
    dispatchPVZ: string;
    name: string;
    fromName: string;
    issued: string;
    orderAccount: string;
    orderPVZ: string;
    percentClient: string;
    notation: string;
    prepayment: string;
    priceProgram: string;
    priceSite: string;
    productLink: string;
    productName: string;
    dataOurRansom: string;
    dataClientRansom: string;
    amountFromClient1: string;
    amountFromClient2: string;
    clientLink1: string;
    clientLink2: string;
    profit1: string;
    profit2: string;
}