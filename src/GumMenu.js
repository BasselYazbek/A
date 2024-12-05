import React, { useState, useEffect } from 'react';
import Gum from './Gum';
import AddItemForm from './AddItemForm';
import { firestore } from './firebase';
import './Fruits.css'; // Ensure this CSS applies correctly

const GumMenu = ({ isAdmin }) => {
  const [gumItems, setGumItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const gumCollection = firestore.collection('gum');
        const snapshot = await gumCollection.where('hidden', '==', false).get();
        const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setGumItems(data);
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
      const gumCollection = firestore.collection('gum');
      const docRef = await gumCollection.add({
        ...newItem,
        isOutOfStock: false,
        hidden: false,
      });

      setGumItems((prevItems) => [...prevItems, { ...newItem, id: docRef.id }]);
    } catch (error) {
      console.error('Error adding item to Firestore:', error);
    }
  };

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
      <h2 className="section-title">Gum Menu</h2>
      <div className="fruits-container">
        {gumItems.map((item) => (
          <Gum key={item.id} {...item} />
        ))}
      </div>

      {isAdmin && (
        <div className="add-item-container">
          <AddItemForm onAddItem={handleAddItem} collectionName="gum" />
        </div>
      )}
    </div>
  );
};

export default GumMenu;
