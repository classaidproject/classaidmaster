import React, { useState } from "react";

function UserControl({ user, LogoutHandle, setChangeProfilePictureWindow }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="user-control">
      <div className="user-profile-picture" onClick={() => setOpen(!open)}>
        <img
          src={user.picture || "https://via.placeholder.com/50"}
          alt="profilePic"
        />
      </div>
      <div className={open ? "user-menu open" : "user-menu"}>
        <ul>
          <li>
            <div className="user-detail">
              <img
                src={user.picture || "https://via.placeholder.com/50"}
                alt="profilePic"
                onClick={() => setChangeProfilePictureWindow(true)}
              />
              <div>
                <h4>{user.name}</h4>
                <h5>{user.email}</h5>
              </div>
            </div>
          </li>
          <hr />
          <li onClick={LogoutHandle}>
            <button>Sign out</button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default UserControl;
