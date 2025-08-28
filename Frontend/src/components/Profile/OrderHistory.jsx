const OrderHistory = ({ orders }) => {
    return (
      <div className="order-history">
        <div className="section-header">
          <h2>Order History</h2>
        </div>
  
        {orders.length === 0 ? (
          <div className="no-orders">
            <p>You haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-id">
                    <span className="label">Order ID:</span>
                    <span className="value">{order.id}</span>
                  </div>
                  <div className="order-date">
                    <span className="label">Date:</span>
                    <span className="value">{order.date}</span>
                  </div>
                </div>
  
                <div className="order-details">
                  <div className="order-info">
                    <div className="order-total">
                      <span className="label">Total:</span>
                      <span className="value">Rs{order.total.toFixed(2)}</span>
                    </div>
                    <div className="order-items">
                      <span className="label">Items:</span>
                      <span className="value">{order.items}</span>
                    </div>
                    <div className="order-status">
                      <span className="label">Status:</span>
                      <span className={`value status-${order.status.toLowerCase()}`}>{order.status}</span>
                    </div>
                  </div>
  
                  <button className="btn-view-order">View Details</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }
  
  export default OrderHistory
  
  