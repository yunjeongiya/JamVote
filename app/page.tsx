'use client'

import { useState, useEffect } from 'react'

interface Song {
  id: string
  title: string
  artist: string
  youtubeUrl?: string
  votes: number
  votedBy: string[]
  comments: Comment[]
  suggestedBy: string
  createdAt: string
}

interface Comment {
  id: string
  author: string
  text: string
  createdAt: string
}

export default function Home() {
  const [songs, setSongs] = useState<Song[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [userName, setUserName] = useState('')
  const [selectedSong, setSelectedSong] = useState<Song | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('jamvote-songs')
    if (stored) {
      setSongs(JSON.parse(stored))
    }
    const storedName = localStorage.getItem('jamvote-username')
    if (storedName) {
      setUserName(storedName)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('jamvote-songs', JSON.stringify(songs))
  }, [songs])

  const addSong = (title: string, artist: string, youtubeUrl?: string) => {
    const newSong: Song = {
      id: Date.now().toString(),
      title,
      artist,
      youtubeUrl,
      votes: 0,
      votedBy: [],
      comments: [],
      suggestedBy: userName || 'Anonymous',
      createdAt: new Date().toISOString()
    }
    setSongs([...songs, newSong])
    setShowAddForm(false)
  }

  const vote = (songId: string) => {
    if (!userName) {
      const name = prompt('이름을 입력해주세요:')
      if (name) {
        setUserName(name)
        localStorage.setItem('jamvote-username', name)
      } else return
    }

    setSongs(songs.map(song => {
      if (song.id === songId) {
        if (song.votedBy.includes(userName)) {
          return {
            ...song,
            votes: song.votes - 1,
            votedBy: song.votedBy.filter(name => name !== userName)
          }
        } else {
          return {
            ...song,
            votes: song.votes + 1,
            votedBy: [...song.votedBy, userName]
          }
        }
      }
      return song
    }))
  }

  const addComment = (songId: string, text: string) => {
    if (!userName) {
      const name = prompt('이름을 입력해주세요:')
      if (name) {
        setUserName(name)
        localStorage.setItem('jamvote-username', name)
      } else return
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      author: userName,
      text,
      createdAt: new Date().toISOString()
    }

    setSongs(songs.map(song => {
      if (song.id === songId) {
        return {
          ...song,
          comments: [...song.comments, newComment]
        }
      }
      return song
    }))
  }

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-4">
        <header className="py-8">
          <h1 className="text-4xl font-bold text-center mb-2">JamVote</h1>
          <p className="text-center text-gray-600 dark:text-gray-400">밴드 합주곡 선정 투표</p>
          {userName && (
            <p className="text-center mt-2 text-sm text-gray-500">
              안녕하세요, {userName}님!
            </p>
          )}
        </header>

        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            곡 제안하기
          </button>
        </div>

        {showAddForm && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">새 곡 제안</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                addSong(
                  formData.get('title') as string,
                  formData.get('artist') as string,
                  formData.get('youtube') as string
                )
                e.currentTarget.reset()
              }}
            >
              <input
                name="title"
                placeholder="곡 제목"
                required
                className="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <input
                name="artist"
                placeholder="아티스트"
                required
                className="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <input
                name="youtube"
                placeholder="YouTube URL (선택)"
                className="w-full p-2 mb-3 border rounded dark:bg-gray-700 dark:border-gray-600"
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              >
                제안하기
              </button>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {songs.sort((a, b) => b.votes - a.votes).map(song => (
            <div key={song.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{song.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{song.artist}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    제안: {song.suggestedBy}
                  </p>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => vote(song.id)}
                    className={`px-4 py-2 rounded transition ${
                      song.votedBy.includes(userName)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    👍 {song.votes}
                  </button>
                </div>
              </div>

              {song.youtubeUrl && getYouTubeId(song.youtubeUrl) && (
                <div className="mb-4">
                  <iframe
                    width="100%"
                    height="315"
                    src={`https://www.youtube.com/embed/${getYouTubeId(song.youtubeUrl)}`}
                    title={song.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded"
                  />
                </div>
              )}

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">코멘트 ({song.comments.length})</h4>
                <div className="space-y-2 mb-3">
                  {song.comments.map(comment => (
                    <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      <p className="text-sm">
                        <span className="font-semibold">{comment.author}:</span> {comment.text}
                      </p>
                    </div>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(e.currentTarget)
                    const text = formData.get('comment') as string
                    if (text) {
                      addComment(song.id, text)
                      e.currentTarget.reset()
                    }
                  }}
                  className="flex gap-2"
                >
                  <input
                    name="comment"
                    placeholder="코멘트 작성..."
                    className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    작성
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>

        {songs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            아직 제안된 곡이 없습니다. 첫 번째로 곡을 제안해보세요!
          </div>
        )}
      </div>
    </div>
  )
}
