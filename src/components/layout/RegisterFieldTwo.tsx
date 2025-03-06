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
import { FormikProps } from "formik";
import { FormValues } from "@/interfaces/forms";

interface RegisterFieldTwoProps {
  formik: FormikProps<FormValues>; // Replace with proper FormikProps type
  moveToStep: (step: number) => void;
}

export default function RegisterFieldTwo({
  formik,
  moveToStep,
}: RegisterFieldTwoProps) {
  const [country, setCountry] = useState<string | null>(null);
  const [currentState, setCurrentState] = useState<string | null>(null);
  const [countriesList, setCountriesList] = useState<Country[]>([]);
  const [stateList, setStateList] = useState<State[]>([]);
  const [city, setCity] = useState<string | null>(null);
  const [cityList, setCitiesList] = useState<City[]>([]);

  useEffect(() => {
    GetCountries().then((result) => {
      setCountriesList(result);
    });
  }, []);
  useEffect(() => {
    if (country)
      GetState(parseInt(country)).then((result) => {
        setStateList(result);
      });
  }, [country]);
  useEffect(() => {
    if (currentState && country)
      GetCity(parseInt(country), parseInt(currentState)).then((result) => {
        setCitiesList(result);
      });
  }, [currentState, country]);
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
          <Label htmlFor="country">Country</Label>
          <Select
            onValueChange={(value) => {
              formik.setFieldValue("country", value);
              setCountry(value);
            }}
            value={formik.values.country}
          >
            <SelectTrigger className="w-[150px]">
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
              setCurrentState(value);
            }}
            value={formik.values.state}
            disabled={!country}
          >
            <SelectTrigger className="w-[150px]">
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
          type="number"
          placeholder="Google"
          onChange={formik.handleChange}
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
              setCity(value);
            }}
            value={formik.values.city}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select your state" />
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
            type="number"
            placeholder="42205"
            onChange={formik.handleChange}
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
          onChange={formik.handleChange}
          value={formik.values.address}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button type="submit" className="w-full" onClick={() => moveToStep(1)}>
          Back
        </Button>
        <Button type="submit" className="w-full">
          Register
        </Button>
      </div>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Login
        </a>
      </div>
    </>
  );
}
