import { useState } from "react";
import Button from "./Button";
import "./styles.css";
import { useMutation } from "@apollo/client/react";
import { CREATE_APPOINTMENT} from "../graphql/mutations/mutations";
import { GET_APPOINTMENTS} from "../graphql/queries/queries";

const AppointmentForm = () => {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [validationError, setValidationError] = useState("");
  const [createAppointment, { error, loading }] = useMutation(
    CREATE_APPOINTMENT,
    {
      refetchQueries: [
        GET_APPOINTMENTS,
      ],
    }
  );

  const handleSubmit = async () => {
    if (!name || !date || !time) {
      setValidationError("Please fill all fields");
      return;
    }

    try {
      setValidationError("");
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
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', margin: 0, fontSize: '1.5rem', fontWeight: '700' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
          <line x1="19" y1="16" x2="19" y2="22"/>
          <line x1="16" y1="19" x2="22" y2="19"/>
        </svg>
        Book Appointment
      </h2>

      {validationError && (
        <div className="form-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{validationError}</span>
        </div>
      )}

      {error && (
        <div className="form-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{error.message}</span>
        </div>
      )}

      <input
        type="text"
        placeholder="Enter Appointment"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (validationError) setValidationError("");
        }}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => {
          setDate(e.target.value);
          if (validationError) setValidationError("");
        }}
      />

      <input
        type="time"
        value={time}
        onChange={(e) => {
          setTime(e.target.value);
          if (validationError) setValidationError("");
        }}
      />

      <Button text="Submit" onClick={handleSubmit} disabled={loading} />
      {loading && <p>Creating appointment...</p>}

    </div>
  );
};

export default AppointmentForm;