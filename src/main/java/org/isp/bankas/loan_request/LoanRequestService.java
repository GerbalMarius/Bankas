package org.isp.bankas.loan_request;

import org.isp.bankas.accounts.BankAccount;
import org.isp.bankas.accounts.BankAccountService;
import org.isp.bankas.accounts.CurrencyType;
import org.isp.bankas.user.User;
import org.isp.bankas.user.UserDTO;
import org.isp.bankas.user.UserService;
import org.springframework.stereotype.Service;

@Service
public class LoanRequestService {
    private final LoanRequestRepository loanRequestRepository;
    private final UserService userService;
    private final BankAccountService bankAccountService;

    public LoanRequestService(LoanRequestRepository loanRequestRepository, UserService userService, BankAccountService bankAccountService) {
        this.loanRequestRepository = loanRequestRepository;
        this.userService = userService;
        this.bankAccountService = bankAccountService;
    }

    public LoanRequest save(LoanRequestDTO loanRequestDTO, UserDTO currentUser) {
        // Fetch user and bank account information
        User user = userService.findByEmail(currentUser.getEmail());
        BankAccount bankAccount = bankAccountService.findByAccountName(loanRequestDTO.getBankAccountName());

        // Create LoanRequest using the DTO constructor
        LoanRequest loanRequest = new LoanRequest(
                loanRequestDTO.getDescription(),
                loanRequestDTO.getLoanAmount(),
                bankAccount.getAccountName(),
                LoanStatus.SUBMITTED,
                CurrencyType.valueOf(loanRequestDTO.getCurrencyType()),
                loanRequestDTO.getStartingAmount(),
                loanRequestDTO.getInterestRate(),
                loanRequestDTO.getDurationMonths()
        );

        // Set the user to the loan request
        loanRequest.setUser(user);

        // Add the loan request to the user's loan requests list
        user.getLoanRequests().add(loanRequest);

        // Save and return the loan request
        return loanRequestRepository.save(loanRequest);
    }
}