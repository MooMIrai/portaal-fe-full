import React from "react";
import client from "common/services/BEService";
import { LoginForm } from "./form";
import Form from "common/Form";
import Button from "common/Button";
import { ProfileService } from "../../services/profileService";
import Typography from 'common/Typography';
import NotificationActions from 'common/providers/NotificationProvider';
import styles from "./styles.module.css";

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
        <div className={styles.loginContent}>

          <div className={styles.header}>
         
            <img
              src="/image/logoTaal.png"
              alt="TAAL Logo"
              className={styles.logo}
            />
          </div>
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
            style={{padding: 0, border: 0}}
          >
            <img src="/image/google_login_logo.svg"></img>
          </Button>}

          {(loginProvider?.toLowerCase() === "microsoft") && <Button
            onClick={handleLogin}
            style={{padding: 0, border: 0}}
          >
            <img style={{height: "38.5px"}} src="/image/microsoft_login_logo.svg"></img>
          </Button>}

          </div>
        </div>
      {/* </Card> */}
    </div>
  );
};

export default LoginComponent;
