import axios, { AxiosResponse, AxiosError } from "axios";

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

export interface EnterpriseVerifyOtpRequest {
  email: string;
  otp: string;
}

export interface EnterpriseVerifyOtpResponse {
  message: string;
  status: string;
  timestamp: string;
}

export interface ApiErrorResponse {
  status: string;
  message: string;
  timestamp?: string;
  errors?: Record<string, string[]>;
}

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to handle API errors
const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    // Handle error based on status code
    if (axiosError.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const errorResponse = axiosError.response.data;
      throw new Error(
        errorResponse.message || "An error occurred with the API"
      );
    } else if (axiosError.request) {
      // The request was made but no response was received
      throw new Error(
        "No response received from server. Please check your network connection."
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      throw new Error(`Error setting up request: ${axiosError.message}`);
    }
  }
  // For non-axios errors
  throw new Error("An unexpected error occurred");
};

export const registerEnterprise = async (
  registerEnterpriseRequest: EnterpriseRegistrationRequest
): Promise<EnterpriseRegistrationResponse> => {
  try {
    if (!API_URL) {
      throw new Error("API URL is not configured");
    }

    console.log(
      "Registering enterprise with request:",
      registerEnterpriseRequest
    );

    const response: AxiosResponse<EnterpriseRegistrationResponse> =
      await apiClient.post("/register", registerEnterpriseRequest);

    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const loginEnterprise = async (
  loginRequest: EnterpriseLoginRequest
): Promise<EnterpriseLoginResponse> => {
  try {
    if (!API_URL) {
      throw new Error("API URL is not configured");
    }

    console.log("Logging in with request:", loginRequest);

    const response: AxiosResponse<EnterpriseLoginResponse> =
      await apiClient.post("/login", loginRequest);

    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const verifyOtp = async (
  verifyOtpRequest: EnterpriseVerifyOtpRequest
): Promise<EnterpriseVerifyOtpResponse> => {
  try {
    if (!API_URL) {
      throw new Error("API URL is not configured");
    }

    console.log("Verifying OTP with request:", verifyOtpRequest);

    const response: AxiosResponse<EnterpriseVerifyOtpResponse> =
      await apiClient.post("/verify-otp", verifyOtpRequest);
    console.log("OTP verification response:", response);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Add interceptors for handling tokens and auth (optional)
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for refreshing tokens (optional)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token logic would go here
        // const refreshToken = localStorage.getItem('refreshToken');
        // const response = await axios.post('/refresh-token', { refreshToken });
        // localStorage.setItem('accessToken', response.data.accessToken);
        // Update the original request with new token
        // originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
        // return axios(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        // Handle refresh token failure (e.g., logout user)
        // localStorage.removeItem('accessToken');
        // localStorage.removeItem('refreshToken');
        // window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
