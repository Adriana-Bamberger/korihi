import { ChangeEvent, FormEvent, KeyboardEvent, useState } from 'react'
import { useCreatePost } from '../hooks/use-posts'
import ErrorMessage from './ErrorMessage'

export default function WritePostForm() {
  const createPost = useCreatePost()
  const [formState, setFormState] = useState({ text: '' })

  const submit = () => {
    if (createPost.isPending) {
      return
    }

    const { text } = formState
    setFormState({ text: '' })

    if (text && typeof text === 'string') {
      createPost.mutate({ text })
    }
  }

  const handleKeyDown = (evt: KeyboardEvent) => {
    if (evt.key === 'Enter' && evt.ctrlKey) {
      submit()
    }
  }

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault()
    submit()
  }

  const handleChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = evt.currentTarget
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Compose post"
      data-submitting={createPost.isPending}
    >
      {createPost.isError && <ErrorMessage error={createPost.error} />}
      <div>
        <textarea
          aria-label="Post text"
          name="text"
          maxLength={130}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          value={formState.text}
          className="compose-form__text-input"
          placeholder="What's up with you?"
        />
      </div>
      <div>
        <small className="compose-form__hint">ctrl + enter to submit</small>
      </div>
      <button data-submitting={createPost.isPending}>Send</button>
    </form>
  )
}
