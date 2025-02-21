import React, { useState } from "react";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const filters = ["Numbers", "Alphabets", "Highest Alphabet"];

  const handleSubmit = async () => {
    try {
      const data = JSON.parse(input);
      if (!data.data || !Array.isArray(data.data)) throw new Error("Invalid JSON");

      const res = await axios.post("https://your-backend.vercel.app/bfhl", data);
      if (!res.data.is_success) throw new Error("API Error");

      setResponse(res.data);
      setError("");
    } catch (err) {
      setError(err.message);
      setResponse(null);
    }
  };

  const handleFilterChange = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  return (
    <div className="App">
      <h1>{response?.roll_number || "Your Roll Number"}</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='{"data": ["M","1","334","4","B"]}'
      />
      <button onClick={handleSubmit}>Submit</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {response && (
        <div>
          <h3>Multi Filter</h3>
          {filters.map((filter) => (
            <label key={filter}>
              <input
                type="checkbox"
                checked={selectedFilters.includes(filter)}
                onChange={() => handleFilterChange(filter)}
              />
              {filter}
            </label>
          ))}
          <h3>Filtered Response</h3>
          {selectedFilters.map((filter) => (
            <p key={filter}>
              {filter}: {response[filter.toLowerCase().replace(" ", "_")]?.join(", ")}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
