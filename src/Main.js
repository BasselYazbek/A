import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

const imagePaths = [
  require("../src/Images/chocolate-wallpaper.png"),
  require("../src/Images/chocolate-wallpaper2.jpg"),
  require("../src/Images/energy-drinks-wallpaper.png"),
  require("../src/Images/Bubble_Gum_II_6.jpg"),
  require("../src/Images/spread-choclate-wallpaper.jpg"),
];

const Main = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagePaths.length);
    }, 3000);

    setLoading(false);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div id="main-content">
      <div className="container">
        <div className="jumbotron">
          <img
            src={imagePaths[currentImageIndex]}
            alt="Showcase"
            className="img-responsive d-none d-sm-block col-md-12 col-sm-12 col-xs-12"
          />
        </div>

        <div id="home-tiles" className="row">
          <div className="col-md-4 col-sm-6 col-xs-12">
            <Link to="/chocolate" className="text-decoration-none">
              <div id="chocolate-tile" className="tile">
                <span>Chocolate</span>
              </div>
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 col-xs-12">
            <Link to="/drinks" className="text-decoration-none">
              <div id="drinks-tile" className="tile">
                <span>Drinks</span>
              </div>
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 col-xs-12">
            <Link to="/gum" className="text-decoration-none">
              <div id="gum-tile" className="tile">
                <span>Gum</span>
              </div>
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 col-xs-12">
            <Link to="/chocolateSpreds" className="text-decoration-none">
              <div id="spreads-tile" className="tile">
                <span>Chocolate Spreads and Coffee</span>
              </div>
            </Link>
          </div>
          <div className="col-md-4 col-sm-6 col-xs-12">
            <Link to="/discounts" className="text-decoration-none">
              <div id="discounts-tile" className="tile">
                <span>Special Prices</span>
              </div>
            </Link>
          </div>
          <div className="col-md-4 col-sm-12 col-xs-12">
            <a
              href="https://maps.app.goo.gl/oeRnwfQxzXnwxXKX6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none"
            >
              <div id="map-tile" className="tile">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d830.3648052776468!2d35.55150096959337!3d33.645261114780325!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151ee1372b9e8b15%3A0x70ed69ff282fba87!2sSivedco!5e0!3m2!1sen!2slb!4v1702227828128!5m2!1sen!2slb"
                  width="100%"
                  height="250"
                  allowFullScreen=""
                  loading="lazy"
                  title="Google Map"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <span>Map</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
