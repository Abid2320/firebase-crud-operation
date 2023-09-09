
import './App.css';
import { useState, useEffect } from 'react';
import { getDatabase, ref, set, push, onValue, remove, update } from "firebase/database";

function App() {

  // ------user info--------

  const [info, setInfo] = useState({
    fullName: "",
    email: "",
    shortBio: "",
  })

  // -----input handle Change-----
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({
      ...prev,
      [name]: value,
    }))
  };

  // ----input validation schema----
  const [error, setError] = useState();
  const validationSchema = () => {
    if (!info.fullName || !info.email || !info.shortBio) {
      setError("Please fill up the full form");
    } else {
      setError("")
      handleDataSubmition()
    }
  }


  // ---- User data submition to firebase------
  const db = getDatabase();
  const handleDataSubmition = () => {
    set(push(ref(db, 'users')), {
      fullName: info.fullName,
      email: info.email,
      shortBio: info.shortBio
    }).then(() => {
      setInfo({
        fullName: "",
        email: "",
        shortBio: "",
      })
    });
  }
  // -----handle submition-----
  const handleSubmit = () => {
    validationSchema()
  }

  // ---getting data from firebase-----
  const [userData, setUserData] = useState([])
  useEffect(() => {
    const starCountRef = ref(db, 'users');
    onValue(starCountRef, (snapshot) => {
      let arr = [];
      snapshot.forEach((x) => {
        arr.push({ ...x.val(), id: x.key })
      });
      setUserData(arr);
    });
  }, [])


  // -----handeling edit-----
  const [showBtn, setShowBtn] = useState(false)
  const [userId, setUserId] = useState("")
  const handleEdit = (value) => {
    setInfo({
      fullName: value.fullName,
      email: value.email,
      shortBio: value.shortBio,
    })
    setShowBtn(true)
    setUserId(value.id)
  }

  // --------handeling update----
  const handleUpdate = () => {
    update(ref(db, 'users/' + userId), {
      fullName: info.fullName,
      email: info.email,
      shortBio: info.shortBio,
    }).then(() => {
      setShowBtn(false)
      setInfo({
        fullName: "",
        email: "",
        shortBio: "",
      })
    });
  }

  // -------handeling delete------
  const handleDelete = (value) => {
    remove(ref(db, 'users/' + value.id))
  }


  return (
    <>
      <div className="container">

        {/* ---------signup card------ */}

        <div className="singup-card-container">
          <div className="signup-card">
            <h2 className="card-heading">
              Create an account
            </h2>
            <div className="card-field">
              <div className="card-input card-full-name-input">
                <label className="full-name-input-label input-label">
                  Full name
                </label>
                <input value={info.fullName} name="fullName" onChange={handleChange} className="full-name-input input" type="text" placeholder="Enter your full name" />
              </div>
              <div className="card-input card-email-input">
                <label className="email-input-label input-label">
                  Email
                </label>
                <input value={info.email} name="email" onChange={handleChange} className="email-input input" type="email" placeholder="Enter your email" />
              </div>
              <div className="card-input card-shortbio-input">
                <label className="shortbio-input-label input-label">
                  Short bio
                </label>
                <textarea value={info.shortBio} name="shortBio" onChange={handleChange} className="shortbio-input input" type="text" placeholder="Write a short bio about you" />
              </div>
              <div className="submit-btn">
                {
                  showBtn ? <button onClick={handleUpdate} className="signup-card-btn">Update</button> : <button onClick={handleSubmit} className="signup-card-btn">Submit</button>
                }
              </div>
              <div className="card-error">
                {
                  error && <p className="error">{error}</p>
                }
              </div>
            </div>
          </div>
        </div>

        {/* ------signup card end--------- */}

        {/* -------user card start------ */}
        <div className="user-card">
          {userData.map((item, i) => (
            <div key={i} className="user-data-card">
              <div className="user-data-card-button">
                <button className="user-data-edit-btn" onClick={() => { handleEdit(item) }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M21.9774 5.28746L9.44605 17.8188L4.47118 18.6914C4.4293 18.6975 4.39717 18.7 4.371 18.7C4.24209 18.7 4.11667 18.6514 4.00693 18.5458C3.94946 18.4884 3.90667 18.418 3.88222 18.3405C3.85753 18.2622 3.85229 18.1791 3.86696 18.0983L3.86748 18.0954L4.74116 13.1139L17.274 0.581149L21.9774 5.28746ZM22.1198 5.42991C22.1197 5.42976 22.1195 5.4296 22.1193 5.42945L22.1198 5.42991ZM0.96 22.22H23.04C23.2949 22.22 23.5 22.4251 23.5 22.68V23.5H0.5V22.68C0.5 22.4251 0.705143 22.22 0.96 22.22ZM17.2739 0.299939L17.061 0.087L17.2739 0.299939Z" stroke="#4B2201" />
                  </svg>
                </button>
                <button className="user-data-delete-btn" onClick={() => { handleDelete(item) }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="26" viewBox="0 0 24 26" fill="none">
                    <path d="M18.5 4.68V5.18H19H23C23.2587 5.18 23.5 5.40223 23.5 5.72V6.52H21.8625H21.3847L21.363 6.99732L20.5911 23.9948L20.5911 23.995C20.5524 24.8568 19.878 25.5 19.0938 25.5H4.90625C4.12519 25.5 3.44761 24.8536 3.40887 23.995L3.40886 23.9948L2.63699 6.99732L2.61531 6.52H2.1375H0.5V5.72C0.5 5.40223 0.741319 5.18 1 5.18H5H5.5V4.68V2.08C5.5 1.19023 6.19132 0.5 7 0.5H17C17.8087 0.5 18.5 1.19023 18.5 2.08V4.68ZM16.75 5.18H17.25V4.68V2.34V1.84H16.75H7.25H6.75V2.34V4.68V5.18H7.25H16.75Z" stroke="#4B2201" />
                  </svg>
                </button>
              </div>
              <div className="user-data-card-content">
                <h3 className="user-data-card-name">
                  {item.fullName}
                </h3>
                <p className="user-data-card-email">
                  {item.email}
                </p>
                <p className="user-data-card-bio">
                  {item.shortBio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
