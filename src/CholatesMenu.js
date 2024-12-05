import React, { useState, useEffect } from 'react';
import Chocolates from './Chocolates'; // Component for individual items
import AddItemForm from './AddItemForm'; // Admin form for adding items
import { firestore } from './firebase';
import './Fruits.css'; // Using the same CSS as FruitsMenu

const ChocolatesMenu = ({ isAdmin }) => {
  const [chocolatesItems, setChocolatesItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const drinksCollection = firestore.collection('drinks');
        const snapshot = await drinksCollection.where('hidden', '==', false).get();
        const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setChocolatesItems(data);
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
      const drinksCollection = firestore.collection('drinks');
      const docRef = await drinksCollection.add({
        ...newItem,
        isOutOfStock: false,
        hidden: false,
      });

      setChocolatesItems((prevItems) => [...prevItems, { ...newItem, id: docRef.id }]);
    } catch (error) {
      console.error('Error adding item to Firestore:', error);
    }
  };

  const handleEditItem = async (item) => {
    try {
      const drinksCollection = firestore.collection('drinks');
      await drinksCollection.doc(item.id).update(item);

      setChocolatesItems((prevItems) =>
        prevItems.map((existingItem) => (existingItem.id === item.id ? item : existingItem))
      );
    } catch (error) {
      console.error('Error updating item in Firestore:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm(`Are you sure you want to delete this item?`)) {
      try {
        const drinksCollection = firestore.collection('drinks');
        await drinksCollection.doc(itemId).update({ hidden: true });

        setChocolatesItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
      } catch (error) {
        console.error('Error deleting item from Firestore:', error);
      }
    }
  };

  const toggleStock = async (itemId) => {
    const itemIndex = chocolatesItems.findIndex((item) => item.id === itemId);
    const currentItem = chocolatesItems[itemIndex];
    const updatedItem = { ...currentItem, isOutOfStock: !currentItem.isOutOfStock };

    try {
      const drinksCollection = firestore.collection('drinks');
      await drinksCollection.doc(itemId).update(updatedItem);

      setChocolatesItems((prevItems) => [
        ...prevItems.slice(0, itemIndex),
        updatedItem,
        ...prevItems.slice(itemIndex + 1),
      ]);
    } catch (error) {
      console.error('Error updating item in Firestore:', error);
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
      <h2 className="section-title">Drinks</h2>
      <div className="fruits-container">
        {chocolatesItems.map((item) => (
          <Chocolates
            key={item.id}
            {...item}
            onEdit={() => handleEditItem(item)}
            onDelete={() => handleDeleteItem(item.id)}
            isAdmin={isAdmin}
            onToggleStock={() => toggleStock(item.id)}
            isOutOfStock={item.isOutOfStock || false}
          />
        ))}
      </div>

      {isAdmin && (
        <div className="add-item-container">
          <AddItemForm onAddItem={handleAddItem} collectionName="drinks" />
        </div>
      )}
    </div>
  );
};

export default ChocolatesMenu;
