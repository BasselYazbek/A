import React, { useState, useEffect } from 'react';
import { firestore } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import './AddItemForm.css';

const AddItemForm = () => {
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemImagePath, setItemImagePath] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemDiscountedPrice, setItemDiscountedPrice] = useState('');
  const [itemIsOutOfStock, setItemIsOutOfStock] = useState(false);
  const [itemHidden, setItemHidden] = useState(false);
  const [category, setCategory] = useState('chocolate');
  const [items, setItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [newImagePath, setNewImagePath] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState(''); // State for new description during editing

  // Function to fetch items
  const fetchItems = async () => {
    const querySnapshot = await getDocs(collection(firestore, category));
    setItems(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    fetchItems();
  }, [category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const itemData = {
      name: itemName,
      description: itemDescription || '',
      imagePath: itemImagePath,
      price: parseFloat(itemPrice),
      isOutOfStock: itemIsOutOfStock,
      hidden: itemHidden,
      category: category,
    };

    if (category === 'discounts') {
      itemData.discountedPrice = parseFloat(itemDiscountedPrice);
    }

    try {
      const collectionRef = collection(firestore, category);
      await addDoc(collectionRef, itemData);
      console.log('Item added successfully');
      resetForm();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const resetForm = () => {
    setItemName('');
    setItemDescription('');
    setItemImagePath('');
    setItemPrice('');
    setItemDiscountedPrice('');
    setItemIsOutOfStock(false);
    setItemHidden(false);
    setCategory('chocolate');
    fetchItems();
  };

  const handleDeleteItem = async (id, itemCategory) => {
    await deleteDoc(doc(firestore, itemCategory, id));
    setItems(items.filter(item => item.id !== id));
  };

  const handleToggleOutOfStock = async (id, isOutOfStock, itemCategory) => {
    await updateDoc(doc(firestore, itemCategory, id), { isOutOfStock: !isOutOfStock });
    setItems(items.map(item => (item.id === id ? { ...item, isOutOfStock: !isOutOfStock } : item)));
  };

  const handleToggleHidden = async (id, hidden, itemCategory) => {
    await updateDoc(doc(firestore, itemCategory, id), { hidden: !hidden });
    setItems(items.map(item => (item.id === id ? { ...item, hidden: !hidden } : item)));
  };

  const handleEditItem = (item) => {
    setEditingItemId(item.id);
    setNewName(item.name);
    setNewDescription(item.description);
    setNewPrice(item.price);
    setNewImagePath(item.imagePath);
    setNewCategory(item.category);
  };

  const handleSaveNewDetails = async () => {
    const updatedData = {
      name: newName,
      description: newDescription,
      price: parseFloat(newPrice),
      imagePath: newImagePath,
      category: newCategory
    };

    const itemRef = doc(firestore, category, editingItemId);
    if (category !== newCategory) {
      await deleteDoc(itemRef);
      const newCollectionRef = collection(firestore, newCategory);
      await addDoc(newCollectionRef, { ...updatedData, isOutOfStock: itemIsOutOfStock, hidden: itemHidden });
    } else {
      await updateDoc(itemRef, updatedData);
    }

    setEditingItemId(null);
    resetForm();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Add Item to Store</h2>
        <div>
          <label>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} required>
            <option value="chocolate">Chocolate</option>
            <option value="gum">Gum</option>
            <option value="chocolatespreds">Chocolate Spreads</option>
            <option value="drinks">Drinks</option>
            <option value="discounts">Discounts</option>
          </select>
        </div>
        <div>
          <label>Name:</label>
          <input type="text" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
        </div>
        <div>
          <label>Description (Optional):</label>
          <input type="text" value={itemDescription} onChange={(e) => setItemDescription(e.target.value)} />
        </div>
        <div>
          <label>Image URL:</label>
          <input type="text" value={itemImagePath} onChange={(e) => setItemImagePath(e.target.value)} required />
        </div>
        <div>
          <label>Price:</label>
          <input type="number" value={itemPrice} onChange={(e) => setItemPrice(e.target.value)} required />
        </div>
        {category === 'discounts' && (
          <div>
            <label>Discounted Price:</label>
            <input type="number" value={itemDiscountedPrice} onChange={(e) => setItemDiscountedPrice(e.target.value)} required />
          </div>
        )}
        <div>
          <label>Out of Stock:</label>
          <input type="checkbox" checked={itemIsOutOfStock} onChange={(e) => setItemIsOutOfStock(e.target.checked)} />
        </div>
        <div>
          <label>Hidden:</label>
          <input type="checkbox" checked={itemHidden} onChange={(e) => setItemHidden(e.target.checked)} />
        </div>
        <button type="submit">Add Item</button>
      </form>
      <h2>Items in {category}</h2>
      {items.length === 0 && <p>No items found.</p>}
      <div className="items-grid">
        {items.map((item) => (
          <div key={item.id} className="item-card">
            <img src={item.imagePath} alt={item.name} className="item-image" />
            <div className="item-details">
              <strong>{item.name}</strong> - ${item.price}
              {item.isOutOfStock && <span> (Out of Stock)</span>}
              {item.hidden && <span> (Hidden)</span>}
            </div>
            <div className="item-actions">
              {editingItemId === item.id ? (
                <>
                  <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New Name" />
                  <input type="text" value={newDescription} onChange={(e) => setNewDescription(e.target.value)} placeholder="New Description" />
                  <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="New Price" />
                  <input type="text" value={newImagePath} onChange={(e) => setNewImagePath(e.target.value)} placeholder="New Image URL" />
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                    <option value="chocolate">Chocolate</option>
                    <option value="gum">Gum</option>
                    <option value="chocolatespreds">Chocolate Spreads</option>
                    <option value="drinks">Drinks</option>
                    <option value="discounts">Discounts</option>
                  </select>
                  <button onClick={handleSaveNewDetails}>Save</button>
                  <button onClick={() => setEditingItemId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEditItem(item)}>Edit</button>
                  <button onClick={() => handleDeleteItem(item.id, category)}>Delete</button>
                  <button onClick={() => handleToggleOutOfStock(item.id, item.isOutOfStock, category)}>
                    {item.isOutOfStock ? 'Mark as In Stock' : 'Mark as Out of Stock'}
                  </button>
                  <button onClick={() => handleToggleHidden(item.id, item.hidden, category)}>
                    {item.hidden ? 'Unhide' : 'Hide'}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddItemForm;
