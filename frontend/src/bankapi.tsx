import axios from 'axios';
import {BACKEND_PREFIX} from "./App";

export interface BankAccount {
    id: number;
    balance: string; // Using string to handle BigDecimal correctly
    reservedBalance?: string;
    dailyLimit: string;
    monthlyLimit: string;
    accountName: string;
    currencyType: string;
}
export const fetchCurentUserAccounts = async () => {
    try {
        const response = await axios.get<BankAccount[]>(BACKEND_PREFIX + "/api/accounts/currentUser",
            {withCredentials : true});
        return response.data;
    }catch (err) {
        console.log(err);
        return null;
    }
}