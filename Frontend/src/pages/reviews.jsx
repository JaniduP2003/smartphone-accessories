"use client"

import { useState, useEffect } from "react"
import { Search, Calendar, ChevronDown, Send, MoreVertical } from "lucide-react"
import Navbar from "../components/Navbar" // Adjust path if needed
import "./reviews.scss"

import { IoSettingsSharp } from "react-icons/io5";


// Mock reviews data (replace with your actual data or import)
const getRandomDate = () => {
  const now = new Date()
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(now.getMonth() - 3)
  return new Date(threeMonthsAgo.getTime() + Math.random() * (now.getTime() - threeMonthsAgo.getTime())).toISOString()
}

const mockReviews = [
  // Mobile Phones
  {
    id: "M001",
    category: "mobile",
    productName: "Galaxy S23 Ultra",
    content: "Amazing camera quality and battery life.",
    userId: "user_573",
    date: getRandomDate(),
    sentiment: 0.9,
  },
  {
    id: "M002",
    category: "mobile",
    productName: "iPhone 14 Pro",
    content: "Sleek design and smooth performance, but battery could be better.",
    userId: "user_112",
    date: getRandomDate(),
    sentiment: 0.7,
  },
  {
    id: "M003",
    category: "mobile",
    productName: "OnePlus 11",
    content: "Fast charging and great display, but camera needs improvement.",
    userId: "user_234",
    date: getRandomDate(),
    sentiment: 0.6,
  },

  // Earbuds
  {
    id: "E001",
    category: "earbuds",
    productName: "Sony WF-1000XM4",
    content: "Excellent noise cancellation and sound quality.",
    userId: "user_876",
    date: getRandomDate(),
    sentiment: 0.85,
  },
  {
    id: "E002",
    category: "earbuds",
    productName: "Apple AirPods Pro",
    content: "Very comfortable and seamless integration with Apple devices.",
    userId: "user_345",
    date: getRandomDate(),
    sentiment: 0.8,
  },
  {
    id: "E003",
    category: "earbuds",
    productName: "Jabra Elite 7 Pro",
    content: "Good battery life and clear call quality.",
    userId: "user_567",
    date: getRandomDate(),
    sentiment: 0.75,
  },

  // Storage
  {
    id: "S001",
    category: "storage",
    productName: "Samsung T7 Portable SSD",
    content: "Fast transfer speeds and compact design.",
    userId: "user_678",
    date: getRandomDate(),
    sentiment: 0.9,
  },
  {
    id: "S002",
    category: "storage",
    productName: "SanDisk Extreme Pro SD Card",
    content: "Reliable and perfect for photography needs.",
    userId: "user_890",
    date: getRandomDate(),
    sentiment: 0.85,
  },
  {
    id: "S003",
    category: "storage",
    productName: "WD My Passport External HDD",
    content: "Affordable storage option but a bit slow compared to SSDs.",
    userId: "user_123",
    date: getRandomDate(),
    sentiment: 0.6,
  },
]


export default function Reviews() {
  const [activeCategory, setActiveCategory] = useState("mobile")
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilterOpen, setDateFilterOpen] = useState(false)
  const [dateFilter, setDateFilter] = useState("All time")
  const [filteredReviews, setFilteredReviews] = useState([])

  const categories = [
    { id: "mobile", name: "Mobile Phones" },
    { id: "earbuds", name: "Earbuds" },
    { id: "storage", name: "Storage" },
    { id: "laptop", name: "Laptops" },
  ]
  const dateOptions = ["All time", "Today", "Last 7 days", "Last 30 days", "This month", "Last month"]

  useEffect(() => {
    let filtered = mockReviews.filter((review) => review.category === activeCategory)
    if (searchTerm) {
      filtered = filtered.filter((review) => review.productName.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    if (dateFilter !== "All time") {
      const now = new Date()
      let cutoffDate = new Date()
      switch (dateFilter) {
        case "Today":
          cutoffDate.setHours(0, 0, 0, 0)
          break
        case "Last 7 days":
          cutoffDate.setDate(now.getDate() - 7)
          break
        case "Last 30 days":
          cutoffDate.setDate(now.getDate() - 30)
          break
        case "This month":
          cutoffDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case "Last month":
          cutoffDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
          const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate()
          cutoffDate.setDate(lastDayOfLastMonth)
          break
        default:
          break
      }
      filtered = filtered.filter((review) => new Date(review.date) >= cutoffDate)
    }
    setFilteredReviews(filtered)
  }, [activeCategory, searchTerm, dateFilter])

  return (
    <div className="reviews__page">

        <header>
                  <IoSettingsSharp />
                </header>

      <Navbar />

      <main className="page-content">
        <div className="panel">
          <div className="panel__header">
            <h1 className="panel__title">Product Reviews</h1>
            <div className="panel__filters">
              <div className="panel__search">
                <Search size={18} />
                <input
                  type="text"
                  placeholder="Search by product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="panel__dropdown">
                <button className="panel__dropdown-btn" onClick={() => setDateFilterOpen(!dateFilterOpen)}>
                  <Calendar size={18} />
                  {dateFilter}
                  <ChevronDown size={16} />
                </button>
                <div className={`panel__dropdown-content${dateFilterOpen ? " open" : ""}`}>
                  {dateOptions.map((option) => (
                    <button
                      key={option}
                      className="panel__dropdown-item"
                      onClick={() => {
                        setDateFilter(option)
                        setDateFilterOpen(false)
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="panel__tabs">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`panel__tab${activeCategory === category.id ? " active" : ""}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="panel__content">
            <ReviewsTable reviews={filteredReviews} />
          </div>
        </div>
      </main>
    </div>
  )
}

function ReviewsTable({ reviews }) {
  const [replies, setReplies] = useState({})
  const [replyInputs, setReplyInputs] = useState({})

  const handleReplyChange = (reviewId, value) => setReplyInputs({ ...replyInputs, [reviewId]: value })
  const handleReplySubmit = (e, reviewId) => {
    e.preventDefault()
    if (replyInputs[reviewId]?.trim()) {
      setReplies({ ...replies, [reviewId]: replyInputs[reviewId] })
      setReplyInputs({ ...replyInputs, [reviewId]: "" })
    }
  }
  const getSentimentBadge = (sentiment) => {
    let status = "neutral", label = "Neutral"
    if (sentiment > 0.5) { status = "positive"; label = "Positive" }
    else if (sentiment < -0.5) { status = "negative"; label = "Negative" }
    return <span className={`badge badge--${status}`}>{label}</span>
  }

  if (reviews.length === 0) {
    return (
      <div className="table__empty">
        <h3>No reviews found</h3>
        <p>Try changing your filters or check back later for new reviews.</p>
      </div>
    )
  }

  return (
    <div className="table__container">
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Review</th>
            <th>Reply</th>
            <th>User</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => (
            <tr key={review.id}>
              <td>{review.id}</td>
              <td>{review.productName}</td>
              <td>
                <div className="table__review-content">
                  {getSentimentBadge(review.sentiment)}
                  <p>{review.content}</p>
                </div>
              </td>
              <td>
                <div className="table__reply">
                  {replies[review.id] && <p className="table__reply-text">"{replies[review.id]}"</p>}
                  <form className="table__reply-form" onSubmit={(e) => handleReplySubmit(e, review.id)}>
                    <input
                      className="table__reply-input"
                      type="text"
                      placeholder="Write a reply..."
                      value={replyInputs[review.id] || ""}
                      onChange={(e) => handleReplyChange(review.id, e.target.value)}
                    />
                    <button
                      className="table__reply-btn"
                      type="submit"
                      disabled={!replyInputs[review.id]?.trim()}
                    >
                      <Send size={14} />
                    </button>
                  </form>
                </div>
              </td>
              <td>{review.userId}</td>
              <td>{new Date(review.date).toLocaleDateString()}</td>
              <td>
                <button className="table__action-btn"><MoreVertical size={18} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
