'use client';
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CustomTextInput from "../CustomTextInput/CustomTextInput";
import CustomButton from "../CustomButton/CustomButton";
import ButtonStyles from "@/globalStyles/buttonStyles.module.css";
import styles from "./SearchComponent.module.css";

export default function SearchComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [inputValue, setInputValue] = useState(searchParams?.get("searchterm") ?? "");

  useEffect(() => {
    setInputValue(searchParams?.get("searchterm") ?? "");
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

const handleSearch = () => {
  const trimmed = inputValue.trim();
  if (!trimmed) return;

  const currentSearch = searchParams.get("searchterm") ?? "";
  if (trimmed === currentSearch) return; 

  const params = new URLSearchParams();
  params.set("searchterm", trimmed);
  params.set("type", "users");

  router.push(`/search?${params.toString()}`);
};

  return (
    <div className={styles.searchContainer}>
      <CustomTextInput
        value={inputValue}
        onChange={handleChange}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        placeholder="Search in Fityr"
        name="searchterm"
        type="text"
        noMarginTop
      />
      <CustomButton
        title="Search"
        onClick={handleSearch}
        disabled={!inputValue.trim()}
        className={ButtonStyles.primary_button}
      />
    </div>
  );
}
