import React from "react";
import client from "common/services/BEService";
import { LoginForm } from "./form";
import Form from "common/Form";
import Button from "common/Button";
import { ProfileService } from "../../services/profileService";
import Typography from 'common/Typography';
import NotificationActions from 'common/providers/NotificationProvider';
import styles from "./styles.module.css";
import { isMobile, MobileView } from "react-device-detect";

const LoginComponent = () => {

  const loginProvider = process.env.LOGIN_PROVIDER;

  const handleLogin = async () => {
    try {
      window.location.href = client.defaults.baseURL + "/auth";
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  return (
    <div className={styles.loginContainer}>
      {/* <Card className={styles.loginCard}> */}
        <div className={!isMobile ? styles.loginContent : styles.mobileLoginContent}>

          <div className={styles.header}>
         
            <img
              src="/image/logoTaal.png"
              alt="TAAL Logo"
              className={!isMobile ? styles.logo : styles.logoMobile}
            />
          </div>

          <div>

            <Typography.h6>Usa le tue credenziali</Typography.h6>

            <div className={styles.formLogin}>
              
            <Form
                fields={LoginForm}
                formData={{}}
                onSubmit={(values:any)=>{
                  ProfileService.login(values.email,values.password).catch(()=>{
                    NotificationActions.openModal(
                      { icon: true, style: "error" },
                      "Credenziali errate"
                    );
                  });
                }}
                showSubmit
                submitText={'Login'}
              />
            </div>

            <Typography.h6>Oppure</Typography.h6>

            <div className={styles.boxSSO}>
            
              {(loginProvider?.toLowerCase() === "google") && <Button
                onClick={handleLogin}
                style={{padding: 0, border: 0, background: "none"}}
              >
                <img src="/image/google_login_logo.svg"></img>
              </Button>}

              {(loginProvider?.toLowerCase() === "microsoft") && <Button
                onClick={handleLogin}
                style={{padding: 0, border: 0, background: "none"}}
              >
                <img style={{height: "38.5px"}} src="/image/microsoft_login_logo.svg"></img>
              </Button>}

            </div>

            <MobileView>

              <div className={styles.boxSSO}>

                <Button style={{padding: 0, border: 0, background: "none"}}>

                  <a href="/image/app_store_logo.svg" download>
                    <img style={{width: !isMobile ? "200px": "150px"}} src="/image/app_store_logo.svg"></img>
                  </a>

                </Button>

                <Button style={{padding: 0, border: 0, background: "none"}}>

                  <a href="https://expo.dev/artifacts/eas/6FigHb7Ve2Heyd1LZ6Qe4J.apk" download>
                    <img style={{width: !isMobile ? "220px": "150px"}} src="/image/google_play_logo.png"></img>
                  </a>

                </Button>

              </div>

            </MobileView>

          </div>

        </div>
      {/* </Card> */}
    </div>
  );
};

export default LoginComponent;
