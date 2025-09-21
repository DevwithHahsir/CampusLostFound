import React, { useState } from "react";
import { db } from "../firebaseConfig/firebaseCore";
import { doc, setDoc } from "firebase/firestore";
import UniversityData from "../data/Universities";

function PostData() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const PostUniData = async () => {
    setLoading(true);
    setStatus("Uploading universities data...");

    try {
      // Post each university as a separate document for better querying
      const universities = UniversityData.universities;
      let successCount = 0;

      for (const [key, university] of Object.entries(universities)) {
        await setDoc(doc(db, "universities", key), {
          id: university.id,
          name: university.name,
          domain: university.domain,
          campuses: university.campuses,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        successCount++;
        setStatus(
          `Uploaded ${successCount}/${
            Object.keys(universities).length
          } universities...`
        );
      }

      setStatus(
        `✅ Successfully uploaded ${successCount} universities to Firestore!`
      );
      console.log("✅ All universities uploaded successfully");
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const PostSingleUniversity = async (universityKey) => {
    setLoading(true);
    try {
      const university = UniversityData.universities[universityKey];
      if (!university) {
        throw new Error(`University ${universityKey} not found`);
      }

      await setDoc(doc(db, "universities", universityKey), {
        id: university.id,
        name: university.name,
        domain: university.domain,
        campuses: university.campuses,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      setStatus(`✅ Successfully uploaded ${university.name}!`);
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h3>🎓 University Data Management</h3>
        </div>
        <div className="card-body">
          <p>Upload university data to Firestore database.</p>

          <div className="d-grid gap-2">
            <button
              className="btn btn-primary"
              onClick={PostUniData}
              disabled={loading}
            >
              {loading
                ? "Uploading..."
                : `Upload All Universities (${
                    Object.keys(UniversityData.universities).length
                  })`}
            </button>

            <button
              className="btn btn-success"
              onClick={() => PostSingleUniversity("univ_umt")}
              disabled={loading}
            >
              Upload Sample University (UMT)
            </button>
          </div>

          {status && (
            <div
              className={`alert mt-3 ${
                status.includes("✅")
                  ? "alert-success"
                  : status.includes("❌")
                  ? "alert-danger"
                  : "alert-info"
              }`}
            >
              {status}
            </div>
          )}

          {loading && (
            <div className="progress mt-3">
              <div
                className="progress-bar progress-bar-animated"
                style={{ width: "100%" }}
              ></div>
            </div>
          )}

          <div className="mt-3">
            <h5>📊 Data Summary:</h5>
            <ul>
              <li>
                <strong>Total Universities:</strong>{" "}
                {Object.keys(UniversityData.universities).length}
              </li>
              <li>
                <strong>Total Campuses:</strong>{" "}
                {Object.values(UniversityData.universities).reduce(
                  (total, uni) => total + Object.keys(uni.campuses).length,
                  0
                )}
              </li>
              <li>
                <strong>Collection Name:</strong> "universities"
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostData;
