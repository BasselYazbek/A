import React from 'react';

const ChocolateSpreads = ({ name, description, imagePath, price, isOutOfStock }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card">
        {isOutOfStock && <div className="sold-out-label">Sold Out</div>}
        <img src={imagePath} className="card-img-top" alt={name} style={{ height: '200px', objectFit: 'contain' }} />
        <div className="card-body">
          <h5 className="card-title">{name}</h5>
          {description && <p className="card-text">{description}</p>} {/* Show description */}
          <p className="card-text">Price: {price} $</p>
        </div>
      </div>
    </div>
  );
};

export default ChocolateSpreads;
