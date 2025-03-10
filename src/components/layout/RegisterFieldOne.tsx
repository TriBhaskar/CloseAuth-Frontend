import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { FormikProps } from "formik";
import { FormValues } from "@/interfaces/forms";
import { toast } from "sonner";

interface RegisterFieldOneProps {
  formik: FormikProps<FormValues>; // Replace with proper FormikProps type
  moveToStep: (step: number) => void;
}

export default function RegisterFieldOne({
  formik,
  moveToStep,
}: RegisterFieldOneProps) {
  const handleNextStep = async () => {
    // Dismiss all existing toasts
    toast.dismiss();

    // Trigger validation
    const errors = await formik.validateForm();

    if (Object.keys(errors).length > 0) {
      // Show new validation errors with slight delay between each
      Object.entries(errors).forEach(([field, errorMessage], index) => {
        setTimeout(() => {
          toast.error(field, {
            description: errorMessage as string,
            // duration: 4000,
          });
        }, index * 300);
      });
    } else {
      moveToStep(2);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">Lets get started</h1>
        <p className="text-balance text-muted-foreground">
          Register to your CloseAuth account
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="John"
            onChange={formik.handleChange}
            value={formik.values.firstName}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Doe"
            onChange={formik.handleChange}
            value={formik.values.lastName}
            required
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="enterpriseUsername">Enterprise username</Label>
        <Input
          id="enterpriseUsername"
          name="enterpriseUsername"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.enterpriseUsername}
          placeholder="Google123"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="*****"
          onChange={formik.handleChange}
          value={formik.values.password}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="*****"
          onChange={formik.handleChange}
          value={formik.values.confirmPassword}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="enterpriseName">Enterprise Name</Label>
        <Input
          id="enterpriseName"
          name="enterpriseName"
          type="text"
          placeholder="Google"
          onChange={formik.handleChange}
          value={formik.values.enterpriseName}
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Enterprise Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="m@example.com"
          onChange={formik.handleChange}
          value={formik.values.email}
          required
        />
      </div>
      <Button type="button" className="w-full" onClick={handleNextStep}>
        Get Started
      </Button>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <Link to="/login" className="underline underline-offset-4">
          Login
        </Link>
      </div>
    </>
  );
}
