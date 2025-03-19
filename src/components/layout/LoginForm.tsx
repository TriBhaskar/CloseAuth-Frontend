import { cn } from "@/lib/utils";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { IMAGES } from "@/constants/images";
import { Link, useNavigate } from "react-router-dom";
import { LoginFormValues } from "@/interfaces/forms";
import { Resolver, SubmitErrorHandler, useForm } from "react-hook-form";
import { toast, Toaster } from "sonner";
import { loginEnterprise } from "@/api/authapi";
import { useState } from "react";

const resolver: Resolver<LoginFormValues> = async (values) => {
  const errors: { [key: string]: { type: string; message: string } } = {};

  // Email validation
  if (!values.email) {
    errors.email = {
      type: "required",
      message: "Email is required",
    };
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = {
      type: "pattern",
      message: "Email is invalid",
    };
  }

  // Password validation
  if (!values.password) {
    errors.password = {
      type: "required",
      message: "Password is required",
    };
  } else if (values.password.length < 8) {
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
export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const formControls = useForm<LoginFormValues>({ resolver });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = formControls;
  const navigate = useNavigate();

  // This function will run when validation fails
  const onError: SubmitErrorHandler<LoginFormValues> = (errors) => {
    console.log("Validation errors:", errors);

    // Display toast for each error
    Object.entries(errors).forEach(([field, error]) => {
      toast.error(error.message, {
        id: `${field}-error-${Date.now()}`,
      });
    });
  };

  // This function will run when validation succeeds
  const onValid = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    console.log("Form submitted with data:", data);

    try {
      // Simulate API call
      const EnterpriseLoginRequest = {
        email: data.email,
        password: data.password,
      };
      const response = await loginEnterprise(EnterpriseLoginRequest);
      if (response.status === "success") {
        toast.success(response.message + response.data.user.firstName);
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
                    Login to your Acme Inc account
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...register("email")}
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      href="#"
                      className="ml-auto text-sm underline-offset-2 hover:underline"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input
                    {...register("password")}
                    id="password"
                    name="password"
                    type="password"
                    placeholder="********"
                    className={errors.password ? "border-red-500" : ""}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Processing..." : "Login"}
                </Button>
                <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                  <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link to="/register" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </div>
            </form>
            <div className="relative hidden bg-muted md:block">
              <img
                src={IMAGES.loginSideImg}
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
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
