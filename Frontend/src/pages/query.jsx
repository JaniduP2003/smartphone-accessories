"use client"

import { useState } from "react"

// Styles object using JSS pattern
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "500px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
  },
  cardHeader: {
    padding: "20px 20px 0 20px",
  },
  cardTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0 0 8px 0",
    color: "#333",
  },
  cardDescription: {
    fontSize: "14px",
    color: "#666",
    margin: "0 0 20px 0",
  },
  cardContent: {
    padding: "0 20px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    minHeight: "120px",
    resize: "vertical",
    boxSizing: "border-box",
  },
  cardFooter: {
    padding: "20px",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#4a6cf7",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  buttonDisabled: {
    backgroundColor: "#a0aec0",
    cursor: "not-allowed",
  },
  alert: {
    padding: "12px 16px",
    borderRadius: "4px",
    marginBottom: "20px",
    fontSize: "14px",
  },
  successAlert: {
    backgroundColor: "#e6f4ea",
    border: "1px solid #c6e7d4",
    color: "#2d7a4e",
  },
  errorAlert: {
    backgroundColor: "#fdecea",
    border: "1px solid #f8c9c4",
    color: "#b71c1c",
  },
  alertTitle: {
    fontWeight: "bold",
    marginBottom: "4px",
    fontSize: "16px",
  },
}

export default function CustomerSupportForm() {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState("idle") // "idle" | "success" | "error"
  const [errorMessage, setErrorMessage] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const response = await fetch("http://localhost:8080/api/queries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      setSubmitStatus("success")
      setFormData({
        customerName: "",
        email: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      console.error("Submission error:", error)
      setSubmitStatus("error")
      setErrorMessage(
        error.message || "Failed to submit form. Make sure your backend server is running and accessible.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h2 style={styles.cardTitle}>Customer Support</h2>
          <p style={styles.cardDescription}>Submit your query and our team will get back to you as soon as possible.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={styles.cardContent}>
            {submitStatus === "success" && (
              <div style={{ ...styles.alert, ...styles.successAlert }}>
                <div style={styles.alertTitle}>Success!</div>
                <p>Your query has been submitted successfully. We'll get back to you soon.</p>
              </div>
            )}

            {submitStatus === "error" && (
              <div style={{ ...styles.alert, ...styles.errorAlert }}>
                <div style={styles.alertTitle}>Error</div>
                <p>{errorMessage || "Failed to submit your query. Please try again."}</p>
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="customerName">
                Name
              </label>
              <input
                style={styles.input}
                id="customerName"
                name="customerName"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="email">
                Email
              </label>
              <input
                style={styles.input}
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="subject">
                Subject
              </label>
              <input
                style={styles.input}
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Brief description of your query"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="message">
                Message
              </label>
              <textarea
                style={styles.textarea}
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Please provide details about your query..."
                required
              />
            </div>
          </div>

          <div style={styles.cardFooter}>
            <button
              type="submit"
              style={{
                ...styles.button,
                ...(isSubmitting ? styles.buttonDisabled : {}),
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Query"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}