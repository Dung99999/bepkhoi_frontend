import React, { useEffect } from "react";
import config from "../config/config";

export default function MenuPage() {
    const config1 = config.menuMessage.mess
    const config2 = config.menuMessage.actor

    return (
        <>
            <h1>{config1}</h1>
            <h3>{config2}</h3>
        </>
    );
}
