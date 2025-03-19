import React, { createContext, useContext, useState, ReactNode } from 'react'

// Define checkpoints along the Z axis
const CHECKPOINTS = [300, 100, 0, -100, -300, -480]

type NavigationContextType = {
  checkpointIndex: number
  setCheckpointIndex: (index: number) => void
  handleNext: () => void
  handleBack: () => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export const NavigationProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [checkpointIndex, setCheckpointIndex] = useState(0)
  
  const handleNext = () => {
    setCheckpointIndex(prev => Math.max(prev - 1, 0))
  }
  
  const handleBack = () => {
    setCheckpointIndex(prev => Math.min(prev + 1, CHECKPOINTS.length - 1))
  }
  
  return (
    <NavigationContext.Provider value={{ checkpointIndex, setCheckpointIndex, handleNext, handleBack }}>
      {children}
    </NavigationContext.Provider>
  )
}

export const useNavigation = () => {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}