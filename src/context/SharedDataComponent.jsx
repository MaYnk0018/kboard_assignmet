// SharedDataComponent.jsx
"use client"

import React, { useState } from 'react';

export const SharedDataContext = React.createContext();

const SharedDataComponent = ({ children }) => {
    const [sharedMobileNumber, setSharedMobileNumber] = useState(null);

    return (
        <SharedDataContext.Provider value={{ sharedMobileNumber, setSharedMobileNumber }}>
            {children}
        </SharedDataContext.Provider>
    );
}

export default SharedDataComponent;
