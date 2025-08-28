import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook
import "../styles/AuthCard.css";

const AuthCard = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [isTokenValidated, setIsTokenValidated] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // Access auth context
  const { 
    login, 
    register, 
    requestPasswordReset, 
    validateResetToken, 
    resetPassword, 
    loading 
  } = useAuth();

  const toggleForm = () => setIsSignUp(!isSignUp);

  // Handle Sign Up
  const handleSignUp = async () => {
    if (!username || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await register({ 
        username, 
        email, 
        password,
        role: 'CUSTOMER' // Default role for signup form
      });
      
      alert("Registration successful! Please sign in.");
      setIsSignUp(false); // Switch to login form
      // Clear form
      setUsername("");
      setEmail("");
      setPassword("");
    } catch (error) {
      alert(error.message || "Registration failed. Please try again.");
    }
  };

  // Handle Sign In
  const handleSignIn = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await login(email, password);
      // Clear form
      setEmail("");
      setPassword("");
      // Navigation is handled by AuthContext
    } catch (error) {
      alert(error.message || "Login failed. Please try again.");
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    try {
      const response = await requestPasswordReset(email);
      alert(response.message || "Password reset email sent successfully!");
    } catch (error) {
      alert(error.error || "Failed to send reset email. Please try again.");
    }
  };

  // Handle token validation
  const handleValidateToken = async () => {
    if (!resetToken) {
      alert("Please enter the reset token from your email.");
      return;
    }

    try {
      const response = await validateResetToken(resetToken);
      if (response.valid) {
        setIsTokenValidated(true);
        alert("Token validated. Please enter your new password.");
      } else {
        alert("Invalid or expired token. Please request a new one.");
      }
    } catch (error) {
      alert(error.error || "Token validation failed.");
    }
  };

  // Handle Reset Password
  const handleResetPassword = async () => {
    if (!resetToken || !password) {
      alert("Please enter both token and new password.");
      return;
    }

    try {
      const response = await resetPassword(resetToken, password);
      alert(response.message || "Password reset successfully!");
      setIsForgotPassword(false); // Close the modal
      setResetToken("");
      setPassword("");
      setIsTokenValidated(false);
    } catch (error) {
      alert(error.error || "Password reset failed. Please try again.");
    }
  };

  return (
    <div className={`cont ${isSignUp ? "s--signup" : ""}`}>
      {/* Sign In Form */}
      <div className="form sign-in">
        <h2>Welcome</h2>
        <label>
          <span>Email</span>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            disabled={loading}
          />
        </label>
        <label>
          <span>Password</span>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            disabled={loading}
          />
        </label>
        <p className="forgot-pass" onClick={() => setIsForgotPassword(true)}>
          Forgot password?
        </p>
        <button 
          type="button" 
          className="submit" 
          onClick={handleSignIn}
          disabled={loading}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </div>

      {/* Forgot Password Modal */}
      {isForgotPassword && (
        <div className="forgot-password-modal">
          <div className="modal-content">
            <h2>Reset Password</h2>
            
            {!isTokenValidated ? (
              <>
                <p>Enter your email to receive a password reset link.</p>
                <label>
                  <span>Email</span>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    disabled={loading}
                  />
                </label>
                <button 
                  type="button" 
                  className="submit" 
                  onClick={handleForgotPassword}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>
                
                <p>Already have a reset token?</p>
                <label>
                  <span>Reset Token</span>
                  <input 
                    type="text" 
                    value={resetToken} 
                    onChange={(e) => setResetToken(e.target.value)} 
                    disabled={loading}
                  />
                </label>
                <button 
                  type="button" 
                  className="submit" 
                  onClick={handleValidateToken}
                  disabled={loading}
                >
                  Validate Token
                </button>
              </>
            ) : (
              <>
                <p>Enter your new password below.</p>
                <label>
                  <span>New Password</span>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    disabled={loading}
                  />
                </label>
                <button 
                  type="button" 
                  className="submit" 
                  onClick={handleResetPassword}
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </>
            )}
            
            <button 
              type="button" 
              className="cancel" 
              onClick={() => {
                setIsForgotPassword(false);
                setResetToken("");
                setIsTokenValidated(false);
              }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Sign Up Toggle */}
      <div className="sub-cont">
        <div className="img">
          <div className="img__text m--up">
            <h3>Don't have an account? Please Sign up!</h3>
          </div>
          <div className="img__text m--in">
            <h3>If you already have an account, just sign in.</h3>
          </div>
          <div className="img__btn" onClick={toggleForm}>
            <span className="m--up">Sign Up</span>
            <span className="m--in">Sign In</span>
          </div>
        </div>

        {/* Sign Up Form */}
        <div className="form sign-up">
          <h2>Create your Account</h2>
          <label>
            <span>Username</span>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              disabled={loading}
            />
          </label>
          <label>
            <span>Email</span>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              disabled={loading}
            />
          </label>
          <label>
            <span>Password</span>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              disabled={loading}
            />
          </label>
          <button 
            type="button" 
            className="submit" 
            onClick={handleSignUp}
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthCard;