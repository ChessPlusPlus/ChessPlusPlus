import * as React from "react"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/shared/hooks/useMobile"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { AlertDialog, AlertDialogTrigger, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle, AlertDialogContent, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

interface BaseProps {
  children: React.ReactNode
}

interface RootCredenzaProps extends BaseProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

interface CredenzaProps extends BaseProps {
  className?: string
  asChild?: true
}

const CredenzaContext = React.createContext<{ isMobile: boolean }>({
  isMobile: false,
})

const useCredenzaContext = () => {
  const context = React.useContext(CredenzaContext)
  if (!context) {
    throw new Error(
      "Credenza components cannot be rendered outside the Credenza Context"
    )
  }
  return context
}

const CredenzaAlert = ({ children, ...props }: RootCredenzaProps) => {
  const isMobile = useIsMobile()
  const CredenzaAlert = isMobile ? Drawer : AlertDialog

  return (
    <CredenzaContext.Provider value={{ isMobile }}>
      <CredenzaAlert {...props} {...(isMobile && { autoFocus: true })}>
        {children}
      </CredenzaAlert>
    </CredenzaContext.Provider>
  )
}

const CredenzaAlertTrigger = ({ className, children, ...props }: CredenzaProps) => {
  const { isMobile } = useCredenzaContext()
  const CredenzaAlertTrigger = isMobile ? DrawerTrigger : AlertDialogTrigger

  return (
    <CredenzaAlertTrigger className={className} {...props}>
      {children}
    </CredenzaAlertTrigger>
  )
}

const CredenzaAlertClose = ({ className, children, ...props }: CredenzaProps) => {
  const { isMobile } = useCredenzaContext()
  const CredenzaAlertClose = isMobile ? DrawerClose : AlertDialogCancel

  return (
    <CredenzaAlertClose className={className} {...props}>
      {children}
    </CredenzaAlertClose>
  )
}

const CredenzaAlertAction = ({ className, children, ...props }: CredenzaProps) => {
  const { isMobile } = useCredenzaContext()
  const CredenzaAlertAction = isMobile ? Button : AlertDialogAction

  return (
    <CredenzaAlertAction className={className} {...props}>
      {children}
    </CredenzaAlertAction>
  )
}

const CredenzaAlertContent = ({ className, children, ...props }: CredenzaProps) => {
  const { isMobile } = useCredenzaContext()
  const CredenzaAlertContent = isMobile ? DrawerContent : AlertDialogContent

  return (
    <CredenzaAlertContent className={className} {...props}>
      {children}
    </CredenzaAlertContent>
  )
}

const CredenzaAlertDescription = ({
  className,
  children,
  ...props
}: CredenzaProps) => {
  const { isMobile } = useCredenzaContext()
  const CredenzaAlertDescription = isMobile ? DrawerDescription : AlertDialogDescription

  return (
    <CredenzaAlertDescription className={className} {...props}>
      {children}
    </CredenzaAlertDescription>
  )
}

const CredenzaAlertHeader = ({ className, children, ...props }: CredenzaProps) => {
  const { isMobile } = useCredenzaContext()
  const CredenzaAlertHeader = isMobile ? DrawerHeader : AlertDialogHeader

  return (
    <CredenzaAlertHeader className={className} {...props}>
      {children}
    </CredenzaAlertHeader>
  )
}

const CredenzaAlertTitle = ({ className, children, ...props }: CredenzaProps) => {
  const { isMobile } = useCredenzaContext()
  const CredenzaAlertTitle = isMobile ? DrawerTitle : AlertDialogTitle

  return (
    <CredenzaAlertTitle className={className} {...props}>
      {children}
    </CredenzaAlertTitle>
  )
}

const CredenzaAlertBody = ({ className, children, ...props }: CredenzaProps) => {
  return (
    <div className={cn("px-4 md:px-0", className)} {...props}>
      {children}
    </div>
  )
}

const CredenzaAlertFooter = ({ className, children, ...props }: CredenzaProps) => {
  const { isMobile } = useCredenzaContext()
  const CredenzaAlertFooter = isMobile ? DrawerFooter : AlertDialogFooter

  return (
    <CredenzaAlertFooter className={className} {...props}>
      {children}
    </CredenzaAlertFooter>
  )
}

export {
  CredenzaAlert,
  CredenzaAlertTrigger,
  CredenzaAlertClose,
  CredenzaAlertContent,
  CredenzaAlertDescription,
  CredenzaAlertHeader,
  CredenzaAlertTitle,
  CredenzaAlertBody,
  CredenzaAlertFooter,
  CredenzaAlertAction,
}
