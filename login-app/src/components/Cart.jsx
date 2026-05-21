import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext.jsx'
import './Auth.css'

function Cart() {
  const navigate = useNavigate()
  const [cart, setCart] = useState([])
  const [userData, setUserData] = useState(null)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const storedUserData = sessionStorage.getItem('userData')
    const registeredEmail = sessionStorage.getItem('registeredEmail')
    
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData))
    } else if (registeredEmail) {
      setUserData({ email: registeredEmail })
    } else {
      navigate('/login')
    }

    // Load cart from sessionStorage
    const storedCart = sessionStorage.getItem('cart')
    if (storedCart) {
      setCart(JSON.parse(storedCart))
    }
  }, [navigate])

  const location = useLocation()

  // auto checkout when navigated via Buy Now
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const buyNow = params.get('buyNow') === 'true'
    if (buyNow && cart.length > 0) {
      // small delay so UI updates before alert
      setTimeout(() => {
        handleCheckout()
      }, 300)
    }
  }, [location.search, cart])

  const removeFromCart = (index) => {
    const newCart = [...cart]
    newCart.splice(index, 1)
    setCart(newCart)
    sessionStorage.setItem('cart', JSON.stringify(newCart))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0)
  }

  const handleCheckout = () => {
    alert(`Checkout successful! Total: $${getTotalPrice().toLocaleString()}`)
    setCart([])
    sessionStorage.removeItem('cart')
    navigate('/homepage')
  }

  const handleLogout = () => {
    sessionStorage.removeItem('userData')
    sessionStorage.removeItem('registeredEmail')
    sessionStorage.removeItem('cart')
    navigate('/login')
  }

  if (!userData) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>🛒 Your Cart</h1>
        </div>
        <div style={styles.headerRight}>
          <button 
            onClick={toggleTheme} 
            style={styles.themeButton}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button onClick={handleLogout} style={styles.logoutButton}>Logout</button>
        </div>
      </header>

      {/* Main Content */}
      <div style={styles.content}>
        <button 
          onClick={() => navigate('/homepage')}
          style={styles.backButton}
        >
          ← Back to Shopping
        </button>

        <div style={styles.cartContainer}>
          {cart.length === 0 ? (
            <p style={styles.emptyMessage}>Your cart is empty</p>
          ) : (
            <>
              <div style={styles.cartItems}>
                {cart.map((item, index) => (
                  <div key={index} style={styles.cartItem}>
                    <div style={styles.itemImage}>
                      <img 
                        src={item.image} 
                        alt={item.name}
                        style={{maxWidth: '80px', maxHeight: '80px', objectFit: 'contain'}}
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                      />
                    </div>
                    <div style={styles.itemDetails}>
                      <h3 style={styles.itemName}>{item.name}</h3>
                      <p style={styles.itemCategory}>{item.category} - {item.era}</p>
                      <p style={styles.itemRarity}>{item.rarity}</p>
                    </div>
                    <div style={styles.itemPrice}>
                      <span style={styles.price}>💰 {item.price.toLocaleString()}</span>
                    </div>
                    <button 
                      onClick={() => removeFromCart(index)}
                      style={styles.removeButton}
                      title="Remove from cart"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              <div style={styles.cartSummary}>
                <div style={styles.totalRow}>
                  <span>Subtotal:</span>
                  <span>💰 {getTotalPrice().toLocaleString()}</span>
                </div>
                <div style={styles.totalRow}>
                  <span>Items:</span>
                  <span>{cart.length}</span>
                </div>
                <div style={{...styles.totalRow, ...styles.grandTotal}}>
                  <span>Total:</span>
                  <span>💰 {getTotalPrice().toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                style={styles.checkoutButton}
              >
                Proceed to Checkout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: 'var(--bg-primary)',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    backgroundColor: 'var(--bg-secondary)',
    borderBottom: '3px solid var(--accent-color)',
    backdropFilter: 'blur(10px)',
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    color: 'var(--accent-color)',
    fontSize: '28px',
    margin: 0,
    textTransform: 'uppercase',
    letterSpacing: '2px',
    fontWeight: 800,
  },
  headerRight: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  themeButton: {
    padding: '10px',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '50%',
    width: '44px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  logoutButton: {
    padding: '10px 20px',
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  content: {
    flex: 1,
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
  },
  backButton: {
    padding: '12px 20px',
    marginBottom: '30px',
    backgroundColor: 'var(--card-bg)',
    color: 'var(--text-primary)',
    border: '2px solid var(--accent-color)',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  cartContainer: {
    backgroundColor: 'var(--card-bg)',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    border: '1px solid var(--border-color)',
  },
  emptyMessage: {
    textAlign: 'center',
    color: 'var(--text-secondary)',
    fontSize: '18px',
    padding: '40px 0',
  },
  cartItems: {
    marginBottom: '30px',
  },
  cartItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '20px',
    marginBottom: '15px',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
  },
  itemImage: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100px',
    height: '100px',
    backgroundColor: 'var(--bg-primary)',
    borderRadius: '8px',
    flexShrink: 0,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    color: 'var(--text-primary)',
    margin: '0 0 8px 0',
    fontSize: '18px',
    fontWeight: '600',
  },
  itemCategory: {
    color: 'var(--text-secondary)',
    margin: '0 0 5px 0',
    fontSize: '14px',
  },
  itemRarity: {
    color: 'var(--accent-color)',
    margin: '0',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  itemPrice: {
    marginRight: '20px',
    minWidth: '150px',
    textAlign: 'right',
  },
  price: {
    color: '#ffd700',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  removeButton: {
    padding: '8px 12px',
    backgroundColor: 'transparent',
    color: 'var(--accent-color)',
    border: 'none',
    borderRadius: '50%',
    fontSize: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  cartSummary: {
    backgroundColor: 'var(--bg-primary)',
    borderRadius: '8px',
    padding: '20px',
    marginBottom: '20px',
    border: '1px solid var(--border-color)',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    color: 'var(--text-primary)',
    fontSize: '16px',
  },
  grandTotal: {
    borderTop: '2px solid var(--border-color)',
    paddingTop: '15px',
    marginTop: '15px',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  checkoutButton: {
    width: '100%',
    padding: '15px',
    backgroundColor: 'var(--btn-primary)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textTransform: 'uppercase',
  },
}

export default Cart
