"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useStytch } from "@stytch/nextjs";
import { apiClient } from "@/utils/apiClient";
import { BASE_URL, ENDPOINTS } from "@/_lib/apiEndpoints";
import { queryClient } from "@/utils/reactQueryClient";
import BackgroundOverlay from "../BackgroundOverlay/BackgroundOverlay";
import styles from "./OAuthHandler.module.css"
import CustomTextInput from "../CustomTextInput/CustomTextInput";
import CustomButton from "../CustomButton/CustomButton";
import ButtonStyles from "@/app/globalStyles/buttonStyles.module.css";
import { SignupResponse } from "@/types/user";



export default function OAuthHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const stytchClient = useStytch();
  const [showUsernameUI, setShowUsernameUI] = useState(false)
  const [oauthToken, setOauthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)
  const [authInfo, setAuthInfo] = useState({
    username: "",
    email: "",
    password: "",
  });
  

  useEffect(() => {

    const token = searchParams.get("token");
    const tokenType = searchParams.get("stytch_token_type");

    if (!token || tokenType !== "oauth") return;

    setOauthToken(token)
    setShowUsernameUI(true)

    const authenticate = async() => {


      /* const res = await stytchClient.oauth.authenticate(
        token,
        { session_duration_minutes: 60 }
      ); */


     /*  const singUpResponse = await apiClient<SignupResponse>(`${BASE_URL}${ENDPOINTS.SIGNUP}`, "POST", {
              email: authInfo.email,
              password: authInfo.password,
              session_token: response.session_token,
              username: authInfo.username,
            });
      
            if(singUpResponse.data) {
              console.log("Savin user data to tanstack", singUpResponse.data.user)
              queryClient.setQueryData(["me"], singUpResponse.data.user);
            }

      console.log(res) */

    }

    authenticate()
    
  }, []);

  const handleUsername = async() => {

    const { data } = await apiClient<{ available: boolean }>(
      `${BASE_URL}${ENDPOINTS.CHECK_USERNAME}`,
      "POST",
      { username: authInfo.username }
    );
    


    if (!data?.available) {
      setLoading(false);
      return;
    }

    if (!oauthToken) return;

    const authRes = await stytchClient.oauth.authenticate(oauthToken, {
      session_duration_minutes: 60,
    });

    console.log(authRes)

    /* const singUpResponse = await apiClient<SignupResponse>(`${BASE_URL}${ENDPOINTS.SIGNUP}`, "POST", {
      email: authInfo.email,
      session_token: authRes.session_token,
      username: authInfo.username,
      provider: "google"
    });
      
    if(singUpResponse.data) {
      console.log("Savin user data to tanstack", singUpResponse.data.user)
      queryClient.setQueryData(["me"], singUpResponse.data.user);
    } */
  }


  return (showUsernameUI && 
    <BackgroundOverlay>
      <div className={styles.OAuthHandler}>
        <p>Please enter your username</p>
        <CustomTextInput label="Username" placeholder="Enter username" onChange={(e) => setAuthInfo((prev) => ({...prev, username: e.target.value}))} />
        <CustomButton
          loading={loading}
          className={`${ButtonStyles.primary_button} ${styles.actionButton}`}
          title={"Check Username"}
          onClick={handleUsername}
        />
      </div>
    </BackgroundOverlay>
  )
}
