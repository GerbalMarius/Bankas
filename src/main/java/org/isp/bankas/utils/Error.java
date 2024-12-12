package org.isp.bankas.utils;

import lombok.Getter;

/**
 * Represents an error with an associated error message.
 * This class provides predefined static error instances for commonly encountered errors.
 * Additionally, it allows the construction of custom error instances via a factory method.
 * Instances of this class are immutable.
 */
@Getter
public class Error {
    // Method to get the error message
    private final String message;

    private Error(String message) {
        if (Strings.isNullOrEmpty(message)) {
            throw new IllegalArgumentException("Error message must not be null or empty.");
        }
        this.message = message;
    }

    // Static predefined errors
    public static final Error EMAIL_AND_PIN_REQUIRED = Error.of("Please enter your email and pin number.");
    public static final Error EMAIL_REQUIRED = Error.of("Please enter your email.");
    public static final Error PIN_REQUIRED = Error.of("Please enter your pin number.");
    public static final Error USER_NOT_FOUND = Error.of("Invalid email.");
    public static final Error INVALID_PIN = Error.of("Invalid pin number.");

    // Factory method for creating error instances
    public static Error of(String message) {
        return new Error(message);
    }

}