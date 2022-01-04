import { useState } from "react";
import {
  AiOutlineFileWord,
  AiOutlineFilePdf,
  AiOutlineFileAdd,
} from "react-icons/ai";

const BASE_URL = "http://localhost:8080/";

export default function Documentations({ kidData }) {
  const [error, setError] = useState(false);
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [kid, setKid] = useState({ ...kidData });

  const handleSubmit = (e) => {
    if (uploadedDoc) {
      let formData = new FormData();
      formData.append("document", uploadedDoc);

      fetch(`${BASE_URL}api/documents`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          let newDocument = `${BASE_URL}documents/${data.file}`;
          fetch(`${BASE_URL}api/kids/${kidData._id}`, {
            method: "POST",
            body: JSON.stringify({
              ...kid,
              document: [...kid.document, newDocument],
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          })
            .then((res) => res.json())
            .then((data) => setKid(data));
        })
        .catch((err) => console.log(err));
    }
    setUploadedDoc(null);
    e.preventDefault();
  };

  const fileSelectedHandler = (e) => {
    if (
      e.target.files[0].name.includes(".docx") ||
      e.target.files[0].name.includes(".pdf")
    ) {
      setError(false);
      setUploadedDoc(e.target.files[0]);
    } else {
      setError(true);
    }
    e.preventDefault();
  };

  const deleteDocument = (name) => {
    let newDocArr = [];
    let docArray = name.split("documents/");
    kid.document.forEach((doc, index) => {
      if (doc !== name) {
        newDocArr.push(doc);
      }
    });
    fetch(`${BASE_URL}api/kids/${kid._id}`, {
      method: "POST",
      body: JSON.stringify({
        ...kid,
        document: newDocArr,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (
          docArray[1] !== "1-BehaviorReport.docx" &&
          docArray[1] !== "2-EmergencyContact.pdf" &&
          docArray[1] !== "3-Registration.pdf" &&
          docArray[1] !== "4-IncidentReport.docx"
        ) {
          fetch(`${BASE_URL}api/delete-document`, {
            method: "POST",
            body: JSON.stringify({
              doc: name,
            }),
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          }).catch((err) => console.log(err));
        }
        setKid(data);
      });
  };

  return (
    <div>
      <h5 className="left-lg-margin">Documentation</h5>
      <div className="row">
        <div className="document-box">
          {kid?.document.length > 0
            ? kid.document.map((name, i) => {
                let newName = name.toString();
                let docName = newName.substr(newName.indexOf("-") + 1);
                let isWord = docName.includes(".docx");
                return (
                  <div
                    key={`${docName}_${i}`}
                    className="document row-space-between"
                  >
                    <a
                      className="row-plain ellipsis"
                      href={newName}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {isWord ? (
                        <div
                          style={{
                            color: "blue",
                            fontSize: 22,
                          }}
                        >
                          <AiOutlineFileWord />
                        </div>
                      ) : (
                        <div
                          style={{
                            color: "red",
                            fontSize: 22,
                          }}
                        >
                          <AiOutlineFilePdf />
                        </div>
                      )}
                      <h6
                        className="dark-text"
                        style={{ marginBottom: 5, marginLeft: 5 }}
                      >
                        {docName}
                      </h6>
                    </a>
                    <h6
                      onClick={() => deleteDocument(newName)}
                      className="x-close"
                    >
                      X
                    </h6>
                  </div>
                );
              })
            : null}
        </div>
      </div>
      {error ? (
        <div className="left-lg-margin file-error">
          Incorrect File. Must be ".docx" or ".pdf"
        </div>
      ) : null}
      <div className="row">
        <form
          className="document-btn-group"
          encType="multipart/form-data"
          onSubmit={handleSubmit}
        >
          {uploadedDoc ? (
            <>
              <div className="upload-btn">
                <div className="row-plain">
                  {uploadedDoc.name.toString().includes(".docx") ? (
                    <div
                      style={{
                        color: "grey",
                        fontSize: 22,
                      }}
                    >
                      <AiOutlineFileWord />
                    </div>
                  ) : (
                    <div
                      style={{
                        color: "grey",
                        fontSize: 22,
                      }}
                    >
                      <AiOutlineFilePdf />
                    </div>
                  )}
                  <h6
                    className="dark-text ellipsis"
                    style={{ marginBottom: 5, marginLeft: 5 }}
                  >
                    {uploadedDoc.name}
                  </h6>
                </div>
              </div>
              <input className="save-btn sm-width" type="submit" value="Save" />
            </>
          ) : (
            <label className="upload-btn border-test-2">
              <input
                type="file"
                name="document"
                onChange={fileSelectedHandler}
              />
              <div className="row">
                <div className="row-plain">
                  <div style={{ fontSize: 22, opacity: 0.4 }}>
                    <AiOutlineFileAdd />
                  </div>
                  <h6
                    className="dark-text"
                    style={{ marginBottom: 5, marginLeft: 5 }}
                  >
                    Upload File
                  </h6>
                </div>
              </div>
            </label>
          )}
        </form>
      </div>
    </div>
  );
}
