import React from "react";
import "../styles/Layout.css";
import Logo from "../assets/logo/logo.svg";
import Image from "next/image";
import {
  Diagram,
  Home,
  LampCharge,
  NotificationBing,
  RepeateOne,
  SearchNormal1,
  Setting2,
  Task,
  TaskSquare,
} from "iconsax-react";
import Profile from "../assets/Images/profile-holder.svg";
import TaskBoard from "../components/TaskBoard";

function Layout() {
  return (
    <div className="l-container">
      <div className="l-wrapper">
        <div className="l-headerbar">
          <div className="l-header-left">
            <Image src={Logo} width={40} height={40} alt="logo" />
            <h2>Code94 Labs</h2>
          </div>
          <div className="l-header-right">
            <div className="search-bar">
              <SearchNormal1 size={24} color="#727272" />
              <input placeholder="Search tasks"></input>
            </div>
            <div className="profile">
              <Image src={Profile} width={70} height={70} alt="profile" />
            </div>
          </div>
        </div>
        <div className="l-inner-container">
          <div className="l-side-bar">
            <div className="side-menu">
              <Home size={24} color="#1d1d1d" style={{ marginRight: "10px" }} />
              <p>Home</p>
            </div>
            <div className="side-menu active">
              <TaskSquare
                size={24}
                color="#ffffff"
                style={{ marginRight: "10px" }}
              />
              <p>Tasks</p>
            </div>
            <div className="side-menu">
              <Diagram
                size={24}
                color="#1d1d1d"
                style={{ marginRight: "10px" }}
              />
              <p>Report</p>
            </div>
            <div className="side-menu">
              <LampCharge
                size={24}
                color="#1d1d1d"
                style={{ marginRight: "10px" }}
              />
              <p>Insights</p>
            </div>
            <div className="side-menu">
              <NotificationBing
                size={24}
                color="#1d1d1d"
                style={{ marginRight: "10px" }}
              />
              <p>Inbox</p>
            </div>
            <div className="side-menu">
              <Setting2
                size={24}
                color="#1d1d1d"
                style={{ marginRight: "10px" }}
              />
              <p>Settings</p>
            </div>
          </div>
          <div className="l-content-container">
            <TaskBoard />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
