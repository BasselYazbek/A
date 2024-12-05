import React, { useState, useEffect } from 'react';
import Discounts from './Discounts';
import AddItemForm from './AddItemForm';
import { firestore } from './firebase';
import './Fruits.css'; // Ensure this is the correct path to the CSS file that contains your styles

const DiscountsMenu = ({ isAdmin }) => {
  const [discountItems, setDiscountItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const discountsCollection = firestore.collection('discounts');
        const snapshot = await discountsCollection.where('hidden', '==', false).get();
        const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setDiscountItems(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddItem = async (newItem) => {
    try {
      const discountsCollection = firestore.collection('discounts');
      const docRef = await discountsCollection.add({
        ...newItem,
        isOutOfStock: false,
        hidden: false,
      });

      setDiscountItems((prevItems) => [...prevItems, { ...newItem, id: docRef.id }]);
    } catch (error) {
      console.error('Error adding item to Firestore:', error);
    }
  };

  const filteredItems = selectedCategory === 'All'
    ? discountItems
    : discountItems.filter(item => item.category === selectedCategory);

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
      <h2 className="section-title">Discounted Items</h2>

      <div className="sort-container">
        <select
          className="sort-dropdown"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Chocolate">Chocolate</option>
          <option value="Drink">Drink</option>
          <option value="Gum">Gum</option>
          <option value="Chocolate Spreads">Chocolate Spreads</option>
        </select>
      </div>

      <div className="fruits-container">
        {filteredItems.map((item) => (
          <Discounts
            key={item.id}
            {...item}
            isAdmin={isAdmin}
          />
        ))}
      </div>

      {isAdmin && (
        <div className="add-item-container">
          <AddItemForm onAddItem={handleAddItem} collectionName="discounts" />
        </div>
      )}
    </div>
  );
};

export default DiscountsMenu;
