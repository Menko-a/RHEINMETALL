import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import './Auth.css'

function AccountSetup() {
  const navigate = useNavigate()
  const [previewUrl, setPreviewUrl] = useState(null)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = (data) => {
    // Handle profile photo - in real app, upload to server
    const formData = {
      ...data,
      photo: previewUrl 
    }
    console.log('Account setup data:', formData)
    // Store user data in sessionStorage
    sessionStorage.setItem('userData', JSON.stringify(formData))
    navigate('/homepage')
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Account Setup</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group photo-upload">
            <label htmlFor="photo">Profile Photo</label>
            <div className="photo-preview">
              {previewUrl ? (
                <img src={previewUrl} alt="Profile preview" className="preview-img" />
              ) : (
                <div className="photo-placeholder">
                  <span>No photo selected</span>
                </div>
              )}
            </div>
            <input
              id="photo"
              type="file"
              accept="image/*"
              {...register('photo', {
                required: 'Profile photo is required'
              })}
              onChange={handlePhotoChange}
            />
            {errors.photo && <span className="error">{errors.photo.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              placeholder="Enter your first name"
              {...register('firstName', {
                required: 'First name is required',
                minLength: {
                  value: 2,
                  message: 'First name must be at least 2 characters'
                }
              })}
            />
            {errors.firstName && <span className="error">{errors.firstName.message}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              placeholder="Enter your last name"
              {...register('lastName', {
                required: 'Last name is required',
                minLength: {
                  value: 2,
                  message: 'Last name must be at least 2 characters'
                }
              })}
            />
            {errors.lastName && <span className="error">{errors.lastName.message}</span>}
          </div>

          <button type="submit" className="btn-primary">Complete Setup</button>
        </form>
      </div>
    </div>
  )
}

export default AccountSetup
