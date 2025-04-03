import React from "react";
import client from "common/services/BEService";
import { LoginForm } from "./form";
import Form from "common/Form";
import Button from "common/Button";
import {googleIcon} from 'common/icons';
import { ProfileService } from "../../services/profileService";
import Typography from 'common/Typography';
import styles from "./styles.module.css";

const LoginGoogleComponent = () => {
  const handleGoogleLogin = async () => {
    try {
      window.location.href = client.defaults.baseURL + "/auth/";
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
                ProfileService.login(values.email,values.password);
              }}
              showSubmit
              submitText={'Login'}
            />
          </div>
          <Typography.h6>Oppure accedi tramite</Typography.h6>
          <div className={styles.boxSSO}>
          
          <Button
            svgIcon={googleIcon}
            onClick={handleGoogleLogin}
            className={`${styles.kButton} `}
            themeColor={'error'}
            /* icon="google" */
          >
            Google
          </Button>
          </div>
        </div>
      {/* </Card> */}
    </div>
  );
};

export default LoginGoogleComponent;
