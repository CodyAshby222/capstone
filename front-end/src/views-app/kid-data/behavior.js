import { useState } from "react";

const BASE_URL = "http://localhost:8080/";

export default function Behavior({ kidData, refresher }) {
  const [notes, setNotes] = useState();

  const handleSubmit = (e) => {
    fetch(`${BASE_URL}api/kids/${kidData._id}`, {
      method: "POST",
      body: JSON.stringify({
        ...kidData,
        behavior: [...kidData.behavior, { notes: notes, time: Date.now() }],
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
      <h4 style={{ margin: 10 }}>Behavior</h4>
      <div className="source">
        Share feedback on good/bad behaviors. Let us know how our little
        astronaut is doing!
      </div>
      <br />
      <textarea
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
