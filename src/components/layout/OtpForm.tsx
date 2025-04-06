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
import { Link, useLocation } from "react-router-dom";

export default function OtpForm() {
  const { email } = useLocation().state || {};
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-center text-xl">
          Verify Email Address
        </CardTitle>
        <CardDescription>
          Please enter the OTP we've send to {email}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1 items-center">
              <InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS}>
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
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button className="w-full">Verify</Button>
      </CardFooter>
      <div className="text-center text-sm mb-4">
        Didn&apos;t recieve an email?{" "}
        <Link to="/register" className="underline underline-offset-4">
          Resend
        </Link>
      </div>
    </Card>
  );
}
