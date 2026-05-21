import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext.jsx'
import './Homepage.css'
import panzerImg from './Images/panzer IV H.jpg'
import tigerImg from './Images/Tiger II.jpg'
import pantherImg from './Images/Panther II.png'
import pumaImg from './Images/Puma mindset.jpg'
import pumaIFVImg from './Images/Puma IFV.jpg'
import sturmtigerImg from './Images/sturmtiger.jpg'

// German Tanks data
const tankItems = [
  { id: 1, name: 'Panzerkampfwagen IV H', category: 'Medium Tanks', era: 'World War 2', price: 25000, image: panzerImg, rarity: 'Standard' },
  { id: 2, name: 'Panzerkampfwagen Tiger Ausf. B', category: 'Heavy Tanks', era: 'World War 2', price: 85000, image: tigerImg, rarity: 'Premium' },
  { id: 3, name: 'Panzerkampfwagen Panther II', category: 'Medium Tanks', era: 'World War 2', price: 45000, image: pantherImg, rarity: 'Standard' },
  { id: 4, name: 'Sonderkraftfahrzeug 234', category: 'Tank Destroyers', era: 'World War 2', price: 35000, image: pumaImg, rarity: 'Standard' },
  { id: 5, name: 'Puma IFV', category: 'Light Tanks', era: 'Modern', price: 55000, image: pumaIFVImg, rarity: 'Standard' },
  { id: 6, name: 'Sturmmörserwagen 606/4 mit 38 cm RW 61', category: 'Assault Gun', era: 'World War 2', price: 75000, image: sturmtigerImg, rarity: 'Premium' },
]

function Homepage() {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [cart, setCart] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showFilters, setShowFilters] = useState(false)

  const { theme, toggleTheme } = useTheme();

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

  const openModal = (item) => {
    setSelectedItem(item)
    setShowModal(true)
  }

  const closeModal = () => {
    setSelectedItem(null)
    setShowModal(false)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('userData')
    sessionStorage.removeItem('registeredEmail')
    navigate('/login')
  }

  const addToCart = (item) => {
    const newCart = [...cart, item]
    setCart(newCart)
    sessionStorage.setItem('cart', JSON.stringify(newCart))
  }

  const removeFromCart = (index) => {
    const newCart = [...cart]
    newCart.splice(index, 1)
    setCart(newCart)
    sessionStorage.setItem('cart', JSON.stringify(newCart))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price, 0)
  }

  const filteredItems = tankItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory || item.era === selectedCategory
    return matchesSearch && matchesCategory
  })

  const eraOrder = { 'World War 2': 1, 'Cold War': 2, 'Modern': 3 }
  const categoryOrder = ['Light Tanks', 'Medium Tanks', 'Tank Destroyers', 'Assault Gun', 'Heavy Tanks']

  const groupedItems = {}
  categoryOrder.forEach(cat => {
    groupedItems[cat] = filteredItems
      .filter(item => item.category === cat)
      .sort((a, b) => eraOrder[a.era] - eraOrder[b.era])
  })

  const getRarityColor = (rarity) => {
    switch(rarity) {
      case 'Premium': return '#ffd700'
      case 'Standard': return '#26de81'
      default: return '#778ca3'
    }
  }

  const categories = ['All', 'Heavy Tanks', 'Medium Tanks', 'Tank Destroyers', 'Assault Gun', 'Light Tanks', 'Modern', 'World War 2', 'Cold War']

  if (!userData) {
    return <div className="loading">Loading...</div>
  }

  const handleBuyNow = (item) => {
    // replace cart with single item and navigate to cart with buyNow flag
    const buyCart = [item]
    sessionStorage.setItem('cart', JSON.stringify(buyCart))
    navigate('/cart?buyNow=true')
  }

  return (
    <div className="marketplace-container">
      {/* Header */}
      <header className="marketplace-header">
        <div className="header-left">
          <h1>RHEINMETALL</h1>
        </div>
        <div className="header-right">
          <div className="user-profile">
            {userData.photo && (
              <img src={userData.photo} alt="Profile" className="header-profile-photo" />
            )}
            <span>{userData.firstName || userData.email}</span>
          </div>
          <div 
            className="cart-icon"
            onClick={() => navigate('/cart')}
            style={{ cursor: 'pointer' }}
          >
            🛒 <span className="cart-count">{cart.length}</span>
          </div>
          <button 
            onClick={toggleTheme} 
            className="btn-theme-toggle"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button onClick={handleLogout} className="btn-logout">Logout</button>
        </div>
      </header>

      {/* Search and Filter */}
      <div className="search-filter-section">
        <input 
          type="text" 
          placeholder="Search tanks..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button 
          className="filter-toggle-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
        <div className={`category-filters ${showFilters ? 'visible' : ''}`}>
          {categories.map(cat => (
            <button 
              key={cat}
              className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="marketplace-content">
        {/* Items Sections */}
        <div className="items-sections">
          {categoryOrder.map(cat => (
            groupedItems[cat].length > 0 && (
              <div key={cat} className="tank-section">
                <h2 className="section-title">{cat}</h2>
                <div className="tank-row">
                  {groupedItems[cat].map(item => (
                    <div key={item.id} className="item-card tank-card" onClick={() => openModal(item)}>
                      <div className="tank-visual">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="tank-image"
                          onError={(e) => {
                            e.target.style.display = 'none'
                            e.target.nextSibling.style.display = 'flex'
                          }}
                        />
                        <div className={`tank-body ${item.name.toLowerCase().replace(/\s+/g, '-')}`} style={{display: 'none'}}>
                          <div className="tank-turret"></div>
                          <div className="tank-barrel"></div>
                          <div className="tank-tracks"></div>
                        </div>
                      </div>
                      <div className="item-info">
                        <h3>{item.name}</h3>
                        <span 
                          className="item-rarity" 
                          style={{ color: getRarityColor(item.rarity) }}
                        >
                          {item.rarity}
                        </span>
                        <p className="item-category">{item.category} - {item.era}</p>
                        <div className="item-footer">
                          <span className="item-price">💰 {item.price.toLocaleString()}</span>
                          {/* Add to Cart moved to modal; click card to open details */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Item Modal */}
      {showModal && selectedItem && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-image">
              <img src={selectedItem.image} alt={selectedItem.name} onError={(e) => e.target.style.display = 'none'} />
            </div>
            <div className="modal-body">
              <h2>{selectedItem.name}</h2>
              <p className="item-category">{selectedItem.category} - {selectedItem.era}</p>
              <p className="item-rarity">{selectedItem.rarity}</p>
              <p className="item-price-large">💰 {selectedItem.price.toLocaleString()}</p>
              <div className="modal-buttons">
                <button className="btn-buy-now" onClick={() => { handleBuyNow(selectedItem); closeModal() }}>Buy Now</button>
                <button className="btn-add-cart" onClick={() => { addToCart(selectedItem); closeModal() }}>Add to Cart</button>
              </div>
              <button className="modal-close" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="marketplace-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About</h3>
            <p>Created by Thrian Gello440 A. Razonable</p>
          </div>
          <div className="footer-section">
            <h3>Products</h3>
            <ul>
              <li>WW2 Tanks</li>
              <li>Modern Tanks</li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Useful Links</h3>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">About</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Phone: 09481511874</p>
            <p>Email: gello4405@gmail.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 RHEINMETALL. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Homepage
