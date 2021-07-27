import React, { useState } from "react";
import Select from "react-select";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner,
  Alert,
} from "reactstrap";

const HeroCTA = ({ activeUsers, io, setFile, sender }) => {
  const initState = {
    file: null,
    user: "",
    rounds: 1,
    sent: false,
    error: "",
    errMsg: "",
  };

  const [state, setState] = useState(initState);
  const [modal, setModal] = useState(false);
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const toggle = () => {
    setState({ ...state, sent: false });
    setModal(!modal);
  };
  const toggleLoading = () => !loading;

  const handleSelectUser = (selectedOption) => {
    setState({ ...state, user: selectedOption.value });
  };

  const readFile = (e) => {
    toggleLoading();
    if (e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10000000) {
        return setState({
          ...state,
          error: true,
          errMsg: "Sorry the file is larger then 10MB !",
        });
      } else {
        setFile(file);
        setState({
          ...state,
          error: false,
          errMsg: "",
          file: file,
        });
      }
      toggleLoading();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    toggleLoading();

    const { file, user } = state;
    const receiver = activeUsers.find(el => el.sid === user)
    const byte = 400000;
    // Calc rounds
    const roundRes = Math.ceil(file.size / byte);

    // Slice the file
    var fileReader = new FileReader(),
      slice = file.slice(0, byte);

    fileReader.readAsArrayBuffer(slice);
    fileReader.onload = (evt) => {
      var arrayBuffer = fileReader.result;
      io.emit("upload", {
        name: file.name,
        type: file.type,
        size: file.size,
        receiver: user,
        receiverName: `${receiver.emoji} ${receiver.username}`,
        sender: sender.sid,
        senderName: `${sender.emoji} ${sender.username}`,
        round: roundRes,
        data: arrayBuffer,
      });
    };
    setState({
      file: null,
      sent: true,
      user: "",
      error: "",
      errMsg: "",
    });
    toggleLoading();
  };

  // state var
  const { file, sent } = state;

  // formate react-select options
  const userOpt = activeUsers.map((user) => {
    return {
      value: user.sid,
      label: `${user.emoji} ${user.username}`,
    };
  });

  return (
    <>
      <div
        className="hero_cta"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "13rem",
          alignSelf: "center",
          borderRadius: "1rem",
        }}
      >
        <Button
          outline
          color="success"
          className="hero_cta--btn"
          style={{
            width: "4rem",
            height: "4rem",
            borderRadius: "50%",
            margin: "0 auto",
          }}
          onClick={toggle}
        >
          +
        </Button>
        <b className="hero_cta--main">Add your file</b>
        <span className="hero_cta--sub">Up to 20GB</span>
      </div>

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader>Transfer files</ModalHeader>
        <ModalBody>
          {sent ? <Alert color="success">File sent successfuly ✅</Alert> : ""}
          <Form
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: "2rem",
              marginBottom: "2rem",
            }}
          >
            <FormGroup style={{ alignSelf: "flex-start", width: "100%" }}>
              <Label>Select user</Label>
              <Select options={userOpt} onChange={handleSelectUser} />
            </FormGroup>
            <img src="./upload.svg" alt="test" width="250" />
            <FormGroup>
              <Label
                for="file"
                style={{
                  color: "blue",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Browse Files
              </Label>
              <Input
                type="file"
                id="file"
                name="file"
                onChange={readFile}
                hidden
              />
            </FormGroup>
          </Form>
          {loading ? <Spinner type="grow" color="primary" /> : ""}
          {file ? (
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
          ) : (
            ""
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit} disabled={!file}>
            I'm Done
          </Button>{" "}
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default HeroCTA;
