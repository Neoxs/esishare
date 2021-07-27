import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

const Online = ({activeUsers}) => {
  return (
    <div style={{margin:'5rem 10rem'}}>
        <h3 style={{textAlign: 'center'}}>~~ Share with your network 💫 ~~</h3>
      <Card>
        <CardHeader>Current Active users 🟢</CardHeader>
        <CardBody>
            <ListGroup>
                { activeUsers.map( user => {
                    return <ListGroupItem key={user.emoji}>{user.emoji} {user.username}</ListGroupItem>
                } ) }
            </ListGroup>
        </CardBody>
      </Card>
    </div>
  );
};

export default Online
