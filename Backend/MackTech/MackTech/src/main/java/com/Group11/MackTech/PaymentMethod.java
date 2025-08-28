package com.Group11.MackTech;

// Enum for Payment Method
public enum PaymentMethod {
	CASH_ON_DELIVERY,
	BANK_TRANSFER;

	public static PaymentMethod fromString(String value) {
		if ("cashOnDelivery".equalsIgnoreCase(value)) {
			return CASH_ON_DELIVERY;
		} else if ("bankTransfer".equalsIgnoreCase(value)) {
			return BANK_TRANSFER;
		}
		throw new IllegalArgumentException("Invalid payment method: " + value);
	}
}


