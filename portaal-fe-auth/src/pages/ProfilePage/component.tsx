import React, { useEffect, useState } from "react";
import { ProfileService } from "../../services/profileService";
import { ProfileModel } from "../../components/profileDashboard/model";
import { fromProfileBEModelToProfileModel } from "../../adapters/profileAdapters";
import ProfileDashboard from "../../components/profileDashboard/component";
import { ChangePassword } from "../../components/ChangePassword/component";
import styles from "./style.module.scss"
export default function Profile() {
  const [data, setData] = useState<ProfileModel>();

  useEffect(() => {
    ProfileService.getProfileInfo().then((res) => {
      setData(fromProfileBEModelToProfileModel(res));
    });
  }, []);

  return <div className={styles.container}>{data && 
  <><ProfileDashboard data={data} />
  <ChangePassword />
  </>
  }</div>;
}
