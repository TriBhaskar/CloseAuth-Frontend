import { Label } from "@radix-ui/react-label";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast, Toaster } from "sonner";
import { ResetPasswordFormValues } from "@/interfaces/forms";
import { Resolver, SubmitErrorHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { resetPassword } from "@/api/authapi";
import { IMAGES } from "@/constants/images";
import { useSearchParams } from "react-router-dom";

const resolver: Resolver<ResetPasswordFormValues> = async (values) => {
  const errors: { [key: string]: { type: string; message: string } } = {};
  // Password validation
  if (!values.newPassword) {
    errors.password = {
      type: "required",
      message: "Password is required",
    };
  } else if (values.newPassword.length < 8) {
    errors.password = {
      type: "minLength",
      message: "Password must be at least 8 characters",
    };
  }

  if (!values.confirmPassword) {
    errors.password = {
      type: "required",
      message: "Password is required",
    };
  } else if (values.confirmPassword.length < 8) {
    errors.password = {
      type: "minLength",
      message: "Password must be at least 8 characters",
    };
  }

  return {
    values: Object.keys(errors).length === 0 ? values : {},
    errors,
  };
};

export default function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const formControls = useForm<ResetPasswordFormValues>({ resolver });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = formControls;

  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const onError: SubmitErrorHandler<ResetPasswordFormValues> = (errors) => {
    console.log("Validation errors:", errors);

    // Display toast for each error
    Object.entries(errors).forEach(([field, error]) => {
      toast.error(error.message, {
        id: `${field}-error-${Date.now()}`,
      });
    });
  };

  // This function will run when validation succeeds
  const onValid = async (data: ResetPasswordFormValues) => {
    setIsSubmitting(true);
    console.log("Form submitted with data:", data);

    if (!token) {
      toast.error("No reset token found");
      return;
    }

    console.log("Reset token:", token);
    console.log("New Password:", data.newPassword);

    try {
      // Simulate API call
      const ResetPasswordRequest = {
        token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      };
      const response = await resetPassword(ResetPasswordRequest);
      if (response.status === "SUCCESS") {
        toast.success(response.message);
        reset();
        // navigate("/verify-email");
        // Optional: Redirect to login page
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Login failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className={cn("flex flex-col gap-6", className)} {...props}>
        <Card className="overflow-hidden">
          <CardContent className="grid p-0 md:grid-cols-2">
            <form
              className="p-6 md:p-8"
              onSubmit={handleSubmit(onValid, onError)}
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-balance text-muted-foreground">
                    Enter your new password to access your account.
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    {...register("newPassword")}
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    placeholder="********"
                    className={errors.newPassword ? "border-red-500" : ""}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Confirm Password</Label>
                  </div>
                  <Input
                    {...register("confirmPassword")}
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="********"
                    className={errors.confirmPassword ? "border-red-500" : ""}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Reset Password"}
                </Button>
              </div>
            </form>
            <div className="relative hidden bg-muted md:block">
              <img
                src={IMAGES.resetPasswordSide}
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <Toaster richColors />
    </>
  );
}
