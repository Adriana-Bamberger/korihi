interface Props {
  error: unknown
}

export default function ErrorMessage({ error }: Props) {
  if (error != undefined) {
    return (
      <p className="error-message">
        Oops! Something went wrong: {String(error)}
      </p>
    )
  }

  return <p className="error-message">Oops! Something went wrong</p>
}
