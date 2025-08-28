"use client"

import { useState, useEffect } from "react"

// Styles object using JSS pattern
const styles = {
  container: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    marginBottom: "30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#333",
    margin: "0",
  },
  refreshButton: {
    padding: "8px 16px",
    backgroundColor: "#4a6cf7",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: "500",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#a0aec0",
    cursor: "not-allowed",
  },
  statsContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
  },
  statCard: {
    flex: "1",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  statNumber: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "5px",
  },
  statLabel: {
    fontSize: "14px",
    color: "#666",
  },
  totalStat: {
    color: "#4a6cf7",
  },
  pendingStat: {
    color: "#f59e0b",
  },
  resolvedStat: {
    color: "#10b981",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "white",
    borderRadius: "8px",
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  th: {
    textAlign: "left",
    padding: "16px",
    backgroundColor: "#f8f9fa",
    borderBottom: "1px solid #ddd",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333",
  },
  td: {
    padding: "16px",
    borderBottom: "1px solid #ddd",
    fontSize: "14px",
    color: "#333",
  },
  messageCell: {
    maxWidth: "300px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  statusBadge: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "500",
  },
  pendingStatus: {
    backgroundColor: "#fff8e1",
    color: "#f57c00",
  },
  resolvedStatus: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  loadingSpinner: {
    display: "inline-block",
    width: "30px",
    height: "30px",
    border: "3px solid rgba(0, 0, 0, 0.1)",
    borderLeftColor: "#4a6cf7",
    borderRadius: "50%",
    marginRight: "10px",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    fontSize: "16px",
    color: "#333",
  },
  error: {
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "14px",
    backgroundColor: "#fdecea",
    border: "1px solid #f8c9c4",
    color: "#b71c1c",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  noQueries: {
    padding: "40px",
    textAlign: "center",
    color: "#666",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  actionButton: {
    padding: "6px 12px",
    backgroundColor: "#4a6cf7",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: "500",
    cursor: "pointer",
    marginRight: "5px",
  },
  resolveButton: {
    backgroundColor: "#10b981",
  },
  deleteButton: {
    backgroundColor: "#ef4444",
  },
  refreshIcon: {
    display: "inline-block",
    width: "16px",
    height: "16px",
    marginRight: "8px",
    borderTop: "2px solid white",
    borderRight: "2px solid white",
    borderBottom: "2px solid white",
    borderLeft: "2px solid transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
}

export default function AdminQuery() {
  const [queries, setQueries] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  // Stats
  const totalQueries = queries.length
  const pendingQueries = queries.filter((q) => !q.status || q.status === "PENDING").length
  const resolvedQueries = queries.filter((q) => q.status === "RESOLVED").length

  const fetchQueries = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:8080/api/queries/admin")

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setQueries(data)
    } catch (error) {
      console.error("Error fetching queries:", error)
      setError("Failed to fetch queries. Please make sure your backend server is running.")
    } finally {
      setLoading(false)
    }
  }

  const refreshQueries = async () => {
    setRefreshing(true)
    try {
      await fetchQueries()
    } finally {
      setRefreshing(false)
    }
  }

  // Format date string
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Initial fetch
  useEffect(() => {
    fetchQueries()
  }, [])

  if (loading && !refreshing) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <span style={styles.loadingText}>Loading queries...</span>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Customer Support Queries</h1>
        <button
          onClick={refreshQueries}
          disabled={refreshing}
          style={{
            ...styles.refreshButton,
            ...(refreshing ? styles.buttonDisabled : {}),
          }}
        >
          {refreshing ? (
            <>
              <span style={styles.refreshIcon}></span>
              Refreshing...
            </>
          ) : (
            "Refresh Queries"
          )}
        </button>
      </div>

      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, ...styles.totalStat }}>{totalQueries}</div>
          <div style={styles.statLabel}>Total Queries</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, ...styles.pendingStat }}>{pendingQueries}</div>
          <div style={styles.statLabel}>Pending</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNumber, ...styles.resolvedStat }}>{resolvedQueries}</div>
          <div style={styles.statLabel}>Resolved</div>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {queries.length > 0 ? (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Subject</th>
              <th style={styles.th}>Message</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {queries.map((query) => (
              <tr key={query.id}>
                <td style={styles.td}>{query.id}</td>
                <td style={styles.td}>{query.customerName}</td>
                <td style={styles.td}>{query.email}</td>
                <td style={styles.td}>{query.subject}</td>
                <td style={{ ...styles.td, ...styles.messageCell }} title={query.message}>
                  {query.message}
                </td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.statusBadge,
                      ...(query.status === "RESOLVED" ? styles.resolvedStatus : styles.pendingStatus),
                    }}
                  >
                    {query.status || "PENDING"}
                  </span>
                </td>
                <td style={styles.td}>{formatDate(query.createdAt)}</td>
                <td style={styles.td}>
                  {(!query.status || query.status === "PENDING") && (
                    <button
                      style={{ ...styles.actionButton, ...styles.resolveButton }}
                      onClick={() => alert("Mark as resolved functionality would go here")}
                    >
                      Resolve
                    </button>
                  )}
                  <button
                    style={{ ...styles.actionButton, ...styles.deleteButton }}
                    onClick={() => alert("Delete functionality would go here")}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div style={styles.noQueries}>
          No queries found. When customers submit support requests, they will appear here.
        </div>
      )}
    </div>
  )
}