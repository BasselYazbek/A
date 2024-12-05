import React, { useState, useEffect } from 'react';
import { firestore } from './firebase';
import AddItemForm from './AddItemForm'; // Assuming you already have an AddItemForm component

const AdminPanel = () => {
  const [items, setItems] = useState([]);

  // Fetch existing items from Firebase
  useEffect(() => {
    const fetchData = async () => {
      const itemsCollection = firestore.collection('items'); // Use the correct collection
      const snapshot = await itemsCollection.get();
      const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setItems(data);
    };
    fetchData();
  }, []);

  // Handle item deletion
  const handleDelete = async (id) => {
    await firestore.collection('items').doc(id).delete();
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="container">
      <h2>Admin Panel</h2>
      {/* Form for adding new items */}
      <AddItemForm onAddItem={(newItem) => setItems([...items, newItem])} />

      {/* List of items */}
      <div className="item-list">
        {items.map((item) => (
          <div key={item.id} className="item">
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <p>Price: {item.price}</p>
            <button onClick={() => handleDelete(item.id)} className="btn btn-danger">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
