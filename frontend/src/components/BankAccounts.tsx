import React, {useEffect, useState} from 'react';

interface BankAccount {
    id: number;
    balance: string; // Using string to handle BigDecimal correctly
    reservedBalance?: string;
    dailyLimit: string;
    monthlyLimit: string;
    accountName: string;
    currencyType: string;
}

const BankAccounts = () => {
    return (
        <div>
            Accounts
        </div>
    );
};

export default BankAccounts;