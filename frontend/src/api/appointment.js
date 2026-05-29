//file that does the linking of frontend to backend
const getToken = () => localStorage.getItem("token");

const BASE_URL = "http://localhost:3000/appointments";

export const fetchAppointments = async () => {
  const res = await fetch(BASE_URL,
    {
    headers: {
      "Authorization": `Bearer ${getToken()}`,
    },
  }
);
  return res.json();
};


export const createAppointment = async (
  appointment
) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(appointment),
  });

  return res.json();
};

export const deleteAllAppointments = async () => {
  await fetch(BASE_URL, { method: "DELETE" });
};

export const deleteAppointment = async (id) => {
  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const updateAppointment = async (id, updates) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(updates),
  });

  return res.json();
};