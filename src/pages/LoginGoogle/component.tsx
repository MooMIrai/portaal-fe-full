import React from "react";
import { Button } from "@progress/kendo-react-buttons";
import { Card } from "@progress/kendo-react-layout";
import client from "common/services/BEService";
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
      <Card className={styles.loginCard}>
        <div className={styles.loginContent}>
          <img
            src="/image/logoTaal.png"
            alt="TAAL Logo"
            className={styles.logo}
          />
          <h1>Benvenuto!</h1>
          <p>Accedi al dominio TAAL</p>
          <Button
            onClick={handleGoogleLogin}
            className={`${styles.kButton} k-button`}
            icon="google"
          >
            Accedi con Google
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LoginGoogleComponent;
