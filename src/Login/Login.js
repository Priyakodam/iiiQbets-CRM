import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { auth, db } from '../Firebase/FirebaseConfig';
import { useAuth } from '../Context/AuthContext';
import logo from "../Img/logocrm.png";
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    // Admin login check
    if (email === 'admin@gmail.com' && password === 'admin@123') {
      login({
        uid: 'admin',
        email: 'admin@gmail.com',
        name: 'Admin',
      });
      navigate('/dashboard'); // Navigate to the admin dashboard
      setIsSubmitting(false);
      return;
    }

    try {
      // Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Fetch user data from Firestore
      const userDoc = await db.collection('users').doc(user.uid).get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        const role = userData.role; // Fetch the role field from Firestore
        
        // Log in and navigate based on role
        login({
          uid: user.uid,
          email: user.email,
          name: userData.name || 'Employee',
          role: role,
        });

        // Role-based navigation
        if (role === 'Manager') {
          navigate('/m-dashboard'); // Navigate to manager dashboard
        } else if (role === 'Employee') {
          navigate('/e-dashboard'); // Navigate to employee dashboard
        } else {
          setError('Invalid role.');
        }
      } else {
        setError('No employee record found.');
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = email.trim() !== '' && password.trim() !== '';

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center min-vh-100" id="loginpage">
      <div className="row border rounded-5 p-3 bg-white shadow box-area">
        <div className="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box" style={{ background: '#103cbe' }}>
          <div className="featured-image mb-3">
            <img src={logo} alt="Logo" className="img-fluid" style={{ width: '250px' }} />
          </div>
          <p className="text-white fs-2" style={{ fontFamily: "'Courier New', Courier, monospace", fontWeight: 600 }}>Be Verified</p>
          <small className="text-white text-wrap text-center" style={{ width: '17rem', fontFamily: "'Courier New', Courier, monospace" }}>iiiQ Digital Transformational Services</small>
        </div>
        <div className="col-md-6 right-box">
          <div className="row align-items-center">
            <div className="header-text mb-4">
              <h2 className="text-center">Login</h2>
              <p className="text-center">Access to our dashboard</p>
            </div>
            <form onSubmit={handleLogin}>
              <div className="input-group mb-3">
                <input
                  type="email"
                  className="form-control form-control-lg bg-light fs-6"
                  id="email"
                  name="email"
                  value={email}
                  placeholder="  Email address"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="input-group mb-3">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control form-control-lg bg-light fs-6"
                  id="password"
                  name="password"
                  value={password}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}

              <div className="input-group mb-3">
                <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                  {isSubmitting ? 'Logging in...' : 'Login'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
