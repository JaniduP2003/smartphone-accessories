"use client"

import { useState } from "react"
import "../styles/PaymentPage.css";

function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const [receipt, setReceipt] = useState(null)
  const [receiptError, setReceiptError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Sample order details (in a real app, this would come from your cart/state)
  const orderDetails = {
    subtotal: 129.99,
    shipping: 5.0,
    tax: 13.0,
    total: 147.99,
    items: [
      { name: "Phone Case - iPhone 13 Pro", price: 29.99, quantity: 1 },
      { name: "Screen Protector - Tempered Glass", price: 19.99, quantity: 2 },
      { name: "Wireless Charger", price: 59.99, quantity: 1 },
    ],
  }

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value)
    // Reset receipt state when changing payment method
    if (e.target.value === "cod") {
      setReceipt(null)
      setReceiptError("")
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Check file type
      if (!["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(file.type)) {
        setReceiptError("Please upload a valid image (JPEG, PNG) or PDF file")
        setReceipt(null)
        return
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setReceiptError("File size should be less than 5MB")
        setReceipt(null)
        return
      }

      setReceipt(file)
      setReceiptError("")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    if (paymentMethod === "bank" && !receipt) {
      setReceiptError("Please upload your bank transfer receipt")
      return
    }

    // Simulate form submission
    setIsSubmitting(true)

    // In a real application, you would send this data to your server
    setTimeout(() => {
      setIsSubmitting(false)
      setSuccessMessage(
        paymentMethod === "cod"
          ? "Your order has been placed successfully! You will pay upon delivery."
          : "Your order has been placed successfully! We will verify your payment and process your order.",
      )

      // Reset form after successful submission
      if (paymentMethod === "bank") {
        setReceipt(null)
      }
    }, 1500)
  }

  return (
    <div className="payment-container">
      <div className="payment-wrapper">
        <div className="payment-form-container">
          <h1>Payment Method</h1>

          {successMessage ? (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <p>{successMessage}</p>
              <button className="continue-shopping-btn" onClick={() => (window.location.href = "/")}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="payment-options">
                <div className="payment-option">
                  <input
                    type="radio"
                    id="cod"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={handlePaymentMethodChange}
                  />
                  <label htmlFor="cod">
                    <div className="payment-option-icon cod-icon">💵</div>
                    <div className="payment-option-details">
                      <span className="payment-option-title">Cash on Delivery</span>
                      <span className="payment-option-description">Pay when you receive your order</span>
                    </div>
                  </label>
                </div>

                <div className="payment-option">
                  <input
                    type="radio"
                    id="bank"
                    name="paymentMethod"
                    value="bank"
                    checked={paymentMethod === "bank"}
                    onChange={handlePaymentMethodChange}
                  />
                  <label htmlFor="bank">
                    <div className="payment-option-icon bank-icon">🏦</div>
                    <div className="payment-option-details">
                      <span className="payment-option-title">Bank Transfer</span>
                      <span className="payment-option-description">Pay via bank transfer and upload receipt</span>
                    </div>
                  </label>
                </div>
              </div>

              {paymentMethod === "bank" && (
                <div className="bank-transfer-section">
                  <div className="bank-details">
                    <h3>Bank Account Details</h3>
                    <p>
                      <strong>Bank Name:</strong> Example Bank
                    </p>
                    <p>
                      <strong>Account Name:</strong> Mobile Accessories Ltd
                    </p>
                    <p>
                      <strong>Account Number:</strong> 1234567890
                    </p>
                    <p>
                      <strong>IFSC Code:</strong> EXBK0001234
                    </p>
                    <p className="bank-instruction">Please transfer the total amount and upload the receipt below</p>
                  </div>

                  <div className="receipt-upload">
                    <h3>Upload Payment Receipt</h3>
                    <div className="file-upload-container">
                      <label htmlFor="receipt" className="file-upload-label">
                        {receipt ? receipt.name : "Choose File"}
                      </label>
                      <input
                        type="file"
                        id="receipt"
                        onChange={handleFileChange}
                        accept=".jpg,.jpeg,.png,.pdf"
                        className="file-input"
                      />
                    </div>
                    {receiptError && <p className="error-message">{receiptError}</p>}
                    {receipt && <p className="file-selected">File selected: {receipt.name}</p>}
                  </div>
                </div>
              )}

              <div className="shipping-address">
                <h3>Shipping Address</h3>
                <p>John Doe</p>
                <p>123 Main Street, Apt 4B</p>
                <p>New York, NY 10001</p>
                <p>United States</p>
                <p>Phone: (123) 456-7890</p>
              </div>

              <button type="submit" className="place-order-btn" disabled={isSubmitting}>
                {isSubmitting ? "Processing..." : "Place Order"}
              </button>
            </form>
          )}
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-items">
            {orderDetails.items.map((item, index) => (
              <div className="order-item" key={index}>
                <div className="item-details">
                  <p className="item-name">{item.name}</p>
                  <p className="item-quantity">Qty: {item.quantity}</p>
                </div>
                <p className="item-price">LKR {(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="order-subtotal">
              <span>Subtotal</span>
              <span>LKR {orderDetails.subtotal.toFixed(2)}</span>
            </div>
            <div className="order-shipping">
              <span>Shipping</span>
              <span>LKR {orderDetails.shipping.toFixed(2)}</span>
            </div>
            <div className="order-tax">
              <span>Tax</span>
              <span>LKR {orderDetails.tax.toFixed(2)}</span>
            </div>
            <div className="order-total">
              <span>Total</span>
              <span>LKR {orderDetails.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPage
