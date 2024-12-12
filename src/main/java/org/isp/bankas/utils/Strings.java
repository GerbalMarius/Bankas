package org.isp.bankas.utils;

public class Strings {
    private Strings() {}

    public static boolean isNullOrEmpty(String str) {
        return str == null || str.isEmpty();
    }

    public static boolean isNullOrEmpty(String... str) {
        for (String s : str) {
            if (isNullOrEmpty(s)) {
                return true;
            }
        }
        return false;
    }
}
