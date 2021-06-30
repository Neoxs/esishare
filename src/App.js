import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

import Hero from './components/Hero'
import Online from './components/Online'
import helpers from './helpers/Init'


function App() {

  const [user, setUser] = useState("");
  const [active, setActive] = useState([]);
  const ENDPOINT = "http://127.0.0.1:5000";

  useEffect(() => {
    // generate user data
    const initData = {
      username: helpers.randomUsername(),
      emoji: helpers.randomEmoji(),
      sid: ''
    }

    setUser(initData)

    // init socketio
    const socket = socketIOClient(ENDPOINT);

    // sockets events
    socket.on("connect", () => {
      socket.emit("join", initData)
    })

    socket.on("update", (activeUsers) => {
      setActive(activeUsers)
    })
  }, []);

  return (
    <div className="App">
      <Hero user={user} />
      <Online activeUsers={active} />
    </div>
  );
}

export default App;
