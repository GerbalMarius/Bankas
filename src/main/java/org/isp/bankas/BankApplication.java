package org.isp.bankas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BankApplication {

    public static final  String REACT_FRONT_URL = "http://localhost:3000";

    public static void main(String[] args) {
        SpringApplication.run(BankApplication.class, args);
    }

}
