//"use client"

import { useState, useEffect } from "react"
import ProfileHeader from "./ProfileHeader"
import PersonalDetails from "./PersonalDetails"
import OrderHistory from "./OrderHistory"
import AccountSettings from "./AccountSettings"
import { userService } from "../../services/userService"

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("personal")

  //  user data - in a real app, this would come from your API
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get email from localStorage
        const userEmail = localStorage.getItem('email')
        if (!userEmail) {
          throw new Error('User not logged in')
        }

        const response = await userService.getUserProfile(userEmail)
        // Check if the response has a data property
        const userData = response.data || response
        setUserData(userData)
        setError(null)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  //  order history
  const [orders, setOrders] = useState([
    {
      id: "ORD-001",
      date: "2025-03-15",
      total: 10300 ,
      status: "Delivered",
      items: 3,
    },
    {
      id: "ORD-002",
      date: "2025-04-02",
      total: 120000,
      status: "Delivered",
      items: 2,
    },
    {
      id: "ORD-003",
      date: "2025-03-18",
      total: 249599,
      status: "Delivered",
      items: 1,
    },
  ])

  const handleUpdateProfile = async (updatedData) => {
    try {
      setLoading(true)

      // If this is a refresh data request
      if (updatedData.refreshData) {
        const freshData = await userService.getUserProfile(updatedData.email)
        if (freshData) {
          setUserData(freshData)
          setError(null)
          return { data: freshData }
        }
        throw new Error('Failed to refresh user data')
      }

      const response = await userService.updateUserDetails({
        email: userData.email,
        ...updatedData
      })
      
      // Handle email update specially
      if (updatedData.newEmail) {
        if (response?.data?.message?.includes('successfully')) {
          const { user: updatedUser } = response.data
          setUserData(updatedUser)
          return response
        }
        throw new Error('Failed to update email')
      }
      
      // Handle password update specially
      if (updatedData.password) {
        if (response?.data?.message?.includes('successfully')) {
          return response
        }
        throw new Error('Failed to update password')
      }
      
      // Update the userData with the response for other updates
      if (response?.data) {
        setUserData(response.data)
        setError(null)
        alert('Profile updated successfully!')
      } else {
        throw new Error('Failed to update profile')
      }
    } catch (err) {
      setError(err.message)
      alert(err.response?.data || err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (error) {
    return <div className="error">{error}</div>
  }

  if (!userData) {
    return <div className="error">No user data available</div>
  }

  return (
    <div className="user-profile-container">
      <ProfileHeader
        name={userData.name}
        email={userData.email}
        avatar={userData.avatar}
        memberSince={userData.memberSince}
      />

      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === "personal" ? "active" : ""}`}
          onClick={() => setActiveTab("personal")}
        >
          Personal Details
        </button>
        <button
          className={`tab-button ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          Order History
        </button>
        <button
          className={`tab-button ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          Account Settings
        </button>
      </div>

      <div className="profile-content">
        {activeTab === "personal" && <PersonalDetails userData={userData} onUpdate={handleUpdateProfile} />}

        {activeTab === "orders" && <OrderHistory orders={orders} />}

        {activeTab === "settings" && <AccountSettings 
          email={userData?.email} 
          userData={userData}
          onUpdate={handleUpdateProfile} 
        />}
      </div>
    </div>
  )
}

export default UserProfile;

