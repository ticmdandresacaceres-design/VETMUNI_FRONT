"use client"

import { AlertTriangle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  message: string
  buttons?: {
    cancel: string
    confirm: string
  }
  onConfirm: () => void
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  message,
  buttons = {
    cancel: "Cancelar",
    confirm: "Confirmar"
  },
  onConfirm,
  loading = false
}: ConfirmDialogProps) {
  const handleConfirm = () => {
    onConfirm()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-amber-600 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-600 whitespace-pre-line">
            {message}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {buttons.cancel}
          </Button>
          <Button 
            type="button" 
            onClick={handleConfirm}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 mx-2"
          >
            {loading ? "Procesando..." : buttons.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}