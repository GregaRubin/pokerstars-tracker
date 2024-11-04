import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../userContext';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ToggleSlider } from "react-toggle-slider";
import Switch from "react-switch";

function Profile() {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const [profile, setProfile] = useState({});
  const [error, setError] = useState('');
  const [enabled, setEnabled] = useState(false);
  const [file, setFile] = useState('');
  const [changesMade, setChangesMade] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append('publicStats', enabled);
    formData.append('image', file);

    console.log("we are seding ", enabled, "  and ", file);
    const res = await fetch('http://localhost:3001/users/update', {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    const data = await res.json();
    if (data._id == undefined) {
      setError("Error when updating user");
    }
    else {
      window.location.reload();
    }
  }

  useEffect(function () {
    const getProfile = async function () {

      if (userContext.user) {
        const res = await fetch("http://localhost:3001/users/profile", { credentials: "include" });
        const data = await res.json();

        if (data._id !== undefined) {
          setProfile(data);
          setEnabled(data.publicStats);
          console.log("Profile: ", data);
        } else {
          setError('Error when getting user!');
        }
      }
    }
    getProfile();
  }, []);

  const handleToggleChange = () => {
    setChangesMade(true);
    setEnabled(prevState => !prevState);
  }

  return (
    <div class="container">
      <div class="main-body">
        <div class="row gutters-sm" style={{ marginTop: "40px" }}>
          <div class="col-md-4 mb-3">
            <div class="card">
              <div class="card-body">
                <div class="d-flex flex-column align-items-center text-center">
                  <img src={"http://localhost:3001/" + profile.imagePath} alt="Image unavaiable" class="rounded-circle" width="195" height="195"></img>
                  <div class="mt-3">
                    <h4>{profile.username}</h4>
                    <div class="mb-3">
                      <input accept="image/png, image/gif, image/jpeg" style={{ marginTop: "30px" }} className="form-control" type="file" id="image" required onChange={(e) => { setChangesMade(true); setFile(e.target.files[0]) }} />
                      <label for="image" class="form-label">Change profile picture</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-8">
            <div class="card mb-3">
              <div class="card-body">
                <div class="row">
                  <div class="col-sm-3">
                    <h6 class="mb-0">Email</h6>
                  </div>
                  <div class="col-sm-9 text-secondary">
                    {profile.email}
                  </div>
                </div>
                <hr></hr>
                <div class="row">
                  <div class="col-sm-3">
                    <h6 class="mb-0">Hands played</h6>
                  </div>
                  <div class="col-sm-9 text-secondary">
                    {profile.hands}
                  </div>
                </div>
                <hr></hr>
                <div class="row">
                  <div class="col-sm-3">
                    <h6 class="mb-0">Sessions played</h6>
                  </div>
                  <div class="col-sm-9 text-secondary">
                    {profile.sessions}
                  </div>
                </div>
                <hr></hr>
                <div class="row">
                  <div class="col-sm-3">
                    <h6 class="mb-0">Profit</h6>
                  </div>
                  <div class="col-sm-9 text-secondary">
                    {profile && profile.profit !== undefined
                      ? profile.profit.toFixed(2) + "$"
                      : 'Loading...'}
                  </div>
                </div>
                <hr></hr>
                <div class="row">
                  <div class="col-sm-3">
                    <h6 class="mb-0">Account Visibility</h6>
                    <Switch checked={enabled} onChange={handleToggleChange} id="toggle-switch"></Switch>
                  </div>
                  <div class="col-sm-9 text-secondary">
                    <p>{enabled ? "Public" : "Private"}</p>
                  </div>
                </div>
                <hr></hr>
                <div class="row">
                  <div class="col-sm-12">
                    <button onClick={onSubmit} type="button" disabled={!changesMade} class="btn btn-primary">Save</button>
                    <p></p>
                    <p style={{ color: "red" }}>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  );
}

export default Profile;