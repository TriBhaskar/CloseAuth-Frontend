import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "../ui/input-otp";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { OtpFormValues } from "@/interfaces/forms";
import { useState } from "react";
import { verifyOtp } from "@/api/authapi";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Toaster } from "../ui/sonner";

export default function OtpForm() {
  const { email } = useAuth();
  const navigate = useNavigate();
  const { handleSubmit, control } = useForm<OtpFormValues>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      setIsSubmitting(true);
      // Simulate an API call to verify OTP
      console.log(data);
      const enterpriseVerifyOtpRequest = {
        email: email || "",
        otp: data.otp,
      };
      if (enterpriseVerifyOtpRequest.email === "") {
        console.error("Email is required for OTP verification");
        navigate("/register", { replace: true });
        setIsSubmitting(false);
        return;
      }
      const response = await verifyOtp(enterpriseVerifyOtpRequest);
      if (response.status === "SUCCESS") {
        toast.success(response.message + response.timestamp.toString());
        console.log("OTP verified successfully");
      }
      navigate("/login", { replace: true });
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Registration failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  });

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            Verify Email Address
          </CardTitle>
          <CardDescription>
            Please enter the OTP we've sent to {email || "your email"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} id="otp-form">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1 items-center">
                <Controller
                  control={control}
                  name="otp"
                  defaultValue=""
                  render={({ field }) => (
                    <InputOTP
                      maxLength={6}
                      pattern={REGEXP_ONLY_DIGITS}
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>

                      <InputOTPSeparator />

                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  )}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
            form="otp-form"
          >
            {isSubmitting ? "Verifying..." : "Verify"}
          </Button>
        </CardFooter>
        <div className="text-center text-sm mb-4">
          Didn&apos;t receive an email?{" "}
          <Link to="/register" className="underline underline-offset-4">
            Resend
          </Link>
        </div>
      </Card>
      <Toaster richColors />
    </>
  );
}
