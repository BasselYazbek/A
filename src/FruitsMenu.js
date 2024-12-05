import React, { useState, useEffect } from 'react';
import { firestore } from './firebase';
import Fruits from './Fruits'; // Assuming Fruits is your component
import './Fruits.css'; // Assuming you have your CSS file

const FruitsMenu = () => {
  const [categorizedItems, setCategorizedItems] = useState({
    luxury: [],
    highDiscount: [],
    mediumDiscount: [],
    lowDiscount: [],
    veryLowDiscount: [],
    lessThan0_4: [],
    others: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const collection = firestore.collection('chocolate'); // Fetch chocolate collection
        const snapshot = await collection.where('hidden', '==', false).get();
        const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

        const items = {
          luxury: [],
          highDiscount: [],
          mediumDiscount: [],
          lowDiscount: [],
          veryLowDiscount: [],
          lessThan0_4: [],
          others: []
        };

        data.forEach(item => {
          const price = parseFloat(item.price);
          if (price > 1.2) {
            items.luxury.push(item);
          } else if (price > 1 && price <= 1.2) {
            items.highDiscount.push(item);
          } else if (price > 0.8 && price <= 1) {
            items.mediumDiscount.push(item);
          } else if (price > 0.6 && price <= 0.8) {
            items.lowDiscount.push(item);
          } else if (price > 0.4 && price <= 0.6) {
            items.veryLowDiscount.push(item);
          } else if (price <= 0.4) {
            items.lessThan0_4.push(item);
          } else {
            items.others.push(item);
          }
        });

        setCategorizedItems(items);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
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
    <div className="container">
      <h2 className="category-header">Chocolate Menu</h2>
      {Object.keys(categorizedItems).map((category, idx) =>
        categorizedItems[category].length > 0 ? (
          <section className="fruits-section" key={idx}>
            <h3 className="section-title">{getCategoryTitle(category)}</h3>
            <div className="row fruits-container">
              {categorizedItems[category].map((item) => (
                <Fruits key={item.id} {...item} />
              ))}
            </div>
          </section>
        ) : null
      )}
    </div>
  );
};

const getCategoryTitle = (category) => {
  switch (category) {
    case 'luxury': return 'Luxury Chocolate (Price > $1.2)';
    case 'highDiscount': return '$1.2 → $1';
    case 'mediumDiscount': return '$1 → $0.8';
    case 'lowDiscount': return '$0.8 → $0.6';
    case 'veryLowDiscount': return '$0.6 → $0.4';
    case 'lessThan0_4': return 'Less than $0.4';
    default: return 'Others';
  }
};

export default FruitsMenu;
