import { useState } from "react";

const BASE_URL = "http://localhost:8080/";

export default function Diaper({ kidData, refresher }) {
  const [diaperType, setDiaperType] = useState("none");
  const [notes, setNotes] = useState();

  const handleSubmit = (e) => {
    fetch(`${BASE_URL}api/kids/${kidData._id}`, {
      method: "POST",
      body: JSON.stringify({
        ...kidData,
        diaper: [
          ...kidData.diaper,
          { output: diaperType, notes: notes, time: Date.now() },
        ],
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        refresher(true);
        setNotes("");
      });

    e.preventDefault();
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h4 style={{ margin: 10 }}>Diaper</h4>
      <label className="bold top-sm-margin">
        Output:
        <select
          value={diaperType}
          onChange={(e) => setDiaperType(e.target.value)}
        >
          <option value="none">None</option>
          <option value="urine">Wet</option>
          <option value="bm">BM</option>
          <option value="mixed">Mixed</option>
        </select>
      </label>
      <br />
      <textarea
        style={{ marginTop: 15 }}
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      <br />
      <input
        className={`btn ${kidData.theme}-btn sm-width top-sm-margin`}
        type="submit"
        value="Submit"
      />
    </form>
  );
}
