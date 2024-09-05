import React, { useContext, useState } from 'react'

const UiContext = React.createContext()

const UiContextProvider = props => {

  const [sidebarIsActive, setSidebarIsActive] = useState(false);
  
  return (
    <UiContext.Provider value={{sidebarIsActive, setSidebarIsActive}}>
      {props.children}
    </UiContext.Provider>
  )
}

export const useUi = () => useContext(UiContext);

export { UiContextProvider }
