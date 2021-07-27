import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

import Hero from "./components/Hero";
import Online from "./components/Online";
import helpers from "./helpers/Init";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Toast,
  ToastBody,
  ToastHeader,
} from "reactstrap";

function App() {
  const [user, setUser] = useState("");
  const [active, setActive] = useState([]);
  const [socket, setSocket] = useState(null);
  const [buffer, setBuffer] = useState([]);
  const [file, setFile] = useState(null);
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState(false);
  const [data, setData] = useState(null);
  const toggle = () => setModal(!modal);
  const toggleToast = () => setToast(!toast);

  const ENDPOINT = "http://127.0.0.1:5000";

  const download = () => {
    const link = document.createElement("a");
    const data = file;
    const blob = new Blob([data.data], { type: data.type });
    const objectURL = URL.createObjectURL(blob);

    link.href = objectURL;
    link.href = URL.createObjectURL(blob);
    link.download = data.name;
    link.click();

    setFile(null);
    toggle();
    socket.emit("high", data);
  };

  // eslint-disable-next-line
  useEffect(() => {
    // generate user data
    const initData = {
      username: helpers.randomUsername(),
      emoji: helpers.randomEmoji(),
      sid: "",
    };

    setUser(initData);

    // init socketio
    const socket = socketIOClient(ENDPOINT);
    setSocket(socket);

    // sockets events
    socket.on("connect", () => {
      socket.emit("join", initData);
    });

    socket.on("update", (activeUsers) => {
      setActive(activeUsers);
      const found = activeUsers.find((el) => el.emoji === initData.emoji);
      setUser(found);
    });

    socket.on("download", (data) => {
      let arrBuff = buffer;
      arrBuff.push(data.data);
      setBuffer(arrBuff);
      setFile(data);
      toggle();
    });

    socket.on("five", (data) => {
      setData(data);
      setToast(true);
    });
    // eslint-disable-next-line
  }, []);

  return (
    <div className="App">
      <Hero user={user} activeUsers={active} io={socket} setFile={setFile} />
      <Online activeUsers={active} io={socket} />
      {file ? (
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>✅ File received !</ModalHeader>
          <ModalBody>
            <div>
              You just received a file from <b>{file.senderName}</b>
            </div>
            <div>Do you wish to download ?</div>
            <br />
            <div>
              <div>
                <b>File name:</b> {file.name}
              </div>
              <div>
                <b>File size:</b>{" "}
                {parseFloat(file.size / 1000000).toFixed(2) + " mb"}
              </div>
              <div>
                <b>File format:</b> {file.type}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggle}>
              Ignore 🚮
            </Button>
            <Button color="success" onClick={download}>
              Download ⬇️
            </Button>
          </ModalFooter>
        </Modal>
      ) : (
        ""
      )}
      {data ? (
        <Toast
          className="bg-warning"
          isOpen={toast}
          style={{ position: "absolute", left: "2rem", bottom: "2rem" }}
        >
          <ToastHeader
            toggle={toggleToast}
            style={{ justifyContent: "space-between" }}
          >
            High five from <b>{data.receiverName}</b> 🙌
          </ToastHeader>
          <ToastBody>The receiver just downloaded the file !</ToastBody>
        </Toast>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
