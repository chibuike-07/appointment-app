import { useState, useEffect } from "react";
import AppointmentForm from "../components/AppointmentForm";
import AppointmentList from "../components/AppointmentList";
import Header from "../components/Header";
import { createAppointment } from "../api/appointment";
import Login from "../pages/Login";
import Register from "./Register";
import Button from "../components/Button";
import { removeToken, isAuthenticated } from "../utils/auth";
import AppointmentCounter from "../components/AppointmentCounter";

import { useQuery } from "@apollo/client/react";
import { useMutation } from "@apollo/client/react";
import { UPDATE_APPOINTMENT } from "../graphql/mutations/mutations.js";
import { DELETE_APPOINTMENT } from "../graphql/mutations/mutations.js";
import { GET_APPOINTMENTS } from "../graphql/queries/queries.js";


const Home = () => {
  const [authMode, setAuthMode] = useState("login")
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);

  // const [appointments, setAppointments] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
  };
  const { loading, error, data } = useQuery(GET_APPOINTMENTS, {
    skip: !isLoggedIn,
    fetchPolicy: 'network-only'
  });

  const appointments =
    data?.appointments || [];

  const [updateAppointment] =
    useMutation(
      UPDATE_APPOINTMENT,
      {
        refetchQueries: [
          GET_APPOINTMENTS,
        ],
      }
    );
  const [deleteAppointment] =
    useMutation(
      DELETE_APPOINTMENT,
      {
        refetchQueries: [
          GET_APPOINTMENTS,
        ],
      }
    );


  //creating appointment on endpoint
  const addAppointment = async (appointment) => {
    setCreating(true)

    try {
      const newAppt = await createAppointment(appointment);
      setAppointments((prev) => [...prev, newAppt]);
    } catch (err) {
      console.error(err);
      setError("failed to create appointment")
    } finally {
      setCreating(false);
    }
  };

  //deleting appointment
  const handleDelete = async (
    id
  ) => {
    try {
      await deleteAppointment({
        variables: { id },
      });
    } catch (err) {
      console.error(err);
    }
  };

  //completing appointment
  const toggleComplete = async (
    id,
    completed
  ) => {
    try {
      await updateAppointment({
        variables: {
          id,
          completed:
            !completed,
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (id, updatedFields) => {
    try {
      const updated = await updateAppointment(id, updatedFields);
      setAppointments((prev) =>
        prev.map((appt) => (appt.id === id ? updated : appt))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update appointment");
    }
  };

  //no token? show login page, else show home page
  if (!isLoggedIn) {
    if (authMode === "login") {
      return (
        <Login
          onLogin={() =>
            setIsLoggedIn(true)
          }
          goToRegister={() =>
            setAuthMode("register")
          }
        />
      );
    }
    return (
      <Register
        onRegister={() =>
          setIsLoggedIn(true)
        }
        goTologin={() => setAuthMode("login")}
      />
    );
  }
  if (loading) {
    return <p>loading Appointments</p>
  };
  if (error) {
    console.error('GraphQL error:', error.message);
    if (error.message.includes('Unauthorized')) {
      removeToken();
      window.location.reload();
      return null;
    }
    return <p style={{ color: "red" }}>something went wrong!</p>
  }
  return (
    <div className="homepage">
      <Header title="Appointment Booking System"/>
      <button onClick={handleLogout}>logout </button>
      <AppointmentCounter appointments={appointments} />
      <div className="form-list section">
        <AppointmentForm onAdd={addAppointment} creating={creating} />
        {/* {loading &&<p>Loading Appointment...</p>}  */}

        <AppointmentList appointments={appointments} onDelete={handleDelete} onToggle={toggleComplete} onEdit={handleUpdate} />
        {/* {error && <p>{error}</p>} */}
      </div>
    </div>
  );
};

export default Home;