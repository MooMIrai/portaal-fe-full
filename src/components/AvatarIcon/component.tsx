import { BadgeContainer } from "@progress/kendo-react-indicators";
import { Label } from "@progress/kendo-react-labels";
import { Avatar } from "@progress/kendo-react-layout";
import React from "react";

type AvatarIconProps = {
  initials: string;
};

export default function AvatarIcon(props: AvatarIconProps) {
  return (
    <BadgeContainer>
      <Avatar type="initials">
        <Label className="k-item-text">{props.initials}</Label>
      </Avatar>
    </BadgeContainer>
  );
}
