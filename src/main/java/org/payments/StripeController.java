package org.isp.bankas.payments;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import org.isp.bankas.BankApplication;
import org.isp.bankas.accounts.BankAccountService;
import org.isp.bankas.user.UserDTO;
import org.isp.bankas.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = BankApplication.REACT_FRONT_URL, allowCredentials = "true")
@RequestMapping("/api/payments")
public class StripeController {

    @Autowired
    private BankAccountService bankAccountService;

    @Autowired
    private UserService userService;

    public StripeController() {
        Stripe.apiKey = "sk_test_51QWNyO2MHFP3dlqLdHy6nqHC1viWjx9iViyJOQlpLMlwp2sv9MmvLbmcfz7vWwMhMGY2YhWHRgfjF30GwSI2TLXQ00ejbnCN1O";
    }

    @PostMapping("/create-payment-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(@RequestBody Map<String, Object> request, HttpSession session) {
        Object user = session.getAttribute("user");
        if (!(user instanceof UserDTO currentUser)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        int amount = (int) request.get("amount");

        Map<String, Object> params = new HashMap<>();
        params.put("amount", amount * 100); // amount in cents
        params.put("currency", "usd");

        try {
            PaymentIntent intent = PaymentIntent.create(params);
            Map<String, String> responseData = new HashMap<>();
            responseData.put("clientSecret", intent.getClientSecret());
            return ResponseEntity.ok(responseData);
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/confirm-payment")
    public ResponseEntity<String> confirmPayment(@RequestBody Map<String, Object> request, HttpSession session) {
        Object user = session.getAttribute("user");
        if (!(user instanceof UserDTO currentUser)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String paymentIntentId = (String) request.get("paymentIntentId");
        String bankAccountNumber = (String) request.get("bankAccountNumber");
        int amount = (int) request.get("amount");

        try {
            PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId);
            if ("succeeded".equals(intent.getStatus())) {
                bankAccountService.updateBankAccountFunds(bankAccountNumber, amount);
                return ResponseEntity.ok("Payment confirmed and funds added.");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment not confirmed.");
            }
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}