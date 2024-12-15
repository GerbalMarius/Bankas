package org.isp.bankas.fixer;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.isp.bankas.BankApplication;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.Map;

public class Exchanges {
    private Exchanges() {}

    private static BigDecimal getExchangeRate(String baseCurrency, String targetCurrency) throws IOException, InterruptedException {
        // Build the request URL
        String url = BankApplication.CURRENCY_URL + "?access_key=" + BankApplication.CURRENCY_API_KEY;

        // Create the HTTP request
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .GET()
                .build();

        // Send the HTTP request
        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() != 200) {
            throw new RuntimeException("Failed to fetch exchange rates. HTTP Status: " + response.statusCode());
        }

        // Parse the JSON response using Jackson
        ObjectMapper mapper = new ObjectMapper();
        FixerResponse fixerResponse = mapper.readValue(response.body(), FixerResponse.class);

        // Check success
        if (!fixerResponse.isSuccess()) {
            throw new RuntimeException("API response indicates failure.");
        }

        // Get rates relative to EUR
        Map<String, BigDecimal> rates = fixerResponse.getRates();

        // Convert to non-EUR base currency if necessary
        if (!baseCurrency.equals("EUR")) {
            BigDecimal baseToEURRate = rates.get(baseCurrency);
            if (baseToEURRate == null) {
                throw new RuntimeException("Base currency " + baseCurrency + " not found in response.");
            }

            BigDecimal targetToEURRate = rates.get(targetCurrency);
            if (targetToEURRate == null) {
                throw new RuntimeException("Target currency " + targetCurrency + " not found in response.");
            }

            // Calculate the rate: targetCurrency / baseCurrency
            return targetToEURRate.divide(baseToEURRate, 3, RoundingMode.HALF_UP);
        }

        // If the base currency is EUR, simply return the direct rate
        return rates.get(targetCurrency);
    }
    public static BigDecimal getRate(String baseCurrency, String targetCurrency){
        try {
            return getExchangeRate(baseCurrency, targetCurrency);
        }catch (IOException | InterruptedException e){
            throw new RuntimeException("Failed to fetch exchange rates",e);
        }
    }
}
