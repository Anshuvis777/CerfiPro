import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api", // Spring Boot backend
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Profile Management APIs
export const profileAPI = {
  updateProfile: (data: any) => API.put("/users/profile", data),

  uploadProfilePicture: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return API.post("/users/profile/picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  deleteProfilePicture: () => API.delete("/users/profile/picture"),
};

// Issuer Stats APIs
export const issuerAPI = {
  getIssuerStats: (username: string) => API.get(`/users/${username}/issuer-stats`),
  getIssuedCertificates: (username: string) => API.get(`/certificates?issuer=${username}`),
};

// Employer Stats APIs
export const employerAPI = {
  getEmployerStats: (username: string) => API.get(`/users/${username}/employer-stats`),
};

// Admin Stats APIs
export const adminAPI = {
  getAdminStats: () => API.get("/users/admin/stats"),
};

// Certificate APIs
export const certificateAPI = {
  issueCertificate: (data: any) => API.post("/certificates/issue", data),
  getMyCertificates: () => API.get("/certificates/my-certificates"),
  getIssuedCertificates: () => API.get("/certificates/issued"),
  getCertificateById: (id: string) => API.get(`/certificates/${id}`),
  revokeCertificate: (id: string) => API.delete(`/certificates/${id}/revoke`),
  verifyCertificate: (verificationId: string) => API.get(`/certificates/verify/${verificationId}`),
};

// Certificate Request APIs
export const certificateRequestAPI = {
  createRequest: (data: any) => API.post("/certificate-requests", data),
  getMyRequests: () => API.get("/certificate-requests/my-requests"),
  getPendingRequests: () => API.get("/certificate-requests/pending"),
  getAllRequests: () => API.get("/certificate-requests/all"),
  approveRequest: (id: string, data: any) => API.post(`/certificate-requests/${id}/approve`, data),
  rejectRequest: (id: string, data: any) => API.post(`/certificate-requests/${id}/reject`, data),
};

export default API;
