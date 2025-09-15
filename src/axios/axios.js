import axios from "axios";
const api = "http://localhost:8000/api";

export async function getData(url, params) {
  const token = localStorage.getItem("authToken");
  let response = await axios.get(api + "/" + url, {
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

export async function postData(url, data) {
  try {
    const response = await axios.post(api + "/" + url, data, {
      headers: {
        "Content-Type": "multipart/form-data",
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

export async function deleteData(url) {
  try {
    const response = await axios.delete(api + "/" + url);
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
