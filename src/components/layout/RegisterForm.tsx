import { IMAGES } from "@/constants/images";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";
import RegisterFieldOne from "./RegisterFieldOne";
import RegisterFieldTwo from "./RegisterFieldTwo";
import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Toaster } from "../ui/sonner";

// Define validation schemas for both steps
const stepOneValidationSchema = Yup.object({
  firstName: Yup.string()
    .max(15, "Must be less than 15 characters")
    .min(3, "Must be more than 3 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .max(15, "Must be less than 15 characters")
    .min(3, "Must be more than 3 characters")
    .required("Last name is required"),
  enterpriseUsername: Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, "Username can only contain letters and numbers")
    .max(15, "Must be less than 15 characters")
    .min(3, "Must be more than 3 characters")
    .required("Username is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
  enterpriseName: Yup.string()
    .min(2, "Must be at least 2 characters")
    .required("Enterprise name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const stepTwoValidationSchema = Yup.object({
  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  pincode: Yup.string()
    .matches(/^\d+$/, "Pincode must be numeric")
    .min(5, "Pincode must be at least 5 digits")
    .required("Pincode is required"),
  contactNumber: Yup.string()
    .matches(/^\d+$/, "Contact number must be numeric")
    .min(10, "Contact number must be at least 10 digits")
    .required("Contact number is required"),
  address: Yup.string()
    .min(10, "Address must be at least 10 characters")
    .required("Address is required"),
});

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [step, setStep] = useState(1);

  const formik = useFormik({
    initialValues: {
      // Step 1 values
      firstName: "",
      lastName: "",
      enterpriseUsername: "",
      password: "",
      confirmPassword: "",
      enterpriseName: "",
      email: "",
      // Step 2 values
      country: "",
      state: "",
      city: "",
      pincode: "",
      contactNumber: "",
      address: "",
    },
    validationSchema:
      step === 1 ? stepOneValidationSchema : stepTwoValidationSchema,
    onSubmit: async (values) => {
      if (step === 1) {
        if (await validateStepOne()) {
          setStep(2);
        }
      } else {
        if (formik.isValid) {
          try {
            const registerRequest = {
              ...values,
            };
            // Handle final form submission
            console.log("Form submitted:", registerRequest);
            // Add your API call here
          } catch (error) {
            console.error("Registration failed", error);
            // toast.error("Registration failed");
          }
        }
      }
    },
  });

  const validateStepOne = async () => {
    try {
      await stepOneValidationSchema.validate(formik.values, {
        abortEarly: false,
      });
      return true;
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors: { [key: string]: string } = {};
        error.inner.forEach((err) => {
          if (err.path) {
            errors[err.path] = err.message;
          }
        });
        formik.setErrors(errors);
      }
      return false;
    }
  };
  return (
    <>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-2">
            <div className="relative hidden bg-muted md:block">
              <img
                src={IMAGES.registerSideImg}
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
            <form className="p-6 md:p-8" onSubmit={formik.handleSubmit}>
              <div className="flex flex-col gap-6">
                <Progress value={step === 1 ? 50 : 100} />
                {step === 1 ? (
                  <RegisterFieldOne formik={formik} moveToStep={setStep} />
                ) : (
                  <RegisterFieldTwo formik={formik} moveToStep={setStep} />
                )}
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
          By clicking continue, you agree to our{" "}
          <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </div>
      </div>
      <Toaster />
    </>
  );
}
