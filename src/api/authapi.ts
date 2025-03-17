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
