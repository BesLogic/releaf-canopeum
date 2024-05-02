import { useTranslation } from 'react-i18next'

const TermsAndPolicies = () => {
  const { t: translate } = useTranslation()

  return (
    <div className='d-flex flex-column h-100'>
      <h2 className='text-light'>{translate('settings.terms-and-policies.title')}</h2>
      <div className='bg-white rounded-2 mt-4 px-4 py-3 flex-grow-1 row m-0 justify-content-center'>
        <p>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Autem, rem architecto?
          Reiciendis iusto debitis aspernatur sit. Quisquam, nihil quaerat natus cupiditate ea
          officia numquam, reiciendis ex nobis obcaecati commodi ut?
        </p>
      </div>
    </div>
  )
}

export default TermsAndPolicies
