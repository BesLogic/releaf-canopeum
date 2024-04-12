import classes from './SettingsTab.module.scss'


type Props = {
  readonly children: string,
  readonly selected: boolean,
  readonly onClick: () => void,
}

const SettingsTab = ({ children, selected, onClick }: Props) => {
  let buttonClasses = `${classes.settingsTab} py-2 w-100 text-start`

  if (selected) {
    buttonClasses += ` bg-lightgreen ${classes.selectedSettingsTab}`
  }


  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  )
}

export default SettingsTab
