import React, { useContext, useState } from 'react'

const UiContext = React.createContext()

//Unfortunately elements have to handle resizing (due to the sidebar) themselves, and it cannot be done via a wrapper component,
//so this is the place where ui state should be stored, just to separate concerns from the other contexts, and in case we have more ui-state in the future
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
