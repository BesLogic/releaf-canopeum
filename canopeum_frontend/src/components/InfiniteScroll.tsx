import { type ReactNode, useRef, useState } from 'react'

type Props = {
  readonly children: ReactNode,
  readonly load: () => void,
}

const INCERTITUDE_MARGIN = 10

const InfiniteScroll = ({ children, load }: Props) => {
  const listInnerRef = useRef<HTMLDivElement>(null)

  const [currentPage, setCurrentPage] = useState(1) // storing current page number
  const [previousPage, setPreviousPage] = useState(0) // storing prev page number
  const [userList, setUserList] = useState([]) // storing list
  const [wasLastList, setWasLastList] = useState(false) // setting a flag to know the last list

  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current

      // console.log('scrollTop + clientHeight:', scrollTop + clientHeight)
      // console.log('scrollHeight:', scrollHeight)

      if (scrollTop + clientHeight > scrollHeight - INCERTITUDE_MARGIN) {
        // This will be triggered after hitting the last element.
        // API call should be made here while implementing pagination.
        load()
      }
    }
  }

  return (
    <div
      className='infinite-scroll-container overflow-y-scroll vh-100'
      onScroll={onScroll}
      ref={listInnerRef}
    >
      {children}
    </div>
  )
}

export default InfiniteScroll
