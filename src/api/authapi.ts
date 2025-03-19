// write interface for this json

interface EnterpriseDetails {
  enterpriseName: string;
  enterpriseEmail: string;
  enterpriseContactNumber: string;
  enterpriseCountry: string;
  enterpriseState: string;
  enterpriseCity: string;
  enterprisePinCode: string;
  enterpriseAddress: string;
}

export interface EnterpriseRegistrationRequest {
  userFirstName: string;
  userLastName: string;
  userName: string;
  userPassword: string;
  enterpriseDetails: EnterpriseDetails;
}

export interface EnterpriseRegistrationResponse {
  status: string;
  message: string;
  username: string;
  otpValiditySeconds: number;
  timestamp: string;
}

export interface EnterpriseLoginRequest {
  email: string;
  password: string;
}

export interface EnterpriseLoginResponse {
  status: string;
  message: string;
  data: {
    user: {
      userId: number;
      username: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
    auth: {
      accessToken: string;
      refreshToken: string;
      expiresIn: number;
    };
  };
}

const API_URL = `${import.meta.env.VITE_API_URL}`;

export const registerEnterprise = async (
  registerEnterpriseRequest: EnterpriseRegistrationRequest
): Promise<EnterpriseRegistrationResponse> => {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }
  console.log(
    "Registering enterprise with request:",
    registerEnterpriseRequest
  );
  console.log("API URL:", API_URL);
  const response = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerEnterpriseRequest),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const loginEnterprise = async (
  loginRequest: EnterpriseLoginRequest
): Promise<EnterpriseLoginResponse> => {
  if (!API_URL) {
    throw new Error("API URL is not configured");
  }
  console.log("Logging in with request:", loginRequest);
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginRequest),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
