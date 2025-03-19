export interface RegisterFormValues {
  // Step 1 values
  firstName: string;
  lastName: string;
  enterpriseUsername: string;
  password: string;
  confirmPassword: string;
  enterpriseName: string;
  email: string;
  // Step 2 values
  country: string;
  state: string;
  city: string;
  pincode: string;
  contactNumber: number;
  address: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}
