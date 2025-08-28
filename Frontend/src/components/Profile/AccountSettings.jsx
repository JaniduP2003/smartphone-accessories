//"use client"

import { useState } from "react"
import { userService } from "../../services/userService"

const AccountSettings = ({ email, onUpdate, userData }) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [isChangingEmail, setIsChangingEmail] = useState(false)
  const [newEmail, setNewEmail] = useState(email)

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData({
      ...passwordData,
      [name]: value,
    })
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    if (!passwordData.newPassword) {
      alert('Please enter a new password')
      return
    }
    try {
      const result = await onUpdate({
        email: email,
        password: passwordData.newPassword
      })
      if (result && !result.error) {
        setIsChangingPassword(false)
        alert('Password updated successfully!')
        // Clear password fields
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        throw new Error(result.error || 'Failed to update password')
      }
    } catch (error) {
      alert('Failed to update password: ' + error.message)
    }
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!newEmail) {
      alert('Please enter a new email address')
      return
    }
    try {
      // First update the email
      const updateResult = await onUpdate({
        email: email,
        newEmail: newEmail
      })

      if (updateResult?.data?.message?.includes('successfully')) {
        const { newEmail: updatedEmail, token } = updateResult.data;
        
        // Update local storage with new token and email
        if (token) {
          localStorage.setItem('token', token);
        }
        localStorage.setItem('email', updatedEmail);
        
        // Immediately fetch updated user details
        try {
          const userDetailsResult = await userService.getUserProfile(updatedEmail);
          if (userDetailsResult) {
            localStorage.setItem('userData', JSON.stringify(userDetailsResult));
            
            // Update UI
            setIsChangingEmail(false);
            setNewEmail('');
            setEmail(updatedEmail);
            
            // Notify success
            alert('Email updated successfully!');
            
            // Trigger parent component update
            if (onUpdate) {
              onUpdate(userDetailsResult);
            }
          }
        } catch (error) {
          console.error('Error fetching updated user details:', error);
          alert('Email updated but failed to fetch latest details. Please refresh the page.');
        }
      } else {
        throw new Error('Failed to update email')
      }
    } catch (error) {
      alert('Failed to update email: ' + (error.response?.data || error.message))
    }
  }

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await userService.deleteUser(email)
        // Clear local storage and redirect to home/login page
        localStorage.clear()
        window.location.href = '/login'
      } catch (error) {
        alert('Failed to delete account: ' + error.message)
      }
    }
  }

  return (
    <div className="account-settings">
      <div className="section-header">
        <h2>Account Settings</h2>
      </div>

      <div className="settings-section">
        <h3>Email Address</h3>

        {isChangingEmail ? (
          <form onSubmit={handleEmailSubmit} className="edit-form">
            <div className="form-group">
              <label htmlFor="newEmail">New Email Address</label>
              <input
                type="email"
                id="newEmail"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save">
                Update Email
              </button>
              <button type="button" className="btn-cancel" onClick={() => setIsChangingEmail(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="setting-item">
            <div className="setting-value">{email}</div>
            <button className="btn-edit" onClick={() => setIsChangingEmail(true)}>
              Change Email
            </button>
          </div>
        )}
      </div>

      <div className="settings-section">
        <h3>Password</h3>

        {isChangingPassword ? (
          <form onSubmit={handlePasswordSubmit} className="edit-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-save">
                Update Password
              </button>
              <button type="button" className="btn-cancel" onClick={() => setIsChangingPassword(false)}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="setting-item">
            <div className="setting-value">••••••••</div>
            <button className="btn-edit" onClick={() => setIsChangingPassword(true)}>
              Change Password
            </button>
          </div>
        )}
      </div>

      <div className="settings-section">
        <h3>Account Actions</h3>
        <div className="danger-zone">
          <button className="btn-danger">Delete Account</button>
        </div>
      </div>
    </div>
  )
}

export default AccountSettings

 