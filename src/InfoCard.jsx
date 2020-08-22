import React from "react";
import "./InfoCard.css";
import { Card } from "react-bootstrap";
const InfoCard = ({ title, cases, total, active, isRed, ...props }) => {
  console.log(title, active);
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      }`}
    >
      <Card.Body>
        <Card.Text className="gutterBottom">{title}</Card.Text>
        <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
          {cases}
        </h2>
        <Card.Text className="infoBox__total">Total {total}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default InfoCard;
