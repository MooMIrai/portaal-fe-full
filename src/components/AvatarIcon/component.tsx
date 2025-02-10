import { BadgeContainer } from "@progress/kendo-react-indicators";
import { Label } from "@progress/kendo-react-labels";
import { Avatar } from "@progress/kendo-react-layout";
import React from "react";

type AvatarIconProps = {
  initials: string;
};

export default function AvatarIcon(props: AvatarIconProps & {name?:string}) {

  const stringToColor=(name:string) =>{
    let hash1 = 0, hash2 = 0;
    
    for (let i = 0; i < name.length; i++) {
        if (i % 2 === 0) {
            hash1 = name.charCodeAt(i) + ((hash1 << 5) - hash1);
        } else {
            hash2 = name.charCodeAt(i) + ((hash2 << 5) - hash2);
        }
    }

    const h1 = Math.abs(hash1) % 360;
    const h2 = Math.abs(hash2) % 360;
    const s = 60 + (Math.abs(hash1 + hash2) % 30); // Saturazione tra 60% e 90%
    const l = 50 + (Math.abs(hash1 - hash2) % 20); // Luminosità tra 50% e 70%

    return `linear-gradient(135deg, hsl(${h1}, ${s}%, ${l}%) 0%, hsl(${h2}, ${s}%, ${l}%) 100%)`;
}


  return (
    <BadgeContainer>
      <Avatar type="initials" style={props.name?{background:stringToColor(props.name)}:undefined}>
        <Label className="k-item-text">{props.initials}</Label>
      </Avatar>
    </BadgeContainer>
  );
}
