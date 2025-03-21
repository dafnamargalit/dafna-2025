import React, { createContext, useContext, useState, ReactNode } from 'react'

// Define checkpoints along the Z axis

type NavigationContextType = {
  checkpoints: number[]
  checkpointIndex: number
  setCheckpointIndex: (index: number) => void
  handleNext: () => void
  handleBack: () => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export const NavigationProvider: React.FC<{checkpoints: number[], children: ReactNode}> = ({ checkpoints, children }) => {
  const [checkpointIndex, setCheckpointIndex] = useState(0)
  
  const handleNext = () => {
    setCheckpointIndex(prev => Math.max(prev - 1, 0))
  }
  
  const handleBack = () => {
    setCheckpointIndex(prev => Math.min(prev + 1, checkpoints.length - 1))
  }
  
  return (
    <NavigationContext.Provider value={{ checkpoints, checkpointIndex, setCheckpointIndex, handleNext, handleBack }}>
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