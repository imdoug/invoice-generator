"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-hot-toast";
import Navbar from "../components/NavBar";
import Image from "next/image";
import {
  getCountries,
  getCountryCallingCode,
  AsYouType,
  CountryCode,
} from "libphonenumber-js";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [countryCode, setCountryCode] = useState("US");

  const [form, setForm] = useState({
    name: "",
    phone_number: "",
    business_name: "",
    address: "",
    logo_url: "",
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!session?.user?.email) return;

      const { data, error } = await supabase
        .from("users")
        .select("name, phone_number, business_name, address, logo_url")
        .eq("email", session.user.email)
        .single();

      if (data) setForm(data);
      if (error) {
        toast.error("Failed to fetch user data.");
      }
    };

    fetchUser();
  }, [session]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase
      .from("users")
      .update(form)
      .eq("email", session?.user?.email);

    if (error) {
      toast.error("Failed to update profile.");
    } else {
      toast.success("Profile updated!");
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-8 text-primary">Your Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            value={form.name}
            onChange={(v) => handleChange("name", v)}
          />
          {/* Country + Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <div className="flex gap-2">
              <select
                value={countryCode}
                onChange={(e) => {
                  setCountryCode(e.target.value);
                  const raw = form.phone_number.replace(/\D/g, "");
                  const formatted = new AsYouType(
                    e.target.value as CountryCode
                  ).input(raw);
                  handleChange("phone_number", formatted);
                }}
                className="px-2 py-1 border border-gray-300 rounded-md bg-white text-sm"
              >
                {getCountries().map((code) => (
                  <option key={code} value={code}>
                    {code} +{getCountryCallingCode(code)}
                  </option>
                ))}
              </select>

              <input
                type="tel"
                value={form.phone_number}
                onChange={(e) => {
                  const formatted = new AsYouType(
                    countryCode as CountryCode
                  ).input(e.target.value);
                  handleChange("phone_number", formatted);
                }}
                className="flex-1 px-4 py-2 rounded-md border border-gray-300 bg-gray-50 focus:border-primary focus:ring-primary"
              />
            </div>
          </div>
          <Input
            label="Business Name"
            value={form.business_name}
            onChange={(v) => handleChange("business_name", v)}
          />
          <Input
            label="Business Address"
            value={form.address}
            onChange={(v) => handleChange("address", v)}
          />
          {/* Business Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Business Logo
            </label>

            {form.logo_url ? (
              <div>
                <Image
                  src={form.logo_url}
                  alt="Business Logo"
                  width={128}
                  height={128}
                  className="h-32 rounded"
                />
                {/* <img src={form.logo_url} alt="Business Logo" className="h-12 rounded" /> */}
                <button
                  type="button"
                  onClick={() => handleChange("logo_url", "")}
                  className="text-sm text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file || !session?.user?.email) return;

                  const fileExt = file.name.split(".").pop();
                  const fileName = `${session.user.email.replace(
                    /[^a-z0-9]/gi,
                    "-"
                  )}-logo.${fileExt}`;
                  const { error } = await supabase.storage
                    .from("logos") // make sure this bucket exists in Supabase
                    .upload(fileName, file, { upsert: true });

                  if (error) {
                    console.log("ERROR: ", error);
                    toast.error("Failed to upload logo.");
                  } else {
                    const { data: publicUrl } = supabase.storage
                      .from("logos")
                      .getPublicUrl(fileName);

                    if (publicUrl?.publicUrl) {
                      console.log("PUBLIC URL: ", publicUrl);
                      handleChange("logo_url", publicUrl.publicUrl);
                      toast.success("Logo uploaded!");
                    }
                  }
                }}
                className="block w-full text-sm text-gray-500 file:border file:border-gray-300 file:rounded-md file:px-4 file:py-2"
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-blue-500 bg-blue-700 text-white font-semibold py-2 rounded-md transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
}
function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 rounded-md border border-gray-300 bg-gray-50 focus:border-primary focus:ring-primary"
      />
    </div>
  );
}
