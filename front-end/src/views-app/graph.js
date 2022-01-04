import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Behavior from "./kid-data/behavior";
import Diaper from "./kid-data/diaper";
import Feeding from "./kid-data/feeding";
import Sleep from "./kid-data/sleep";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { UserContext } from "../components/context";
import Aos from "aos";
import "aos/dist/aos.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = "http://localhost:8080/";

export default function Graph() {
  const [user] = useContext(UserContext);
  const [kidData, setKidData] = useState();
  const [data, setData] = useState();
  const [sleepData, setSleepData] = useState();
  const [feeding, setFeeding] = useState();
  const [nursing, setNursing] = useState();
  const [dataSelection, setDataSelection] = useState("feeding");
  const [refreshData, setRefreshData] = useState(true);
  const [food, setFood] = useState();
  let { kidID } = useParams();
  const [nursingNotes, setNursingNotes] = useState();
  const [formulaNotes, setFormulaNotes] = useState();

  const refreshDataCallback = (value) => {
    toast.success(`Data Successfully Added`, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setRefreshData(value);
  };

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    if (refreshData) {
      fetch(`${BASE_URL}api/kids/${kidID}`)
        .then((res) => res.json())
        .then((data) => {
          setKidData(data);

          let colorArr;
          let borderArr;
          switch (data.theme) {
            case "blue":
              colorArr = [
                "#52d6f4b4",
                "#00a9c7a2",
                "#007f9ca2",
                "#005772b4",
                "#00324bb4",
              ];
              borderArr = [
                "#52d6f4",
                "#00AAC7",
                "#00809C",
                "#005872",
                "#00324B",
              ];
              break;
            case "pink":
              colorArr = [
                "#f2c4ceb6",
                "#c397a1b6",
                "#956c75ad",
                "#6a444daf",
                "#411f28af",
              ];
              borderArr = [
                "#F2C4CE",
                "#C397A1",
                "#956C75",
                "#6A444D",
                "#411F28",
              ];
              break;
            case "orange":
              colorArr = [
                "#ec7f37ad",
                "#c45d14a9",
                "#9c3c00af",
                "#771e00b0",
                "#550000ab",
              ];
              borderArr = [
                "#EC7F37",
                "#C45E14",
                "#9C3D00",
                "#771D00",
                "#550000",
              ];
              break;
            case "gold":
              colorArr = [
                "#ad974fb4",
                "#8a7630b0",
                "#685810af",
                "#483b00ad",
                "#2f20009d",
              ];
              borderArr = [
                "#AD974F",
                "#8A7730",
                "#685810",
                "#483B00",
                "#2F2000",
              ];
              break;
            default:
              colorArr = null;
              borderArr = null;
          }

          let allFood = data.feeding.filter(
            (foodType) => foodType.type === "food"
          );
          setFood(allFood);
          let formulaNote = data.feeding.filter(
            (foodType) => foodType.type === "formula"
          );
          setFormulaNotes(formulaNote);
          let nursingNote = data.feeding.filter(
            (foodType) => foodType.type === "nursing"
          );
          setNursingNotes(nursingNote);

          let urine = data.diaper.filter(
            (outputType) => outputType.output === "urine"
          );
          let noOutput = data.diaper.filter(
            (outputType) => outputType.output === "none"
          );
          let bowelMovement = data.diaper.filter(
            (outputType) => outputType.output === "bm"
          );
          let mixed = data.diaper.filter(
            (outputType) => outputType.output === "mixed"
          );

          if (data.diaper.length > 0)
            setData({
              labels: ["None", "Wet", "BM", "Mixed"],
              datasets: [
                {
                  label: "",
                  data: [
                    noOutput.length,
                    urine.length,
                    bowelMovement.length,
                    mixed.length,
                  ],
                  backgroundColor: [
                    colorArr[0],
                    colorArr[1],
                    colorArr[2],
                    colorArr[3],
                  ],
                  borderColor: [
                    borderArr[0],
                    borderArr[1],
                    borderArr[2],
                    borderArr[3],
                  ],
                  borderWidth: 1,
                },
              ],
            });

          //SLEEPING
          let sleepDates = [];
          data.sleep.forEach((sleepData) => {
            sleepDates.push({
              time: `${new Date(sleepData.time).getMonth() + 1}/${new Date(
                sleepData.time
              ).getDate()}`,
              length: sleepData.sleepLength,
            });
          });
          if (sleepDates?.length < 5) {
            let tempArr = Array(5).fill({ length: 0, time: "-" });
            sleepDates.forEach((s) => {
              tempArr.push({
                length: s.length,
                time: s.time,
              });
            });
            sleepDates = tempArr;
          }

          let first = sleepDates[sleepDates.length - 5].length;
          let second = sleepDates[sleepDates.length - 4].length;
          let third = sleepDates[sleepDates.length - 3].length;
          let fourth = sleepDates[sleepDates.length - 2].length;
          let last = sleepDates[sleepDates.length - 1].length;

          let firstTime = sleepDates[sleepDates.length - 5].time;
          let secondTime = sleepDates[sleepDates.length - 4].time;
          let thirdTime = sleepDates[sleepDates.length - 3].time;
          let fourthTime = sleepDates[sleepDates.length - 2].time;
          let lastTime = sleepDates[sleepDates.length - 1].time;

          if (data.sleep.length > 0) {
            setSleepData({
              labels: [firstTime, secondTime, thirdTime, fourthTime, lastTime],
              datasets: [
                {
                  label: "Minutes Slept - Last 5",
                  data: [first, second, third, fourth, last],
                  fill: false,
                  backgroundColor: colorArr[0],
                  borderColor: borderArr[0],
                },
              ],
            });
          }

          //FORMULA
          let feedingDates = [];
          let feedingLength = 0;
          data.feeding.forEach((feedingData) => {
            if (feedingData.type === "formula") {
              feedingDates.push({
                time: `${new Date(feedingData.time).getMonth() + 1}/${new Date(
                  feedingData.time
                ).getDate()}`,
                ounces: parseInt(feedingData.extra.oz),
              });
              feedingLength = feedingLength + 1;
            }
          });
          if (feedingDates?.length < 5) {
            let tempArr = Array(5).fill({ time: "-", ounces: 0 });
            feedingDates.forEach((f) => {
              tempArr.push({
                time: f.time,
                ounces: f.ounces,
              });
            });
            feedingDates = tempArr;
          }

          let firstFormula = feedingDates[feedingDates.length - 5].ounces;
          let secondFormula = feedingDates[feedingDates.length - 4].ounces;
          let thirdFormula = feedingDates[feedingDates.length - 3].ounces;
          let fourthFormula = feedingDates[feedingDates.length - 2].ounces;
          let lastFormula = feedingDates[feedingDates.length - 1].ounces;

          let firstTimeFormula = feedingDates[feedingDates.length - 5].time;
          let secondTimeFormula = feedingDates[feedingDates.length - 4].time;
          let thirdTimeFormula = feedingDates[feedingDates.length - 3].time;
          let fourthTimeFormula = feedingDates[feedingDates.length - 2].time;
          let lastTimeFormula = feedingDates[feedingDates.length - 1].time;

          if (feedingLength > 0) {
            setFeeding({
              labels: [
                firstTimeFormula,
                secondTimeFormula,
                thirdTimeFormula,
                fourthTimeFormula,
                lastTimeFormula,
              ],
              datasets: [
                {
                  label: "Ounces of Formula",
                  data: [
                    firstFormula,
                    secondFormula,
                    thirdFormula,
                    fourthFormula,
                    lastFormula,
                  ],
                  backgroundColor: [
                    colorArr[0],
                    colorArr[1],
                    colorArr[2],
                    colorArr[3],
                    colorArr[4],
                  ],
                  borderColor: [
                    borderArr[0],
                    borderArr[1],
                    borderArr[2],
                    borderArr[3],
                    borderArr[4],
                  ],
                  borderWidth: 1,
                },
              ],
            });
          }

          let leftSeconds = 0;
          let rightSeconds = 0;
          data.feeding.forEach((nursingData) => {
            if (nursingData.extra.left) {
              let arr = nursingData.extra.left.split(":");
              let hourToSec = parseInt(arr[0]) * 60 * 60;
              let minToSec = parseInt(arr[1]) * 60;
              let sec = parseInt(arr[2]);
              leftSeconds = leftSeconds + hourToSec + minToSec + sec;
            }
            if (nursingData.extra.right) {
              let arr = nursingData.extra.right.split(":");
              let hourToSec = parseInt(arr[0]) * 60 * 60;
              let minToSec = parseInt(arr[1]) * 60;
              let sec = parseInt(arr[2]);
              rightSeconds = rightSeconds + hourToSec + minToSec + sec;
            }
          });

          if (leftSeconds || rightSeconds) {
            setNursing({
              labels: ["Left", "Right"],
              datasets: [
                {
                  label: "Nursing in Seconds",
                  data: [leftSeconds, rightSeconds],
                  backgroundColor: [colorArr[0], colorArr[2]],
                  borderColor: [borderArr[0], borderArr[2]],
                  borderWidth: 1,
                },
              ],
            });
          }

          setRefreshData(false);
        });
    }
  }, [kidID, refreshData]);

  const options = {
    indexAxis: "y",
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
    },
  };

  const lineOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  const verticalOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  if (kidData) {
    return (
<>
      <div data-aos="fade-up" className="content-4 bottom-sm-padding">
        <div>
          <div className={`row data-${kidData.theme}-buttons cursor`}>
            <div
              className="data-btn"
              onClick={() => setDataSelection("feeding")}
            >
              Feeding
            </div>
            <div
              className="data-btn"
              onClick={() => setDataSelection("diaper")}
            >
              Diaper
            </div>
            <div
              className="data-btn"
              onClick={() => setDataSelection("sleeping")}
            >
              Sleep
            </div>
            <div
              className="data-btn"
              onClick={() => setDataSelection("behavior")}
            >
              Behavior
            </div>
          </div>
          {dataSelection === "feeding" ? (
            <Feeding
              kidData={kidData}
              refresher={refreshDataCallback}
              currentUser={user}
            />
          ) : dataSelection === "diaper" ? (
            <Diaper
              kidData={kidData}
              refresher={refreshDataCallback}
              currentUser={user}
            />
          ) : dataSelection === "sleeping" ? (
            <Sleep
              kidData={kidData}
              refresher={refreshDataCallback}
              currentUser={user}
            />
          ) : dataSelection === "behavior" ? (
            <Behavior
              kidData={kidData}
              refresher={refreshDataCallback}
              currentUser={user}
            />
          ) : null}
        </div>

        {!nursing &&
        !data &&
        !sleepData &&
        !feeding &&
        food?.length === 0 &&
        kidData?.behavior.length === 0 ? (
          <div style={{ width: 575, margin: 20 }} className="dark-text">
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h5 className="bottom-sm-margin text-center">
                Add data to show your little astronaut's history!
              </h5>
              <img src="/images/kidOnRocket.png" alt="defaultDataImg" />
            </form>
          </div>
        ) : null}

        {nursing ? (
          <div style={{ width: 500, margin: 20 }} className="top-md-margin">
            <form className="form">
              <h4 className="bottom-sm-margin">Nursing</h4>
              <Doughnut data={nursing} />
              <div className="data-box text-align-left">
                {nursingNotes?.length > 0 ? (
                  nursingNotes.map((item, index) => {
                    return (
                      <div key={`Foodie_${item}_${index}`}>
                        <div className="sm-padding left-md-padding">
                          <div>{new Date(item.time).toUTCString()}</div>
                          {item.extra.left ? (
                            <h6>Left: {item.extra.left}</h6>
                          ) : (
                            <h6>Right: {item.extra.right}</h6>
                          )}
                          {item.notes ? <div>Notes: {item.notes}</div> : null}
                        </div>
                        <div className="border-line"></div>
                      </div>
                    );
                  })
                ) : (
                  <div>No Food Data</div>
                )}
              </div>
            </form>
          </div>
        ) : null}

        {data ? (
          <div style={{ width: 500, margin: 20 }} className="top-md-margin">
            <form className="form">
              <h4 className="bottom-sm-margin">Diaper</h4>
              <Bar data={data} options={options} />
              <div className="data-box text-align-left">
                {kidData?.diaper.length > 0 ? (
                  kidData.diaper.map((item, index) => {
                    return (
                      <div key={`Foodie_${item}_${index}`}>
                        <div className="sm-padding left-md-padding">
                          <div>{new Date(item.time).toUTCString()}</div>
                          <h6>Output Type: {item.output}</h6>
                          {item.notes ? <div>Notes: {item.notes}</div> : null}
                        </div>
                        <div className="border-line"></div>
                      </div>
                    );
                  })
                ) : (
                  <div>No Diaper Data</div>
                )}
              </div>
            </form>
          </div>
        ) : null}

        {sleepData ? (
          <div style={{ width: 500, margin: 20 }} className="top-md-margin">
            <form className="form">
              <h4 className="bottom-sm-margin">Sleep</h4>
              <Line data={sleepData} options={lineOptions} />
              <div className="data-box text-align-left">
                {kidData?.sleep.length > 0 ? (
                  kidData.sleep.map((item, index) => {
                    return (
                      <div key={`Foodie_${item}_${index}`}>
                        <div className="sm-padding left-md-padding">
                          <div>{new Date(item.time).toUTCString()}</div>
                          <h6>Minutes Slept: {item.sleepLength}</h6>
                          <h6>
                            Start: {item.sleepStart} - End: {item.sleepEnd}
                          </h6>
                          {item.notes ? <div>Notes: {item.notes}</div> : null}
                        </div>
                        <div className="border-line"></div>
                      </div>
                    );
                  })
                ) : (
                  <div>No Sleep Data</div>
                )}
              </div>
            </form>
          </div>
        ) : null}

        {feeding ? (
          <div style={{ width: 500, margin: 20 }} className="top-md-margin">
            <form className="form">
              <h4 className="bottom-sm-margin">Formula</h4>
              <Bar data={feeding} options={verticalOptions} />
              <div className="data-box text-align-left">
                {formulaNotes?.length > 0 ? (
                  formulaNotes.map((item, index) => {
                    return (
                      <div key={`Foodie_${item}_${index}`}>
                        <div className="sm-padding left-md-padding">
                          <div>{new Date(item.time).toUTCString()}</div>
                          <h6>Total Ounces: {item.extra.oz}</h6>
                          {item.notes ? <div>Notes: {item.notes}</div> : null}
                        </div>
                        <div className="border-line"></div>
                      </div>
                    );
                  })
                ) : (
                  <div>No Forumula Data</div>
                )}
              </div>
            </form>
          </div>
        ) : null}

        {food?.length > 0 || kidData?.behavior.length > 0 ? (
          <div style={{ width: 500, margin: 20 }} className="top-md-margin">
            <form className="form">
              <h4>Food</h4>
              <div className="data-box text-align-left">
                {food?.length > 0 ? (
                  food.map((item, index) => {
                    return (
                      <div key={`Foodie_${item}_${index}`}>
                        <div className="sm-padding left-md-padding">
                          <div>{new Date(item.time).toUTCString()}</div>
                          <h6>{item.extra.title}</h6>
                          {item.notes ? <div>Notes: {item.notes}</div> : null}
                        </div>
                        <div className="border-line"></div>
                      </div>
                    );
                  })
                ) : (
                  <div>No Food Notes</div>
                )}
              </div>
              <div className="top-md-margin"></div>
              <h4>Behavior</h4>
              <div className="data-box text-align-left">
                {kidData?.behavior.length > 0 ? (
                  kidData.behavior.map((item, index) => {
                    return (
                      <div key={`Foodie_${item}_${index}`}>
                        <div className="sm-padding left-md-padding">
                          <div>{new Date(item.time).toUTCString()}</div>
                          <h6>{item.notes}</h6>
                        </div>
                        <div className="border-line"></div>
                      </div>
                    );
                  })
                ) : (
                  <div>No Behavior Notes</div>
                )}
              </div>
            </form>
          </div>
        ) : null}
      </div>
      <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover={true}
        />
      </>
    );
  }
  return <></>;
}
