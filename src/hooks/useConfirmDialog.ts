"use client"

import { useState } from "react"

interface ConfirmDialogOptions {
  title: string
  message: string
  buttons?: {
    cancel: string
    confirm: string
  }
}

export function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmDialogOptions | null>(null)
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null)

  const showConfirmDialog = (dialogOptions: ConfirmDialogOptions, confirmCallback: () => void) => {
    setOptions(dialogOptions)
    setOnConfirm(() => confirmCallback)
    setIsOpen(true)
  }

  const hideConfirmDialog = () => {
    setIsOpen(false)
    setOptions(null)
    setOnConfirm(null)
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    }
    hideConfirmDialog()
  }

  return {
    isOpen,
    options,
    showConfirmDialog,
    hideConfirmDialog,
    handleConfirm
  }
}