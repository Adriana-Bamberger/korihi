import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import request from 'superagent'
import { PagedPosts, Post } from '../../models/Post.ts'
import { API_HOST, USERNAME, PASSWORD } from '../env.ts'

export function useReplies(id: number, beforeId?: number) {
  return useQuery({
    queryKey: ['posts', 'replies', id],
    queryFn: async () => {
      const qs = beforeId ? { beforeId } : {}

      const res = await request
        .get(`${API_HOST}/api/v1/posts/${id}/replies`)
        .query(qs)
        .auth(USERNAME, PASSWORD, { type: 'basic' })

      return res.body as PagedPosts
    },
  })
}

export function usePost(id: number) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: async () => {
      const res = await request
        .get(`${API_HOST}/api/v1/posts/${id}`)
        .auth(USERNAME, PASSWORD, { type: 'basic' })

      return res.body as Post
    },
  })
}

export function usePosts() {
  console.log(`${API_HOST}/api/v1/posts`)
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const res = await request
        .get(`${API_HOST}/api/v1/posts`)
        .auth(USERNAME, PASSWORD, { type: 'basic' })

      return res.body as PagedPosts
    },
  })
}

export function usePostsBy(author: string) {
  return useQuery({
    queryKey: ['posts', 'by', author],
    queryFn: async () => {
      const res = await request
        .get(`${API_HOST}/api/v1/posts/by/${author}`)
        .auth(USERNAME, PASSWORD, { type: 'basic' })

      return res.body as PagedPosts
    },
  })
}

export function useCreatePost() {
  //making new posts
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (values: { text?: string }) => {
      const result = await request
        .post(`${API_HOST}/api/v1/posts`)
        .auth(USERNAME, PASSWORD, { type: 'basic' })
        .send(values)
      return result.body
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}

export function useReplyTo() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (values: { id: number; text: string }) => {
      const { text, id } = values
      const res = await request
        .post(`${API_HOST}/api/v1/posts/${id}/replies`)
        .auth(USERNAME, PASSWORD, { type: 'basic' })
        .send({ text })

      return res.body
    },

    onSuccess: async () => {
      qc.invalidateQueries({ queryKey: ['posts'] })
    },
  })
}
