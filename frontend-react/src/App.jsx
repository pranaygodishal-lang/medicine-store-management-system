import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [medicines, setMedicines] = useState([]);
  const API_URL = "http://localhost:8081/api/medicines";

async function loadMedicines() {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to load medicines");
    }

    const data = await response.json();
    setMedicines(data);
  } catch (error) {
    console.error("Error loading medicines:", error);
  }
}
useEffect(() => {
  loadMedicines();
}, []);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
  });

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

 async function addMedicine(event) {
  event.preventDefault();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name,
        category: form.category,
        price: Number(form.price),
        quantity: Number(form.quantity),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to add medicine");
    }

    await loadMedicines();

    setForm({
      name: "",
      category: "",
      price: "",
      quantity: "",
    });

    setShowForm(false);
    alert("Medicine added successfully!");
  } catch (error) {
    console.error("Error adding medicine:", error);
    alert("Could not add medicine. Please check the backend.");
  }
}

  function deleteMedicine(id) {
    setMedicines(medicines.filter((medicine) => medicine.id !== id));
  }

  const filteredMedicines = medicines.filter((medicine) =>
    medicine.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <aside className="sidebar">
        <h2>💊 MediStore</h2>
        <p className="menu-title">MAIN MENU</p>
        <div className="menu-item active">📊 Dashboard</div>
        <div className="menu-item">💊 Medicines</div>
        <div className="menu-item">📦 Inventory</div>
        <div className="menu-item">🛒 Sales</div>
        <div className="menu-item">📋 Reports</div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <h1>Medicine Store Management</h1>
            <p>Manage your medicines and inventory</p>
          </div>
          <div className="admin">👤 Admin</div>
        </header>

        <section className="welcome">
          <h2>Welcome to MediStore 👋</h2>
          <p>Track medicines, monitor stock, and manage your store.</p>
        </section>

        <section className="stats">
          <div className="stat-card">
            <span>Total Medicines</span>
            <h2>{medicines.length}</h2>
            <p>Medicines in the list</p>
          </div>

          <div className="stat-card">
            <span>Total Stock</span>
            <h2>
              {medicines.reduce(
                (total, medicine) => total + medicine.quantity,
                0
              )}
            </h2>
            <p>Units available</p>
          </div>

          <div className="stat-card">
            <span>Inventory Value</span>
            <h2>
              ₹
              {medicines
                .reduce(
                  (total, medicine) =>
                    total + medicine.price * medicine.quantity,
                  0
                )
                .toLocaleString("en-IN")}
            </h2>
            <p>Estimated stock value</p>
          </div>
        </section>

        <section className="inventory">
          <div className="inventory-header">
            <div>
              <h2>Medicine Inventory</h2>
              <p>View and manage your medicines</p>
            </div>

            <button className="add-button" onClick={() => setShowForm(!showForm)}>
              + Add Medicine
            </button>
          </div>

          {showForm && (
            <form className="medicine-form" onSubmit={addMedicine}>
              <input
                name="name"
                placeholder="Medicine name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <input
                name="category"
                placeholder="Category"
                value={form.category}
                onChange={handleChange}
                required
              />

              <input
                name="price"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="Price (₹)"
                value={form.price}
                onChange={handleChange}
                required
              />

              <input
                name="quantity"
                type="number"
                min="0"
                placeholder="Quantity"
                value={form.quantity}
                onChange={handleChange}
                required
              />

              <button type="submit" className="add-button">
                Save Medicine
              </button>
            </form>
          )}

          <input
            className="search"
            placeholder="🔍 Search medicines by name..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Medicine Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredMedicines.map((medicine) => (
                  <tr key={medicine.id}>
                    <td>{medicine.id}</td>
                    <td>{medicine.name}</td>
                    <td>{medicine.category}</td>
                    <td>₹{medicine.price}</td>
                    <td>
                      <span
                        className={
                          medicine.quantity < 20 ? "stock low" : "stock"
                        }
                      >
                        {medicine.quantity}
                      </span>
                    </td>
                    <td>
                      <button
                        className="delete-button"
                        onClick={() => deleteMedicine(medicine.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredMedicines.length === 0 && (
                  <tr>
                    <td colSpan="6" className="empty">
                      No medicines found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer>Medicine Store Management System | React + Spring Boot + MySQL</footer>
      </main>
    </div>
  );
}

export default App;