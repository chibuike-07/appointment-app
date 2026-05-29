import { useState } from "react";
import Button from "./Button";
import "./styles.css";
import { useMutation } from "@apollo/client/react";
import { CREATE_APPOINTMENT } from "../graphql/mutations/mutations";
import { GET_APPOINTMENTS } from "../graphql/queries/queries";

const AppointmentForm = ({ onAdd, creating }) => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [createAppointment, { error }] = useMutation(
    CREATE_APPOINTMENT,
    {
      refetchQueries: [
        GET_APPOINTMENTS,
      ],
    }
  );

  const handleSubmit = async () => {
    if (!name || !date || !time) {
      alert("Please fill all fields");
      return;
    }

    try {
      await createAppointment({
        variables: { name, date, time },
      });

      // Only clear the form if the creation was successful!
      setName("");
      setDate("");
      setTime("");
    } catch (err) {
      // Apollo Client throws the GraphQL error here as well
      console.error("Mutation failed:", err);
    }
  };

  return (
    <div className="appointment-form">
      <h2>Book Appointment</h2>

      {error && <p style={{ color: "red" }}>{error.message}</p>}

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />

      <Button text="Submit" onClick={handleSubmit} disabled={creating} />
      {creating && <p>Creating appointment...</p>}

    </div>
  );
};

export default AppointmentForm;