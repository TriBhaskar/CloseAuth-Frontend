import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState, useEffect } from "react";
import "react-country-state-city/dist/react-country-state-city.css";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { GetCity, GetCountries, GetState } from "react-country-state-city";
import { City, Country, State } from "react-country-state-city/dist/esm/types";
import { Textarea } from "../ui/textarea";
import { FormValues } from "@/interfaces/forms";
import { toast } from "sonner";
import { UseFormReturn } from "react-hook-form";

interface RegisterFieldTwoProps {
  formControls: UseFormReturn<FormValues>;
  moveToStep: (step: number) => void;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  isSubmitting: boolean;
}

export default function RegisterFieldTwo({
  formControls,
  moveToStep,
  handleSubmit,
  isSubmitting,
}: RegisterFieldTwoProps) {
  const [countriesList, setCountriesList] = useState<Country[]>([]);
  const [stateList, setStateList] = useState<State[]>([]);
  const [cityList, setCitiesList] = useState<City[]>([]);
  const [countryId, setCountryId] = useState<string | null>(null);
  const [stateId, setStateId] = useState<string | null>(null);

  const {
    register,
    formState: { errors },
    setValue,
    trigger,
  } = formControls;

  // Fetch countries on component mount
  useEffect(() => {
    GetCountries().then((result) => {
      setCountriesList(result);
    });
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (countryId) {
      GetState(parseInt(countryId)).then((result) => {
        setStateList(result);
        // Reset state and city selections when country changes
        setStateId(null);
        setCitiesList([]);
        setValue("state", "");
        setValue("city", "");
      });
    }
  }, [countryId, setValue]);

  // Fetch cities when state changes
  useEffect(() => {
    if (countryId && stateId) {
      GetCity(parseInt(countryId), parseInt(stateId)).then((result) => {
        setCitiesList(result);
        setValue("city", "");
      });
    }
  }, [stateId, countryId, setValue]);

  const validateFields = async () => {
    // Validate step 2 fields
    const isValid = await trigger([
      "country",
      "state",
      "city",
      "pincode",
      "contactNumber",
      "address",
    ]);

    if (!isValid) {
      // Show toast for each error
      Object.keys(errors).forEach((key) => {
        const errorMessage = errors[key as keyof FormValues]?.message;
        if (errorMessage) {
          toast.error(errorMessage as string);
        }
      });
    } else {
      console.log("All fields are valid. Proceeding with form submission.");
      // Proceed with form submission or next step
      handleSubmit();
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
          <Label htmlFor="country">Country</Label>
          <Select
            onValueChange={(value) => {
              setCountryId(value);
              setValue("country", value);
              trigger("country");
            }}
          >
            <SelectTrigger
              className={`w-full ${errors.country ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Select your country" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Countries</SelectLabel>
                {countriesList.map((country) => (
                  <SelectItem key={country.id} value={country.id.toString()}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="state">State</Label>
          <Select
            disabled={!countryId}
            onValueChange={(value) => {
              setStateId(value);
              setValue("state", value);
              trigger("state");
            }}
          >
            <SelectTrigger
              className={`w-full ${errors.state ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Select your state" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>States</SelectLabel>
                {stateList.map((state) => (
                  <SelectItem key={state.id} value={state.id.toString()}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="contactNumber">Enterprise Contact Number</Label>
        <Input
          {...register("contactNumber")}
          id="contactNumber"
          name="contactNumber"
          type="tel"
          placeholder="1234567890"
          className={errors.contactNumber ? "border-red-500" : ""}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="city">City</Label>
          <Select
            disabled={!stateId}
            onValueChange={(value) => {
              setValue("city", value);
              trigger("city");
            }}
          >
            <SelectTrigger
              className={`w-full ${errors.city ? "border-red-500" : ""}`}
            >
              <SelectValue placeholder="Select your city" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Cities</SelectLabel>
                {cityList.map((city) => (
                  <SelectItem key={city.id} value={city.id.toString()}>
                    {city.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="pincode">Pincode</Label>
          <Input
            {...register("pincode")}
            id="pincode"
            name="pincode"
            type="text"
            placeholder="42205"
            className={errors.pincode ? "border-red-500" : ""}
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address">Enterprise Address</Label>
        <Textarea
          {...register("address")}
          id="address"
          name="address"
          placeholder="Enter Your Full Address"
          className={errors.address ? "border-red-500" : ""}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Button
          type="button"
          className="w-full"
          onClick={() => moveToStep(1)}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          type="button"
          className="w-full"
          disabled={isSubmitting}
          onClick={validateFields}
        >
          {isSubmitting ? "Processing..." : "Register"}
        </Button>
      </div>
      <div className="text-center text-sm mt-2">
        Already have an account?{" "}
        <a href="/login" className="underline underline-offset-4">
          Login
        </a>
      </div>
    </>
  );
}
