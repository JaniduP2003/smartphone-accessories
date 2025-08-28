//"use client"

import { useState } from "react"

const PersonalDetails = ({ userData, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    username: userData?.username || '',
    phoneNo: userData?.phoneNo || '',
    address: typeof userData?.address === 'object' ? '' : (userData?.address || '')
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const updatedUserData = {
        email: userData.email, // Required for backend identification
        username: formData.username || userData.username,
        phoneNo: formData.phoneNo || userData.phoneNo,
        address: formData.address || userData.address
      }

      const result = await onUpdate(updatedUserData)
      if (result) {
        setIsEditing(false)
        // Update local form data with the new values
        setFormData({
          username: result.username || updatedUserData.username,
          phoneNo: result.phoneNo || updatedUserData.phoneNo,
          address: result.address || updatedUserData.address
        })
      }
    } catch (error) {
      alert('Failed to update profile: ' + error.message)
    }
  }

  if (isEditing) {
    return (
      <div className="personal-details">
        <div className="section-header">
          <h2>Personal Details</h2>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="username">Full Name</label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNo">Phone Number</label>
            <input type="tel" id="phoneNo" name="phoneNo" value={formData.phoneNo} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea 
              id="address" 
              name="address" 
              value={formData.address} 
              onChange={handleChange}
              rows="3"
            />
          </div>

          

          <div className="form-actions">
            <button type="submit" className="btn-save">
              Save Changes
            </button>
            <button type="button" className="btn-cancel" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="personal-details">
      <div className="section-header">
        <h2>Personal Details</h2>
        <button className="btn-edit" onClick={() => setIsEditing(true)}>
          Edit
        </button>
      </div>

      <div className="details-group">
        <h3>Contact Information</h3>
          <div className="info-item">
            <label>Full Name:</label>
            <span>{userData?.username || 'Not provided'}</span>
          </div>

          <div className="info-item">
            <label>Email:</label>
            <span>{userData?.email || 'Not provided'}</span>
          </div>

          <div className="info-item">
            <label>Phone Number:</label>
            <span>{userData?.phoneNo || 'Not provided'}</span>
          </div>

          <div className="info-item">
            <label>Address:</label>
            <span>{typeof userData?.address === 'object' ? 'Not provided' : (userData?.address || 'Not provided')}</span>
          </div>
        
      </div>
    </div>
  )
}

export default PersonalDetails

