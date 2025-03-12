import { FormikProps } from "formik";

export interface FormValues {
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
  contactNumber: string;
  address: string;
}

export interface RegisterFieldOneProps {
  formik: FormikProps<FormValues>;
  moveToStep: (step: number) => void;
}
