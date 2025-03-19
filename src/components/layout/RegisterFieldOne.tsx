import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RegisterFormValues } from "@/interfaces/forms";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";

interface RegisterFieldOneProps {
  formControls: UseFormReturn<RegisterFormValues>;
  moveToStep: (step: number) => void;
}

export default function RegisterFieldOne({
  formControls,
  moveToStep,
}: RegisterFieldOneProps) {
  const {
    register,
    formState: { errors, isSubmitting },
    trigger,
  } = formControls;

  const handleNextStep = async () => {
    // Clear any existing toasts
    // toast.dismiss();

    // Validate only the fields in step 1
    const isValid = await trigger([
      "firstName",
      "lastName",
      "enterpriseUsername",
      "password",
      "confirmPassword",
      "enterpriseName",
      "email",
    ]);

    if (isValid) {
      moveToStep(2);
    } else {
      const currentErrors = formControls.formState.errors;
      // Display separate toast for each field with validation error, without timeouts
      Object.entries(currentErrors).forEach(([field, error]) => {
        if (error && error.message) {
          console.log(`Error in ${field}: ${error.message}`);
          toast.error(error.message as string, {
            id: `error-${field}-${Date.now()}`, // Ensures unique ID
          });
        }
      });

      // If somehow no errors were found but validation failed, show a fallback message
      if (Object.keys(currentErrors).length === 0) {
        toast.error("Please fill out all required fields correctly.");
      }
    }
  };

  return (
    <>
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold">Let's get started</h1>
        <p className="text-balance text-muted-foreground">
          Register to your CloseAuth account
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="firstName">
            First Name
            <HoverCard>
              <HoverCardTrigger>Hover</HoverCardTrigger>
              <HoverCardContent>
                The React Framework – created and maintained by @vercel.
              </HoverCardContent>
            </HoverCard>
          </Label>
          <Input
            {...register("firstName")}
            id="firstName"
            name="firstName"
            type="text"
            placeholder="John"
            className={errors.firstName ? "border-red-500" : ""}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            {...register("lastName")}
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Doe"
            className={errors.lastName ? "border-red-500" : ""}
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="enterpriseUsername">Enterprise username</Label>
        <Input
          {...register("enterpriseUsername")}
          id="enterpriseUsername"
          name="enterpriseUsername"
          type="text"
          placeholder="username"
          className={errors.enterpriseUsername ? "border-red-500" : ""}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          {...register("password")}
          id="password"
          name="password"
          type="password"
          placeholder="*****"
          className={errors.password ? "border-red-500" : ""}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          {...register("confirmPassword")}
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="*****"
          className={errors.confirmPassword ? "border-red-500" : ""}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="enterpriseName">Enterprise Name</Label>
        <Input
          {...register("enterpriseName")}
          id="enterpriseName"
          name="enterpriseName"
          type="text"
          placeholder="Google"
          className={errors.enterpriseName ? "border-red-500" : ""}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Enterprise Email</Label>
        <Input
          {...register("email")}
          id="email"
          name="email"
          type="email"
          placeholder="m@example.com"
          className={errors.email ? "border-red-500" : ""}
        />
      </div>
      <Button
        type="button"
        className="w-full"
        onClick={handleNextStep}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Processing..." : "Get Started"}
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
