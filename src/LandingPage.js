import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import ChocolateImage from '../src/Images/choc-main.webp';
import ElectronicImage from '../src/Images/electronics-main.webp';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="intro-text">
        <h1>Welcome to SweetNChili!</h1>
        <p>Specializing in selling Chocolates, Drinks, Gums, Chocolate Spreads, and Food Beverages under the Jaafar category, along with upcoming Electronics items.</p>
      </div>
      <div className="categories-container">
        <div className="category chocolate" onClick={() => navigate('/main')}>
          <h2>Jaafar Trading</h2>
          <p>Discover a world of luxurious chocolates!</p>
          <img src={ChocolateImage} alt="Luxurious Chocolates" className="category-image"/>
        </div>
        <div className="category electronics coming-soon">
          <h2>Electronics</h2>
          <p>High-tech gadgets coming soon. Stay tuned!</p>
          <img src={ElectronicImage} alt="Coming Soon Electronics" className="category-image"/>
          <div className="coming-soon-overlay">Coming Soon!</div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
