import { useEffect, useState } from "react";
import { TextField } from "@material-ui/core";

const BASE_URL = "http://localhost:8080/";

export default function Sleep({ kidData, refresher }) {
  const [startDateTime, setStartDateTime] = useState(() => {
    let date = new Date();
    let currentDate =
      date.getHours().toString().padStart(2, "0") +
      ":" +
      date.getMinutes().toString().padStart(2, "0");
    return currentDate;
  });
  const [endDateTime, setEndDateTime] = useState(() => {
    let date = new Date();
    let currentDate =
      date.getHours().toString().padStart(2, "0") +
      ":" +
      date.getMinutes().toString().padStart(2, "0");
    return currentDate;
  });
  const [sleepLength, setSleepLength] = useState(0);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (endDateTime < startDateTime) {
      setError(true);
    } else {
      setError(false);
    }

    let startArr = startDateTime.split(":");
    let endArr = endDateTime.split(":");
    let startHour = parseInt(startArr[0]);
    let endHour = parseInt(endArr[0]);
    let startMinute = parseInt(startArr[1]);
    let endMinute = parseInt(endArr[1]);
    let totalHour = (endHour - startHour) * 60;
    let totalMinutes = endMinute - startMinute;
    setSleepLength(totalHour + totalMinutes);
  }, [startDateTime, endDateTime]);

  const handleSubmit = (e) => {
    fetch(`${BASE_URL}api/kids/${kidData._id}`, {
      method: "POST",
      body: JSON.stringify({
        ...kidData,
        sleep: [
          ...kidData.sleep,
          {
            sleepStart: startDateTime,
            sleepEnd: endDateTime,
            sleepLength: sleepLength,
            time: Date.now(),
            notes: notes,
          },
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
      <h4 style={{ margin: 10 }}>Sleep</h4>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ marginRight: 5 }} className="bold">
          Start:
        </div>

        <TextField
          type="time"
          value={startDateTime}
          onChange={(e) => {
            setStartDateTime(e.target.value);
          }}
        />
        <div style={{ marginRight: 5 }} className="bold left-md-margin">
          End:
        </div>
        <TextField
          type="time"
          value={endDateTime}
          onChange={(e) => {
            setEndDateTime(e.target.value);
          }}
        />
      </div>

      <textarea
        style={{ marginTop: 15 }}
        placeholder="Notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
      />
      {error ? (
        <div className="error">Awake must be past Asleep time</div>
      ) : (
        <></>
      )}
      <br />
      <input
        className={`btn ${kidData.theme}-btn sm-width top-sm-margin`}
        type="submit"
        value="Submit"
      />
    </form>
  );
}
