import React, { useState, useEffect } from 'react';
import ChocolateSpreds from './ChocolateSpreds';
import AddItemForm from './AddItemForm';
import { firestore } from './firebase';
import './Fruits.css'; // Importing shared CSS for consistent styling across components

const ChocolateSpredsMenu = ({ isAdmin }) => {
  const [chocolateSpredsItems, setChocolateSpredsItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chocolateSpredsCollection = firestore.collection('chocolatespreds');
        const snapshot = await chocolateSpredsCollection.where('hidden', '==', false).get();
        const data = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setChocolateSpredsItems(data);
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
      const chocolateSpredsCollection = firestore.collection('chocolatespreds');
      const docRef = await chocolateSpredsCollection.add({
        ...newItem,
        isOutOfStock: false,
        hidden: false,
      });

      setChocolateSpredsItems(prevItems => [...prevItems, { ...newItem, id: docRef.id }]);
    } catch (error) {
      console.error('Error adding item to Firestore:', error);
    }
  };

  const handleEditItem = async (item) => {
    try {
      const chocolateSpredsCollection = firestore.collection('chocolatespreds');
      await chocolateSpredsCollection.doc(item.id).update(item);

      setChocolateSpredsItems(prevItems =>
        prevItems.map(existingItem => (existingItem.id === item.id ? item : existingItem))
      );
    } catch (error) {
      console.error('Error updating item in Firestore:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm(`Are you sure you want to delete this item?`)) {
      try {
        const chocolateSpredsCollection = firestore.collection('chocolatespreds');
        await chocolateSpredsCollection.doc(itemId).update({ hidden: true });

        setChocolateSpredsItems(prevItems => prevItems.filter(item => item.id !== itemId));
      } catch (error) {
        console.error('Error deleting item from Firestore:', error);
      }
    }
  };

  const toggleStock = async (itemId) => {
    const itemIndex = chocolateSpredsItems.findIndex(item => item.id === itemId);
    const currentItem = chocolateSpredsItems[itemIndex];
    const updatedItem = { ...currentItem, isOutOfStock: !currentItem.isOutOfStock };

    try {
      const chocolateSpredsCollection = firestore.collection('chocolatespreds');
      await chocolateSpredsCollection.doc(itemId).update(updatedItem);

      setChocolateSpredsItems(prevItems => [
        ...prevItems.slice(0, itemIndex),
        updatedItem,
        ...prevItems.slice(itemIndex + 1),
      ]);
    } catch (error) {
      console.error('Error updating item in Firestore:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredItems = chocolateSpredsItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <h2 className="section-title">Chocolate Spreads Menu</h2>
      <input
        type="text"
        className="search-box"
        placeholder="Search Chocolate Spreads..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <div className="fruits-container">
        {filteredItems.map((item) => (
          <ChocolateSpreds
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
          <AddItemForm onAddItem={handleAddItem} collectionName="chocolatespreds" />
        </div>
      )}
    </div>
  );
};

export default ChocolateSpredsMenu;
