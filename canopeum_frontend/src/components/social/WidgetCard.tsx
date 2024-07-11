import { AuthenticationContext } from '@components/context/AuthenticationContext'
import { RoleEnum, type Widget } from '@services/api'
import { useContext } from 'react'

type Props = {
  readonly widget: Widget,
  readonly handleEditClick: () => void,
}

const WidgetCard = ({ widget, handleEditClick }: Props) => {
  const { currentUser } = useContext(AuthenticationContext)

  return (
    <div className='card'>
      <div className='card-body'>
        <div className='d-flex justify-content-between align-items-center pb-3'>
          <h2 className='card-title'>{widget.title}</h2>
          <div>
            {currentUser?.role !== RoleEnum.User && (
              <button
                className='btn btn-link'
                onClick={() => handleEditClick()}
                type='button'
              >
                <span className='material-symbols-outlined text-primary fs-2'>
                  edit_square
                </span>
              </button>
            )}
          </div>
        </div>

        <p className='card-text text-justify'>{widget.body}</p>
      </div>
    </div>
  )
}

export default WidgetCard
