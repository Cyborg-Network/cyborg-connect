import React, { ReactNode, useContext, useState } from 'react'

interface UiContextType {
  sidebarIsActive: boolean,
  setSidebarIsActive: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Props {
  children: ReactNode;
}

const UiContext = React.createContext<UiContextType | undefined>(undefined);

//Unfortunately elements have to handle resizing (due to the sidebar) themselves, and it cannot be done via a wrapper component,
//so this is the place where ui state should be stored, just to separate concerns from the other contexts, and in case we have more ui-state in the future
const UiContextProvider: React.FC<Props> = ({children}: Props) => {
  const [sidebarIsActive, setSidebarIsActive] = useState(false)

  return (
    <UiContext.Provider value={{ sidebarIsActive, setSidebarIsActive }}>
      {children}
    </UiContext.Provider>
  );
}

export const useUi = (): UiContextType => useContext(UiContext)

export { UiContextProvider }
