import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EditKid from "../components/editKid";
import { Line } from "react-chartjs-2";
import { Link } from "react-router-dom";
import PrivateRoom from "./privateChat";
import Documentations from "./documentation";
import { BsArrowRight } from "react-icons/bs";
import Aos from "aos";
import "aos/dist/aos.css";

const BASE_URL = "http://localhost:8080/";

export default function KidData() {
  const [kidData, setKidData] = useState();
  const [sleepData, setSleepData] = useState();
  const [updateGraph, setUpdateGraph] = useState(true);
  let { kidID } = useParams();

  const graphUpdateCallBack = (value) => {
    setUpdateGraph(true);
  };

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    if (updateGraph) {
      fetch(`${BASE_URL}api/kids/${kidID}`)
        .then((res) => res.json())
        .then((data) => {
          setKidData(data);
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

          let colorArr;
          let borderArr;
          switch (data.theme) {
            case "blue":
              colorArr = "#52d6f4b4";
              borderArr = "#52d6f4";
              break;
            case "pink":
              colorArr = "#f2c4ceb6";
              borderArr = "#F2C4CE";
              break;
            case "orange":
              colorArr = "#ec7f37ad";
              borderArr = "#EC7F37";
              break;
            case "gold":
              colorArr = "#ad974fb4";
              borderArr = "#AD974F";
              break;
            default:
              colorArr = null;
              borderArr = null;
          }
          setSleepData({
            labels: [firstTime, secondTime, thirdTime, fourthTime, lastTime],
            datasets: [
              {
                label: "Minutes Slept - Last 5 Inputs",
                data: [first, second, third, fourth, last],
                fill: false,
                backgroundColor: colorArr,
                borderColor: borderArr,
              },
            ],
          });
          setUpdateGraph(false);
        });
    }
  }, [kidID, updateGraph]);

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

  if (kidData) {
    return (
      <div data-aos="fade-left" className="pg content">
        <div className="top-lg-margin white-bg zero-padding profile-data row-plain sm-data-mobile">
          <div>
            <EditKid kidData={kidData} graphUpdate={graphUpdateCallBack} />
            <PrivateRoom kidData={kidData} />
          </div>
          <div className="width-700">
            <div className="">
              <div className="row-space-between sm-margin left-lg-margin right-lg-margin">
                <h5>Analytics</h5>
                <Link
                  className="view-data-btn row-plain"
                  to={`/app/${kidID}/graph`}
                >
                  <div>View All</div>
                  <div style={{ fontSize: 20, marginTop: 5, marginLeft: 5 }}>
                    <BsArrowRight />
                  </div>
                </Link>
              </div>
              <Link
                className="row bottom-md-padding"
                to={`/app/${kidID}/graph`}
              >
                <form className="width-400">
                  <Line data={sleepData} options={lineOptions} />
                </form>
              </Link>
            </div>
            <div className="border-line"></div>
            <div style={{ height: 260 }} className="">
              <Documentations kidData={kidData} />
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <></>;
}
