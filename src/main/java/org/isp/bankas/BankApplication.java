package org.isp.bankas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BankApplication {

    public static final  String REACT_FRONT_URL = "http://localhost:3000";
    public static final String CURRENCY_API_KEY = "ac154d75765b1186f83b54cb6c1e5560";
    public static final String CURRENCY_URL = "https://data.fixer.io/api/latest";

    public static void main(String[] args) {
        SpringApplication.run(BankApplication.class, args);
    }

}
