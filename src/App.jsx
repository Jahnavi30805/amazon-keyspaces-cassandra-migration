import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  "https://uuh6m2lod2.execute-api.eu-north-1.amazonaws.com";

function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("CSE");
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);

  // GET students
  const fetchStudents = () => {
    setLoading(true);
    setError("");

    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }
        return response.json();
      })
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // POST new student
  const addStudent = async (e) => {
    e.preventDefault();

    if (!studentId || !name || !department || !email) {
      setError("Please fill all fields");
      return;
    }

    setAdding(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/students`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          name,
          department,
          email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add student");
      }

      // Clear form
      setStudentId("");
      setName("");
      setDepartment("CSE");
      setEmail("");

      // Reload records
      fetchStudents();

    } catch (err) {
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="app">

      <header className="header">
        <div>
          <h1>Student Records</h1>
          <p>AWS Cloud Database Demo</p>
        </div>

        <div className="status">
          <span className="status-dot"></span>
          AWS Connected
        </div>
      </header>

      <main className="container">

        {/* Summary Cards */}
        <div className="summary">

          <div className="card">
            <h3>Total Students</h3>
            <p>{students.length}</p>
          </div>

          <div className="card">
            <h3>Department</h3>
            <p>CSE</p>
          </div>

          <div className="card">
            <h3>Data Source</h3>
            <p>DynamoDB</p>
          </div>

        </div>

        {/* Add Student */}
        <section className="add-section">

          <h2>Add New Student</h2>

          <p>
            Add a student directly to the AWS database.
          </p>

          <form onSubmit={addStudent} className="student-form">

            <input
              type="text"
              placeholder="Student ID"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
            />

            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Department"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button type="submit" disabled={adding}>
              {adding ? "Adding..." : "Add Student"}
            </button>

          </form>

        </section>

        {/* Error */}
        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {/* Student Records */}
        <section className="records">

          <h2>Student Records</h2>

          <p>Records retrieved from AWS</p>

          {loading ? (
            <p>Loading students...</p>
          ) : (
            <table>

              <thead>
                <tr>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Email</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (
                  <tr key={student.studentId}>

                    <td>{student.studentId}</td>

                    <td>
                      <strong>{student.name}</strong>
                    </td>

                    <td>
                      <span className="department">
                        {student.department}
                      </span>
                    </td>

                    <td>{student.email}</td>

                  </tr>
                ))}
              </tbody>

            </table>
          )}

        </section>

        {/* Architecture */}
        <div className="architecture">
          React → API Gateway → Lambda → DynamoDB
        </div>

      </main>

    </div>
  );
}

export default App;