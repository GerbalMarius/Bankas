package org.isp.bankas.loan_request;

import org.isp.bankas.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LoanRequestRepository  extends JpaRepository<LoanRequest, Long> {
    LoanRequest findById(long id);
    LoanRequest findByLoanStatus(LoanStatus loanStatus);

    LoanRequest findByUser(User user);
}
