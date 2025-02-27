export default function useValidation(errors, field) {
    return errors?.[field]?.length && errors[field].map((error, index) => (
      <div key={index} className="bg-red-600 p-2 text-white rounded my-1">
        { error }
      </div>
    ))
  }