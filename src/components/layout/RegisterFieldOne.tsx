import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface RegisterFieldOneProps {
  moveToStep: (step: number) => void;
}

export default function RegisterFieldOne({
  moveToStep,
}: RegisterFieldOneProps) {
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
          <Label htmlFor="first_name">First Name</Label>
          <Input id="first_name" type="text" placeholder="John" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input id="last_name" type="text" placeholder="Doe" required />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="enterpriseusername">Enterprise username</Label>
        <Input
          id="enterpriseusername"
          type="enterpriseusername"
          placeholder="Google123"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="*****" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="cpassword">Confirm Password</Label>
        <Input id="cpassword" type="cpassword" placeholder="*****" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="enterprisename">Enterprise Name</Label>
        <Input
          id="enterprisename"
          type="enterprisename"
          placeholder="Google"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="email">Enterprise Email</Label>
        <Input id="email" type="email" placeholder="m@example.com" required />
      </div>
      {/* <div className="grid gap-2">
        <Label htmlFor="phoneno">Phone no</Label>
        <Input id="phoneno" type="phoneno" placeholder="1234567890" required />
      </div> */}
      <Button type="button" className="w-full" onClick={() => moveToStep(2)}>
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
