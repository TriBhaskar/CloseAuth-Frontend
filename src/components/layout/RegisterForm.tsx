import { IMAGES } from "@/constants/images";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";
import RegisterFieldOne from "./RegisterFieldOne";
import RegisterFieldTwo from "./RegisterFieldTwo";
import { useState } from "react";
import { Toaster } from "../ui/sonner";
import { Resolver, useForm } from "react-hook-form";
import { FormValues } from "@/interfaces/forms";
// Combined validation schema for the entire form

const resolver: Resolver<FormValues> = async (values) => {
  const errors: { [key: string]: { type: string; message: string } } = {};

  // Step 1 validations
  if (
    !values.firstName ||
    values.firstName.length < 3 ||
    values.firstName.length > 15
  ) {
    errors.firstName = {
      type: "required",
      message: "First name must be between 3 and 15 characters",
    };
  }

  if (
    !values.lastName ||
    values.lastName.length < 3 ||
    values.lastName.length > 15
  ) {
    errors.lastName = {
      type: "required",
      message: "Last name must be between 3 and 15 characters",
    };
  }

  if (
    !values.enterpriseUsername ||
    !/^[a-zA-Z0-9]+$/.test(values.enterpriseUsername)
  ) {
    errors.enterpriseUsername = {
      type: "required",
      message: "Username can only contain letters and numbers",
    };
  }

  if (!values.password || values.password.length < 8) {
    errors.password = {
      type: "required",
      message: "Password must be at least 8 characters",
    };
  }

  if (!values.confirmPassword || values.confirmPassword !== values.password) {
    errors.confirmPassword = {
      type: "required",
      message: "Passwords must match",
    };
  }

  if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = {
      type: "required",
      message: "Please enter a valid email address",
    };
  }

  if (!values.enterpriseName || values.enterpriseName.length < 2) {
    errors.enterpriseName = {
      type: "required",
      message: "Enterprise name must be at least 2 characters",
    };
  }

  // Step 2 validations
  if (!values.country) {
    errors.country = {
      type: "required",
      message: "Country is required",
    };
  }

  if (!values.state) {
    errors.state = {
      type: "required",
      message: "State is required",
    };
  }

  if (!values.city) {
    errors.city = {
      type: "required",
      message: "City is required",
    };
  }

  if (!values.pincode || !/^\d{5,}$/.test(values.pincode)) {
    errors.pincode = {
      type: "required",
      message: "Pincode must be at least 5 digits",
    };
  }

  if (!values.contactNumber || String(values.contactNumber).length < 10) {
    errors.contactNumber = {
      type: "required",
      message: "Contact number must be at least 10 digits",
    };
  }

  if (!values.address || values.address.length < 10) {
    errors.address = {
      type: "required",
      message: "Address must be at least 10 characters",
    };
  }

  return {
    values: Object.keys(errors).length === 0 ? values : {},
    errors,
  };
};

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [step, setStep] = useState(1);
  const formControls = useForm<FormValues>({ resolver });
  const { handleSubmit } = formControls;

  const onSubmit = handleSubmit((data) => console.log(data));

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
            <form className="p-6 md:p-8" onSubmit={onSubmit}>
              <div className="flex flex-col gap-6">
                <Progress value={step === 1 ? 50 : 100} />
                {step === 1 ? (
                  <RegisterFieldOne
                    formControls={formControls}
                    moveToStep={setStep}
                  />
                ) : (
                  <RegisterFieldTwo
                    formControls={formControls}
                    moveToStep={setStep}
                  />
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
      <Toaster richColors />
    </>
  );
}
