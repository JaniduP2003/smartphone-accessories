// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../context/AuthContext';
// import { getProductReviews, addReview, deleteReview, addReply, updateReply, deleteReply } from '../services/reviewService';
// import '../styles/ReviewSection.css';

// const ReviewSection = ({ productId }) => {
//   const { user, isAuthenticated, isCustomer } = useAuth();
//   const [reviews, setReviews] = useState([]);
//   const [newReview, setNewReview] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const [replyContent, setReplyContent] = useState('');
//   const [editingReplyId, setEditingReplyId] = useState(null);
//   const [replyingToId, setReplyingToId] = useState(null);

//   useEffect(() => {
//     if (productId) {
//       fetchReviews();
//     }
//   }, [productId]);

//   const fetchReviews = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await getProductReviews(productId);
//       setReviews(response.content || []);
//     } catch (err) {
//       console.error('Error fetching reviews:', err);
//       setError(err.response?.data?.message || 'Failed to load reviews. Please try again later.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmitReview = async (e) => {
//     e.preventDefault();
    
//     if (!isAuthenticated) {
//       alert('Please log in to leave a review');
//       return;
//     }

//     if (!isCustomer) {
//       alert('Only customers can submit reviews. Please log in with a customer account.');
//       return;
//     }

//     const customerId = localStorage.getItem('customerId');
//     if (!customerId) {
//       alert('Invalid user session. Please log in again.');
//       return;
//     }

//     if (!newReview.trim()) {
//       alert('Please enter a review');
//       return;
//     }

//     try {
//       const response = await addReview(customerId, productId, newReview.trim());
//       setReviews([response, ...reviews]);
//       setNewReview('');
//       setIsExpanded(false);
//     } catch (err) {
//       console.error('Review submission error:', err);
//       if (err.response?.status === 401) {
//         alert('Your session has expired. Please log in again.');
//       } else if (err.response?.status === 403) {
//         alert('You do not have permission to submit a review. Please log in with a customer account.');
//       } else {
//         alert(err.response?.data?.message || 'Failed to submit review. Please try again.');
//       }
//     }
//   };

//   const handleDeleteReview = async (reviewId) => {
//     if (!isAuthenticated) {
//       alert('Please log in to delete your review');
//       return;
//     }

//     const customerId = localStorage.getItem('customerId');
//     if (!customerId) {
//       alert('Invalid user session. Please log in again.');
//       return;
//     }

//     if (!window.confirm('Are you sure you want to delete this review?')) {
//       return;
//     }

//     try {
//       await deleteReview(reviewId, customerId);
//       setReviews(reviews.filter(review => review.reviewId !== reviewId));
//     } catch (err) {
//       console.error('Delete review error:', err);
//       if (err.response?.status === 401) {
//         alert('Your session has expired. Please log in again.');
//       } else if (err.response?.status === 403) {
//         alert('You can only delete your own reviews.');
//       } else {
//         alert(err.response?.data?.message || 'Failed to delete review. Please try again.');
//       }
//     }
//   };

//   const handleSubmitReply = async (reviewId) => {
//     if (!isAuthenticated) {
//       alert('Please log in to reply to a review');
//       return;
//     }

//     if (!replyContent.trim()) {
//       alert('Please enter a reply');
//       return;
//     }

//     try {
//       const response = await addReply(reviewId, replyContent.trim());
//       setReviews(reviews.map(review => 
//         review.reviewId === reviewId 
//           ? { ...review, reply: response }
//           : review
//       ));
//       setReplyContent('');
//       setReplyingToId(null);
//     } catch (err) {
//       console.error('Reply submission error:', err);
//       alert(err.response?.data?.message || 'Failed to submit reply. Please try again.');
//     }
//   };

//   const handleUpdateReply = async (reviewId, replyId) => {
//     if (!replyContent.trim()) {
//       alert('Please enter a reply');
//       return;
//     }

//     try {
//       const response = await updateReply(reviewId, replyId, replyContent.trim());
//       setReviews(reviews.map(review => 
//         review.reviewId === reviewId 
//           ? { ...review, reply: response }
//           : review
//       ));
//       setReplyContent('');
//       setEditingReplyId(null);
//     } catch (err) {
//       console.error('Reply update error:', err);
//       alert(err.response?.data?.message || 'Failed to update reply. Please try again.');
//     }
//   };

//   const handleDeleteReply = async (reviewId, replyId) => {
//     if (!window.confirm('Are you sure you want to delete this reply?')) {
//       return;
//     }

//     try {
//       await deleteReply(reviewId, replyId);
//       setReviews(reviews.map(review => 
//         review.reviewId === reviewId 
//           ? { ...review, reply: null }
//           : review
//       ));
//     } catch (err) {
//       console.error('Reply deletion error:', err);
//       alert(err.response?.data?.message || 'Failed to delete reply. Please try again.');
//     }
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   if (loading) {
//     return <div className="reviews-loading">Loading reviews...</div>;
//   }

//   if (error) {
//     return <div className="reviews-error">{error}</div>;
//   }

//   return (
//     <div className="review-section">
//       {/* Review Form */}
//       <form onSubmit={handleSubmitReview} className="review-form">
//         <div className="review-input-container">
//           <input
//             type="text"
//             value={newReview}
//             onChange={(e) => setNewReview(e.target.value)}
//             onFocus={() => setIsExpanded(true)}
//             placeholder="Add a review..."
//             className="review-input"
//             maxLength={500}
//           />
//           {isExpanded && (
//             <div className="review-actions">
//               <button 
//                 type="button" 
//                 className="cancel-btn"
//                 onClick={() => {
//                   setIsExpanded(false);
//                   setNewReview('');
//                 }}
//               >
//                 Cancel
//               </button>
//               <button 
//                 type="submit" 
//                 className="submit-review-btn"
//                 disabled={!newReview.trim()}
//               >
//                 Comment
//               </button>
//             </div>
//           )}
//         </div>
//       </form>

//       {/* Reviews List */}
//       <div className="reviews-list">
//         {reviews.length === 0 ? (
//           <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
//         ) : (
//           reviews.map((review) => (
//             <div key={review.reviewId} className="review-card">
//               <div className="review-header">
//                 <div className="reviewer-info">
//                   <span className="reviewer-name">{review.customerUsername}</span>
//                   <span className="review-date">{formatDate(review.dateCreated)}</span>
//                 </div>
//                 {isAuthenticated && user.customerId === review.customerId && (
//                   <button
//                     onClick={() => handleDeleteReview(review.reviewId)}
//                     className="delete-review-btn"
//                   >
//                     Delete
//                   </button>
//                 )}
//               </div>
//               <p className="review-content">{review.description}</p>
              
//               {/* Reply Section */}
//               {review.reply && (
//                 <div className="reply-section">
//                   <div className="reply-header">
//                     <span className="reply-label">Admin Reply</span>
//                     <span className="reply-date">{formatDate(review.reply.dateCreated)}</span>
//                   </div>
//                   <p className="reply-content">{review.reply.content}</p>
//                   {isAuthenticated && user.role === 'ADMIN' && (
//                     <div className="reply-actions">
//                       <button
//                         onClick={() => {
//                           setEditingReplyId(review.reply.replyId);
//                           setReplyContent(review.reply.content);
//                         }}
//                         className="edit-reply-btn"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDeleteReply(review.reviewId, review.reply.replyId)}
//                         className="delete-reply-btn"
//                       >
//                         Delete
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Reply Form for Admins */}
//               {isAuthenticated && user.role === 'ADMIN' && !review.reply && (
//                 <div className="reply-form">
//                   {replyingToId === review.reviewId ? (
//                     <>
//                       <textarea
//                         value={replyContent}
//                         onChange={(e) => setReplyContent(e.target.value)}
//                         placeholder="Write a reply..."
//                         className="reply-input"
//                         maxLength={500}
//                       />
//                       <div className="reply-form-actions">
//                         <button
//                           onClick={() => {
//                             setReplyingToId(null);
//                             setReplyContent('');
//                           }}
//                           className="cancel-reply-btn"
//                         >
//                           Cancel
//                         </button>
//                         <button
//                           onClick={() => handleSubmitReply(review.reviewId)}
//                           disabled={!replyContent.trim()}
//                           className="submit-reply-btn"
//                         >
//                           Reply
//                         </button>
//                       </div>
//                     </>
//                   ) : (
//                     <button
//                       onClick={() => setReplyingToId(review.reviewId)}
//                       className="add-reply-btn"
//                     >
//                       Reply to Review
//                     </button>
//                   )}
//                 </div>
//               )}

//               {/* Edit Reply Form */}
//               {editingReplyId === review.reply?.replyId && (
//                 <div className="edit-reply-form">
//                   <textarea
//                     value={replyContent}
//                     onChange={(e) => setReplyContent(e.target.value)}
//                     placeholder="Edit your reply..."
//                     className="reply-input"
//                     maxLength={500}
//                   />
//                   <div className="reply-form-actions">
//                     <button
//                       onClick={() => {
//                         setEditingReplyId(null);
//                         setReplyContent('');
//                       }}
//                       className="cancel-reply-btn"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={() => handleUpdateReply(review.reviewId, review.reply.replyId)}
//                       disabled={!replyContent.trim()}
//                       className="submit-reply-btn"
//                     >
//                       Update Reply
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default ReviewSection; 


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProductReviews, addReview, deleteReview, addReply, updateReply, deleteReply } from '../services/reviewService';
import '../styles/ReviewSection.css';

const ReviewSection = () => {
  // Extract productId directly from URL params
  const { id: productId } = useParams();
  
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [replyingToId, setReplyingToId] = useState(null);

  // Get auth information directly from localStorage
  const getAuthInfo = () => {
    return {
      isAuthenticated: !!localStorage.getItem('token'),
      customerId: localStorage.getItem('customerId'),
      role: localStorage.getItem('role'),
      username: localStorage.getItem('username')
    };
  };

  // Check if user is a customer
  const isCustomer = () => {
    return localStorage.getItem('role') === 'CUSTOMER';
  };

  // Check if user is admin
  const isAdmin = () => {
    return localStorage.getItem('role') === 'ADMIN';
  };

  useEffect(() => {
    if (productId) {
      fetchReviews();
    } else {
      setError('Product ID not found in URL');
      setLoading(false);
    }
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getProductReviews(productId);
      setReviews(response.content || []);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError(err.response?.data?.message || 'Failed to load reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    const { isAuthenticated, customerId } = getAuthInfo();
    
    if (!isAuthenticated) {
      alert('Please log in to leave a review');
      return;
    }

    if (!isCustomer()) {
      alert('Only customers can submit reviews. Please log in with a customer account.');
      return;
    }

    if (!customerId) {
      alert('Invalid user session. Please log in again.');
      return;
    }

    if (!newReview.trim()) {
      alert('Please enter a review');
      return;
    }

    try {
      // Make sure we're passing a clean integer ID
      const response = await addReview(
        parseInt(customerId, 10), 
        parseInt(productId, 10), 
        newReview.trim()
      );
      
      setReviews([response, ...reviews]);
      setNewReview('');
      setIsExpanded(false);
    } catch (err) {
      console.error('Review submission error:', err);
      if (err.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        // Optionally redirect to login page here
      } else if (err.response?.status === 403) {
        alert('You do not have permission to submit a review. Please log in with a customer account.');
      } else {
        alert(err.response?.data?.message || 'Failed to submit review. Please try again.');
      }
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const { isAuthenticated, customerId } = getAuthInfo();
    
    if (!isAuthenticated) {
      alert('Please log in to delete your review');
      return;
    }

    if (!customerId) {
      alert('Invalid user session. Please log in again.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await deleteReview(reviewId, parseInt(customerId, 10));
      setReviews(reviews.filter(review => review.reviewId !== reviewId));
    } catch (err) {
      console.error('Delete review error:', err);
      if (err.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
      } else if (err.response?.status === 403) {
        alert('You can only delete your own reviews.');
      } else {
        alert(err.response?.data?.message || 'Failed to delete review. Please try again.');
      }
    }
  };

  const handleSubmitReply = async (reviewId) => {
    const { isAuthenticated } = getAuthInfo();
    
    if (!isAuthenticated) {
      alert('Please log in to reply to a review');
      return;
    }

    if (!isAdmin()) {
      alert('Only administrators can reply to reviews');
      return;
    }

    if (!replyContent.trim()) {
      alert('Please enter a reply');
      return;
    }

    try {
      const response = await addReply(reviewId, replyContent.trim());
      setReviews(reviews.map(review => 
        review.reviewId === reviewId 
          ? { ...review, reply: response }
          : review
      ));
      setReplyContent('');
      setReplyingToId(null);
    } catch (err) {
      console.error('Reply submission error:', err);
      alert(err.response?.data?.message || 'Failed to submit reply. Please try again.');
    }
  };

  const handleUpdateReply = async (reviewId, replyId) => {
    if (!replyContent.trim()) {
      alert('Please enter a reply');
      return;
    }

    try {
      const response = await updateReply(reviewId, replyId, replyContent.trim());
      setReviews(reviews.map(review => 
        review.reviewId === reviewId 
          ? { ...review, reply: response }
          : review
      ));
      setReplyContent('');
      setEditingReplyId(null);
    } catch (err) {
      console.error('Reply update error:', err);
      alert(err.response?.data?.message || 'Failed to update reply. Please try again.');
    }
  };

  const handleDeleteReply = async (reviewId, replyId) => {
    if (!window.confirm('Are you sure you want to delete this reply?')) {
      return;
    }

    try {
      await deleteReply(reviewId, replyId);
      setReviews(reviews.map(review => 
        review.reviewId === reviewId 
          ? { ...review, reply: null }
          : review
      ));
    } catch (err) {
      console.error('Reply deletion error:', err);
      alert(err.response?.data?.message || 'Failed to delete reply. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="reviews-loading">Loading reviews...</div>;
  }

  if (error) {
    return <div className="reviews-error">{error}</div>;
  }

  const { isAuthenticated } = getAuthInfo();

  return (
    <div className="review-section">
      {/* Review Form */}
      <form onSubmit={handleSubmitReview} className="review-form">
        <div className="review-input-container">
          <input
            type="text"
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder="Add a review..."
            className="review-input"
            maxLength={500}
          />
          {isExpanded && (
            <div className="review-actions">
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setIsExpanded(false);
                  setNewReview('');
                }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="submit-review-btn"
                disabled={!newReview.trim()}
              >
                Comment
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Reviews List */}
      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.reviewId} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <span className="reviewer-name">{review.customerUsername}</span>
                  <span className="review-date">{formatDate(review.dateCreated)}</span>
                </div>
                {isAuthenticated && localStorage.getItem('customerId') === review.customerId.toString() && (
                  <button
                    onClick={() => handleDeleteReview(review.reviewId)}
                    className="delete-review-btn"
                  >
                    Delete
                  </button>
                )}
              </div>
              <p className="review-content">{review.description}</p>
              
              {/* Reply Section */}
              {review.reply && (
                <div className="reply-section">
                  <div className="reply-header">
                    <span className="reply-label">Admin Reply</span>
                    <span className="reply-date">{formatDate(review.reply.dateCreated)}</span>
                  </div>
                  <p className="reply-content">{review.reply.content}</p>
                  {isAuthenticated && isAdmin() && (
                    <div className="reply-actions">
                      <button
                        onClick={() => {
                          setEditingReplyId(review.reply.replyId);
                          setReplyContent(review.reply.content);
                        }}
                        className="edit-reply-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReply(review.reviewId, review.reply.replyId)}
                        className="delete-reply-btn"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Reply Form for Admins */}
              {isAuthenticated && isAdmin() && !review.reply && (
                <div className="reply-form">
                  {replyingToId === review.reviewId ? (
                    <>
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Write a reply..."
                        className="reply-input"
                        maxLength={500}
                      />
                      <div className="reply-form-actions">
                        <button
                          onClick={() => {
                            setReplyingToId(null);
                            setReplyContent('');
                          }}
                          className="cancel-reply-btn"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSubmitReply(review.reviewId)}
                          disabled={!replyContent.trim()}
                          className="submit-reply-btn"
                        >
                          Reply
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      onClick={() => setReplyingToId(review.reviewId)}
                      className="add-reply-btn"
                    >
                      Reply to Review
                    </button>
                  )}
                </div>
              )}

              {/* Edit Reply Form */}
              {editingReplyId === review.reply?.replyId && (
                <div className="edit-reply-form">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Edit your reply..."
                    className="reply-input"
                    maxLength={500}
                  />
                  <div className="reply-form-actions">
                    <button
                      onClick={() => {
                        setEditingReplyId(null);
                        setReplyContent('');
                      }}
                      className="cancel-reply-btn"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleUpdateReply(review.reviewId, review.reply.replyId)}
                      disabled={!replyContent.trim()}
                      className="submit-reply-btn"
                    >
                      Update Reply
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;