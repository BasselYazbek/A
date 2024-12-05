import React, { useState, useEffect } from 'react';
import { firestore } from './firebase'; // Ensure you're importing Firestore correctly
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'; // Firestore methods
import './AddItemForm.css'; // CSS for styling

const AddItemForm = () => {
  // State for form fields
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemImagePath, setItemImagePath] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemDiscountedPrice, setItemDiscountedPrice] = useState(''); // For discounts
  const [itemIsOutOfStock, setItemIsOutOfStock] = useState(false);
  const [itemHidden, setItemHidden] = useState(false);
  const [category, setCategory] = useState('chocolate'); // Default category

  // State for fetched items
  const [items, setItems] = useState([]);
  const [editingItemId, setEditingItemId] = useState(null); // State to track which item is being edited
  const [newPrice, setNewPrice] = useState(''); // State for new price during editing

  // Fetch items from Firestore on load
  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(firestore, category));
      const itemsArray = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setItems(itemsArray);
    };

    fetchItems();
  }, [category]); // Refetch when the category changes

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const itemData = {
      name: itemName,
      description: itemDescription || '', // If no description, set it to an empty string
      imagePath: itemImagePath,
      price: parseFloat(itemPrice),
      isOutOfStock: itemIsOutOfStock,
      hidden: itemHidden,
      category: category,
    };

    // If category is 'discounts', add discountedPrice field
    if (category === 'discounts') {
      itemData.discountedPrice = parseFloat(itemDiscountedPrice);
    }

    try {
      const collectionRef = collection(firestore, category); // Use category as collection name
      await addDoc(collectionRef, itemData);
      console.log('Item added successfully');

      // Reset form fields
      setItemName('');
      setItemDescription('');
      setItemImagePath('');
      setItemPrice('');
      setItemDiscountedPrice(''); // Reset only if discounts category
      setItemIsOutOfStock(false);
      setItemHidden(false);
      setCategory('chocolate'); // Reset category

      // Fetch updated items
      const querySnapshot = await getDocs(collection(firestore, category));
      const updatedItems = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setItems(updatedItems);
    } catch (error) {
      console.error('Error adding item: ', error);
    }
  };

  // Handle deleting an item (make sure to use the correct category for each item)
  const handleDeleteItem = async (id, itemCategory) => {
    try {
      await deleteDoc(doc(firestore, itemCategory, id));
      console.log('Item deleted');
      // Update the items state
      setItems(items.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting item: ', error);
    }
  };

  // Handle toggling out of stock (make sure to use the correct category for each item)
  const handleToggleOutOfStock = async (id, isOutOfStock, itemCategory) => {
    try {
      await updateDoc(doc(firestore, itemCategory, id), { isOutOfStock: !isOutOfStock });
      console.log('Out of stock status updated');
      // Update the items state
      setItems(items.map((item) => (item.id === id ? { ...item, isOutOfStock: !isOutOfStock } : item)));
    } catch (error) {
      console.error('Error updating out of stock status: ', error);
    }
  };

  // Handle toggling hidden (make sure to use the correct category for each item)
  const handleToggleHidden = async (id, hidden, itemCategory) => {
    try {
      await updateDoc(doc(firestore, itemCategory, id), { hidden: !hidden });
      console.log('Hidden status updated');
      // Update the items state
      setItems(items.map((item) => (item.id === id ? { ...item, hidden: !hidden } : item)));
    } catch (error) {
      console.error('Error updating hidden status: ', error);
    }
  };

  // Start editing an item (set its ID and load the current price)
  const handleEditItem = (id, currentPrice) => {
    setEditingItemId(id);
    setNewPrice(currentPrice);
  };

  // Save the new price and update Firestore
  const handleSaveNewPrice = async (id, itemCategory) => {
    try {
      await updateDoc(doc(firestore, itemCategory, id), { price: parseFloat(newPrice) });
      console.log('Price updated');
      // Reset editing state
      setEditingItemId(null);
      setNewPrice('');

      // Update the items state
      setItems(items.map((item) => (item.id === id ? { ...item, price: parseFloat(newPrice) } : item)));
    } catch (error) {
      console.error('Error updating price: ', error);
    }
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

        {/* Show discountedPrice field only if category is 'discounts' */}
        {category === 'discounts' && (
          <div>
            <label>Discounted Price:</label>
            <input
              type="number"
              value={itemDiscountedPrice}
              onChange={(e) => setItemDiscountedPrice(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <label>Out of Stock:</label>
          <input
            type="checkbox"
            checked={itemIsOutOfStock}
            onChange={(e) => setItemIsOutOfStock(e.target.checked)}
          />
        </div>

        <div>
          <label>Hidden:</label>
          <input
            type="checkbox"
            checked={itemHidden}
            onChange={(e) => setItemHidden(e.target.checked)}
          />
        </div>

        <button type="submit">Add Item</button>
      </form>

      {/* Display list of items */}
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
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="New Price"
                  />
                  <button onClick={() => handleSaveNewPrice(item.id, category)}>Save</button>
                </>
              ) : (
                <>
                  <button onClick={() => handleEditItem(item.id, item.price)}>Edit</button>
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
