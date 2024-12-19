import { useState } from 'react'

type TextExpansionProps = {
  readonly text: string,
  readonly maxLength: number, // Maximum number of characters to display
}

const TextExpansion = ({ text, maxLength }: TextExpansionProps) => {
  const [expanded, setExpanded] = useState(false)

  const shouldExpand = text.length > maxLength

  return (
    <div>
      {shouldExpand
        ? (
          <>
            {expanded
              ? text
              : text.slice(0, maxLength)}
            <button
              className='btn btn-link py-0'
              onClick={() => setExpanded(!expanded)}
              type='button'
            >
              {expanded
                ? 'Show less'
                : 'Show more'}
            </button>
          </>
        )
        : text}
    </div>
  )
}

export default TextExpansion
