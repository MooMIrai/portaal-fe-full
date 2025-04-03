import React from "react";
import { ProfileModel } from "./model";
import Avatar from "common/AvatarIcon";
import Card from "common/CustomCard";
import styles from "./style.module.scss";

type ProfileProps = {
  image?: string;
  data: ProfileModel;
};

export default function ProfileDashboard(props: ProfileProps) {
  const {
    birthDate,
    cap,
    cityBirth,
    cityResidence,
    companyEmail,
    email,
    employeeId,
    firstName,
    fiscalCode,
    iban,
    lastName,
    provinceBirth,
    provinceResidence,
    residenceAddress,
    sex,
    telephone,
    workPhone,
  } = props.data;


  const displayInfo = (info: string | undefined | null) => {
    return info || "Missing info";
  };

  return (
    <div className={styles.maxContainer}>
      <Card
        container={{ class: styles.container }}
        header={{
          class: styles.accountInfoHeaderContainer,
          element: (
            <div className={styles.accountInfoContainer}>
              <Avatar
                initials={displayInfo(firstName)[0] + displayInfo(lastName)[0]}
              />
              <div className={styles.accountInfoText}>
                <span className={styles.accountName}>
                  {displayInfo(firstName) + " " + displayInfo(lastName)}
                </span>
                <span>{displayInfo(companyEmail)}</span>
              </div>
            </div>
          ),
        }}
      />
      <Card
        container={{ class: styles.container }}
        header={{
          class: styles.personalInfoHeaderContainer,
          element: <span>Personal Info</span>,
        }}
        body={{
          class: "",
          element: (
            <div className={styles.gridInfo}>
              <div className={styles.singleInfo}>
                <label className={styles.label}>First Name:</label>
                <span>{displayInfo(firstName)}</span>
              </div>
              <div className={styles.singleInfo}>
                <label className={styles.label}>Last Name:</label>
                <span>{displayInfo(lastName)}</span>
              </div>
              <div className={styles.singleInfo}>
                <label className={styles.label}>Birth Date:</label>
                <span>{displayInfo(birthDate)}</span>
              </div>
              <div className={styles.singleInfo}>
                <label className={styles.label}>Gender:</label>
                <span>{displayInfo(sex)}</span>
              </div>
              <div className={styles.singleInfo}>
                <label className={styles.label}>Birth Province:</label>
                <span>{displayInfo(provinceBirth)}</span>
              </div>
              <div className={styles.singleInfo}>
                <label className={styles.label}>Birth City:</label>
                <span>{displayInfo(cityBirth)}</span>
              </div>
              <div className={styles.singleInfo}>
                <label className={styles.label}>Fiscal Code:</label>
                <span>{displayInfo(fiscalCode)}</span>
              </div>
              <div className={styles.singleInfo}>
                <label className={styles.label}>IBAN:</label>
                <span>{displayInfo(iban)}</span>
              </div>
            </div>
          ),
        }}
      />
      <Card
        container={{ class: styles.container }}
        header={{
          class: styles.addressHeaderContainer,
          element: <span>Address</span>,
        }}
        body={{
          class: "",
          element: (
            <div className={styles.gridInfo}>
              <div className={styles.singleInfo}>
                <label className={styles.label}>Residence Province:</label>
                <span>{displayInfo(provinceResidence)}</span>
              </div>
              <div className={styles.singleInfo}>
                <label className={styles.label}>Residence City:</label>
                <span>{displayInfo(cityResidence)}</span>
              </div>
              <div className={styles.singleInfo}>
                <label className={styles.label}>Address Residence:</label>
                <span>{displayInfo(residenceAddress)}</span>
              </div>
              <div className={styles.singleInfo}>
                <label className={styles.label}>Zip Code:</label>
                <span>{displayInfo(cap)}</span>
              </div>
            </div>
          ),
        }}
      />
      <Card
        container={{ class: styles.container }}
        header={{
          class: styles.addressHeaderContainer,
          element: <span>Contact details</span>,
        }}
        body={{
          class: "",
          element: (
            <div className={styles.gridInfo}>
              <div className={styles.singleInfo}>
                <label className={styles.label}>Company Email:</label>
                <span>{displayInfo(companyEmail)}</span>
              </div>
              <div className={styles.singleInfo}>
                <label className={styles.label}>Work Phone:</label>
                <span>{displayInfo(workPhone)}</span>
              </div>
              <div className={styles.singleInfo}>
                <label className={styles.label}>Email:</label>
                <span>{displayInfo(email)}</span>
              </div>
              <div className={styles.singleInfo}>
                <label className={styles.label}>Telephone:</label>
                <span>{displayInfo(telephone)}</span>
              </div>
              <div className={styles.singleInfo}>
                <label className={styles.label}>Employee Id:</label>
                <span>{displayInfo(employeeId)}</span>
              </div>
            </div>
          ),
        }}
      />
    </div>
  );
}
