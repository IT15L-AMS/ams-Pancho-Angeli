import React, { useEffect, useState } from "react";
import "./App.css";

const COURSES = ["BSIT", "BSCS", "BSIS"];
const YEARS = [1, 2, 3, 4];
const API_URL = "http://localhost:3000/students";

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ name: "", course: "", year: "" });
  const [editData, setEditData] = useState(null);

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    const res = await fetch(API_URL);
    setStudents(await res.json());
  };

  const handleAdd = async () => {
    if (!form.name || !form.course || !form.year) return;
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", course: "", year: "" });
    fetchStudents();
  };

  const handleUpdate = async () => {
    await fetch(`${API_URL}/${editData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editData),
    });
    setEditData(null);
    fetchStudents();
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    fetchStudents();
  };

  return (
    <div className="app-container">
      <button onClick={() => alert("Logged out!")} className="btn-main" style={{ marginBottom: 30 }}>Logout</button>
      <h1 className="title">Student Management</h1>

      {/* Adding Section */}
      <div className="form-row">
        <input 
          className="input-box" placeholder="Name" 
          value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} 
        />
        <select className="input-box" value={form.course} onChange={(e) => setForm({...form, course: e.target.value})}>
          <option value="">Select Course</option>
          {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input-box" value={form.year} onChange={(e) => setForm({...form, year: e.target.value})}>
          <option value="">Select Year</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <button onClick={handleAdd} className="btn-main">Add Student</button>
      </div>

      {/* Listing Section */}
      <table className="student-table">
        <tbody>
          {students.map((s) => (
            <tr key={s.id} className="table-row">
              {editData?.id === s.id ? (
                <>
                  <td className="col-name"><input className="input-box" style={{width: '130px'}} value={editData.name} onChange={(e) => setEditData({...editData, name: e.target.value})} /></td>
                  <td className="col-course">
                    <select value={editData.course} onChange={(e) => setEditData({...editData, course: e.target.value})}>
                      {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </td>
                  <td className="col-year">
                    <select value={editData.year} onChange={(e) => setEditData({...editData, year: e.target.value})}>
                      {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </td>
                  <td>
                    <button onClick={handleUpdate} className="btn-small">Save</button>
                    <button onClick={() => setEditData(null)} className="btn-small">Cancel</button>
                  </td>
                </>
              ) : (
                <>
                  <td className="col-name">• {s.name}</td>
                  <td className="col-course">{s.course}</td>
                  <td className="col-year">(Year {s.year})</td>
                  <td>
                    <button onClick={() => setEditData(s)} className="btn-small">Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="btn-small">Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;