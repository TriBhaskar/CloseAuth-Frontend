import { IMAGES } from "@/constants/images";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";
import RegisterFieldOne from "./RegisterFieldOne";
import RegisterFieldTwo from "./RegisterFieldTwo";
import { useState } from "react";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [step, setStep] = useState(1);

  const moveToStep = (step: number) => {
    setStep(step);
  };
  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };
  return (
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
          <form className="p-6 md:p-8" onSubmit={handleNext}>
            <div className="flex flex-col gap-6">
              <Progress value={step === 1 ? 50 : 100} />
              {step === 1 ? (
                <RegisterFieldOne moveToStep={moveToStep} />
              ) : (
                <RegisterFieldTwo moveToStep={moveToStep} />
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
