import { useEffect, useState } from "react";
import { useStopwatch } from "react-timer-hook";
import { BsPlayFill, BsPauseFill, BsStopFill } from "react-icons/bs";

const BASE_URL = "http://localhost:8080/";

export default function Feeding({ kidData, refresher, currentUser }) {
  const [feedingType, setFeedingType] = useState("food");
  const [notes, setNotes] = useState();
  const [nursingSide, setNursingSide] = useState("left");
  const [nursingTime, setNursingTime] = useState("");
  const [ounces, setOunces] = useState({ oz: 0 });
  const [foodTitle, setFoodTitle] = useState({ title: "" });
  const { seconds, minutes, hours, isRunning, start, pause, reset } =
    useStopwatch({
      autoStart: false,
    });

  useEffect(() => {
    let totalTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    setNursingTime(totalTime);
  }, [hours, minutes, seconds, nursingTime]);

  const handleSubmit = (e) => {
    let otherData;
    if (feedingType === "nursing") {
      otherData = { [nursingSide]: nursingTime };
    } else if (feedingType === "formula") {
      otherData = { ...ounces };
    } else if (feedingType === "food") {
      otherData = { ...foodTitle };
    }

    fetch(`${BASE_URL}api/kids/${kidData._id}`, {
      method: "POST",
      body: JSON.stringify({
        ...kidData,
        feeding: [
          ...kidData.feeding,
          {
            type: feedingType,
            notes: notes,
            extra: otherData,
            time: Date.now(),
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
        setFoodTitle({ title: "" });
        setOunces({ oz: 0 });
      });

    e.preventDefault();
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      {feedingType === "food" ? (
        <h4 style={{ margin: 10 }}>Food</h4>
      ) : feedingType === "formula" ? (
        <h4 style={{ margin: 10 }}>Formula</h4>
      ) : feedingType === "nursing" ? (
        <h4 style={{ margin: 10 }}>Nursing</h4>
      ) : null}

      <label className="bold">
        Type:
        <select
          value={feedingType}
          // Clear all other values
          onChange={(e) => setFeedingType(e.target.value)}
        >
          <option value="food">Food</option>
          <option value="formula">Formula</option>
          {currentUser?.is_daycare ? null : (
            <option value="nursing">Nursing</option>
          )}
        </select>
      </label>
      <br />
      {feedingType === "food" ? (
        <>
          <div className="top-sm-margin bold">
            Food Name:
            <input
              style={{ padding: 5, paddingLeft: 10 }}
              className="input-square input left-sm-margin"
              type="text"
              placeholder="Name*"
              value={foodTitle.title}
              name="oz"
              onChange={(e) =>
                setFoodTitle(() => ({
                  title: e.target.value,
                }))
              }
              required
            />
          </div>
        </>
      ) : feedingType === "formula" ? (
        <div className="bold top-sm-margin">
          Ounces:
          <input
            type="number"
            style={{ padding: 5, paddingLeft: 10 }}
            className="input-square sm-input left-sm-margin"
            placeholder={0}
            value={ounces.oz}
            name="oz"
            onChange={(e) =>
              setOunces(() => ({
                oz: e.target.value,
              }))
            }
            required
          />
        </div>
      ) : feedingType === "nursing" ? (
        <div className="top-sm-margin">
          <label className="bold">
            Side:
            <select
              value={nursingSide}
              // Clear all other values
              onChange={(e) => setNursingSide(() => e.target.value)}
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
            </select>
          </label>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
            className="top-sm-padding"
          >
            <div style={{ marginRight: 5 }} className="bold">
              Timer:
            </div>
            <div>{hours.toString().padStart(2, "0")}</div>:
            <div>{minutes.toString().padStart(2, "0")}</div>:
            <div>{seconds.toString().padStart(2, "0")}</div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            {isRunning ? (
              <div className="nursing-btn orange-btn" onClick={pause}>
                <BsPauseFill />
              </div>
            ) : (
              <div className="nursing-btn green-btn" onClick={start}>
                <BsPlayFill />
              </div>
            )}

            <div className="nursing-btn red-btn left-sm-margin" onClick={reset}>
              <BsStopFill />
            </div>
          </div>
        </div>
      ) : null}

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
