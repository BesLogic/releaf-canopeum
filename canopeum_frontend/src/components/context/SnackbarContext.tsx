import { Alert, type AlertColor, type AlertPropsColorOverrides, Snackbar } from '@mui/material'
import type { OverridableStringUnion } from '@mui/types'
import type { FunctionComponent, ReactNode, SyntheticEvent } from 'react'
import { createContext, memo, useCallback, useEffect, useMemo, useState } from 'react'

type ISnackbarContext = {
  openAlertSnackbar: (message: string, options?: SnackbarAlertOptions) => void,
}

export type SnackbarMessage = {
  message: string,
  key: number,
}

export type SnackbarAlertOptions = {
  autohideDuration?: number,
  severity?: OverridableStringUnion<AlertColor, AlertPropsColorOverrides>,
}

const DEFAULT_SNACKBAR_ALERT_OPTIONS = {
  autohideDuration: 5000,
  severity: 'success',
} satisfies SnackbarAlertOptions

export const SnackbarContext = createContext<ISnackbarContext>({
  openAlertSnackbar: (_message: string, _options?: SnackbarAlertOptions) => {/* empty */},
})
SnackbarContext.displayName = 'SnackbarContext'

const SnackbarContextProvider: FunctionComponent<{ readonly children?: ReactNode }> = memo(
  props => {
    const [snackbarAlertOptions, setSnackbarAlertOptions] = useState<SnackbarAlertOptions>(
      DEFAULT_SNACKBAR_ALERT_OPTIONS,
    )

    const [snackPack, setSnackPack] = useState<readonly SnackbarMessage[]>([])
    const [open, setOpen] = useState(false)
    const [messageInfo, setMessageInfo] = useState<SnackbarMessage | undefined>()

    useEffect(() => {
      if (snackPack.length > 0 && !messageInfo) {
        // Set a new snack when we don't have an active one
        setMessageInfo({ ...snackPack[0] })
        setSnackPack(previous => previous.slice(1))
        setOpen(true)
      } else if (snackPack.length > 0 && messageInfo && open) {
        // Close an active snack when a new one is added
        setOpen(false)
      }
    }, [snackPack, messageInfo, open])

    const handleClose = (_event: Event | SyntheticEvent, reason?: string) => {
      if (reason === 'clickaway') return
      setOpen(false)
    }

    const openAlertSnackbar = useCallback((message: string, options?: SnackbarAlertOptions) => {
      setSnackbarAlertOptions(options ?? DEFAULT_SNACKBAR_ALERT_OPTIONS)
      setSnackPack(previous => [...previous, { message, key: Date.now() }])
    }, [setSnackPack, setSnackbarAlertOptions])

    const context = useMemo<ISnackbarContext>(() => ({ openAlertSnackbar }), [openAlertSnackbar])

    return (
      <SnackbarContext.Provider value={context}>
        {props.children}

        <Snackbar
          TransitionProps={{ onExited: () => setMessageInfo(undefined) }}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          autoHideDuration={snackbarAlertOptions.autohideDuration
            ?? DEFAULT_SNACKBAR_ALERT_OPTIONS.autohideDuration}
          key={messageInfo
            ? messageInfo.key
            : undefined}
          onClose={handleClose}
          open={open}
        >
          <Alert
            onClose={handleClose}
            severity={snackbarAlertOptions.severity ?? DEFAULT_SNACKBAR_ALERT_OPTIONS.severity}
            sx={{ width: '100%', boxShadow: 3 }}
            variant='filled'
          >
            {messageInfo?.message}
          </Alert>
        </Snackbar>
      </SnackbarContext.Provider>
    )
  },
)
SnackbarContextProvider.displayName = 'SnackbarContextProvider'
export default SnackbarContextProvider
