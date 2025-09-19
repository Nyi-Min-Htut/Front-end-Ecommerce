import axios from "axios";
const api = "http://localhost:8000/api";

// helper function to choose token
function getToken(userType = "employee") {
  if (userType === "customer") {
    return localStorage.getItem("cauthToken");
  }
  // default = employee
  return localStorage.getItem("authToken");
}

// GET
export async function getData(url, params, userType = "employee") {
  const token = getToken(userType);
  let response = await axios.get(`${api}/${url}`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return {
    data: response.data.data,
    status: response.status,
  };
}

// POST
export async function postData(url, data, userType = "employee") {
  try {
    const token = getToken(userType);
    const response = await axios.post(`${api}/${url}`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}

// DELETE
export async function deleteData(url, userType = "employee") {
  try {
    const token = getToken(userType);
    const response = await axios.delete(`${api}/${url}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    return {
      error: error.message,
    };
  }
}
