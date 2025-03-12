import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState, useEffect, useCallback } from "react";
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
import { FormikProps } from "formik";
import { FormValues } from "@/interfaces/forms";
import { toast } from "sonner";

interface RegisterFieldTwoProps {
  formik: FormikProps<FormValues>;
  moveToStep: (step: number) => void;
}

export default function RegisterFieldTwo({
  formik,
  moveToStep,
}: RegisterFieldTwoProps) {
  const [countriesList, setCountriesList] = useState<Country[]>([]);
  const [stateList, setStateList] = useState<State[]>([]);
  const [cityList, setCitiesList] = useState<City[]>([]);

  // Memoize form field handlers for better performance
  const handleContactChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      formik.handleChange(e);
    },
    [formik]
  );

  const handleAddressChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      formik.handleChange(e);
    },
    [formik]
  );

  // Fetch countries on component mount
  useEffect(() => {
    GetCountries().then((result) => {
      setCountriesList(result);
    });
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (formik.values.country) {
      GetState(parseInt(formik.values.country)).then((result) => {
        setStateList(result);
      });
    } else {
      setStateList([]);
    }
  }, [formik.values.country]);

  // Fetch cities when state changes
  useEffect(() => {
    if (formik.values.state && formik.values.country) {
      GetCity(
        parseInt(formik.values.country),
        parseInt(formik.values.state)
      ).then((result) => {
        setCitiesList(result);
      });
    } else {
      setCitiesList([]);
    }
  }, [formik.values.state, formik.values.country]);

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Dismiss all existing toasts
    toast.dismiss();

    // Validate just step 2 fields
    await formik.validateForm({
      country: formik.values.country,
      state: formik.values.state,
      city: formik.values.city,
      pincode: formik.values.pincode,
      contactNumber: formik.values.contactNumber,
      address: formik.values.address,
    });

    // Check for errors in step 2 fields
    const hasErrors = Object.keys(formik.errors).some((key) =>
      [
        "country",
        "state",
        "city",
        "pincode",
        "contactNumber",
        "address",
      ].includes(key)
    );

    if (hasErrors) {
      // Show validation errors with slight delay between each
      Object.entries(formik.errors).forEach(([field, errorMessage], index) => {
        // Only show errors for step 2 fields
        if (
          [
            "country",
            "state",
            "city",
            "pincode",
            "contactNumber",
            "address",
          ].includes(field)
        ) {
          setTimeout(() => {
            toast.error(field, {
              description: errorMessage as string,
              duration: 4000,
            });
          }, index * 300);
        }
      });
    } else {
      try {
        // No validation errors, submit the form
        await formik.submitForm();

        console.log("Registration successful field two", formik.values);
        // Show success toast directly here instead of relying on the return value
        toast.success("Registration Successful!", {
          description: "Your account has been created successfully.",
          duration: 4000,
        });
      } catch (error) {
        console.error("Registration failed", error);
        toast.error("Registration Failed", {
          description: "Something went wrong. Please try again.",
          duration: 4000,
        });
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
          <Label htmlFor="country">Country</Label>
          <Select
            onValueChange={(value) => {
              formik.setFieldValue("country", value);
              // Reset dependent fields when country changes
              formik.setFieldValue("state", "");
              formik.setFieldValue("city", "");
            }}
            value={formik.values.country}
          >
            <SelectTrigger className="w-full">
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
            onValueChange={(value) => {
              formik.setFieldValue("state", value);
              // Reset city when state changes
              formik.setFieldValue("city", "");
            }}
            value={formik.values.state}
            disabled={!formik.values.country}
          >
            <SelectTrigger className="w-full">
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
          id="contactNumber"
          name="contactNumber"
          type="tel" // Changed from number to tel for better semantics
          placeholder="1234567890"
          onChange={handleContactChange}
          onBlur={formik.handleBlur}
          value={formik.values.contactNumber}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="city">City</Label>
          <Select
            onValueChange={(value) => {
              formik.setFieldValue("city", value);
            }}
            value={formik.values.city}
            disabled={!formik.values.state}
          >
            <SelectTrigger className="w-full">
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
            id="pincode"
            name="pincode"
            type="text" // Changed from number to text to prevent issues with leading zeros
            pattern="\d*" // Ensures only digits are entered
            maxLength={10}
            placeholder="42205"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.pincode}
            required
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="address">Enterprise Address</Label>
        <Textarea
          id="address"
          name="address"
          placeholder="Enter Your Full Address"
          onChange={handleAddressChange}
          onBlur={formik.handleBlur}
          value={formik.values.address}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button type="button" className="w-full" onClick={() => moveToStep(1)}>
          Back
        </Button>
        <Button type="submit" className="w-full" onClick={handleSubmit}>
          Register
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="underline underline-offset-4">
          Login
        </a>
      </div>
    </>
  );
}
