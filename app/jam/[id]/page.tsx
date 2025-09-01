'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

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

interface JamSession {
  id: string
  name: string
  adminPassword: string
  createdAt: string
  songs: Song[]
  members: { name: string; password: string }[]
}

export default function JamPage() {
  const params = useParams()
  const router = useRouter()
  const jamId = params.id as string

  const [jam, setJam] = useState<JamSession | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(true)
  const [userName, setUserName] = useState('')
  const [userPassword, setUserPassword] = useState('')
  const [isNewUser, setIsNewUser] = useState(false)
  const [shareUrl, setShareUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const jams = JSON.parse(localStorage.getItem('jamvote-jams') || '{}')
      const currentJam = jams[jamId.toUpperCase()]
      
      if (!currentJam) {
        alert('존재하지 않는 Jam입니다.')
        router.push('/')
        return
      }
      
      setJam(currentJam)
      setShareUrl(window.location.href)
      
      // Check if already authenticated
      const authData = sessionStorage.getItem(`jam-${jamId}-auth`)
      if (authData) {
        const { name } = JSON.parse(authData)
        setCurrentUser(name)
        setIsAuthenticated(true)
        setShowLoginForm(false)
      }
    }
  }, [jamId, router])

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!jam) return
    
    if (isNewUser) {
      // Register new member
      const updatedJam = {
        ...jam,
        members: [...jam.members, { name: userName, password: userPassword }]
      }
      
      // Update localStorage
      const jams = JSON.parse(localStorage.getItem('jamvote-jams') || '{}')
      jams[jamId.toUpperCase()] = updatedJam
      localStorage.setItem('jamvote-jams', JSON.stringify(jams))
      setJam(updatedJam)
    } else {
      // Verify existing member
      const member = jam.members.find(m => m.name === userName && m.password === userPassword)
      if (!member && userPassword !== jam.adminPassword) {
        alert('이름 또는 비밀번호가 일치하지 않습니다.')
        return
      }
    }
    
    // Store auth in sessionStorage
    sessionStorage.setItem(`jam-${jamId}-auth`, JSON.stringify({ name: userName }))
    setCurrentUser(userName)
    setIsAuthenticated(true)
    setShowLoginForm(false)
  }

  const addSong = (title: string, artist: string, youtubeUrl?: string) => {
    if (!jam) return
    
    const newSong: Song = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      artist,
      youtubeUrl,
      votes: 0,
      votedBy: [],
      comments: [],
      suggestedBy: currentUser,
      createdAt: new Date().toISOString()
    }
    
    const updatedJam = {
      ...jam,
      songs: [...jam.songs, newSong]
    }
    
    // Update localStorage
    const jams = JSON.parse(localStorage.getItem('jamvote-jams') || '{}')
    jams[jamId.toUpperCase()] = updatedJam
    localStorage.setItem('jamvote-jams', JSON.stringify(jams))
    
    setJam(updatedJam)
    setShowAddForm(false)
  }

  const vote = (songId: string) => {
    if (!jam) return
    
    const updatedSongs = jam.songs.map(song => {
      if (song.id === songId) {
        if (song.votedBy.includes(currentUser)) {
          return {
            ...song,
            votes: song.votes - 1,
            votedBy: song.votedBy.filter(name => name !== currentUser)
          }
        } else {
          return {
            ...song,
            votes: song.votes + 1,
            votedBy: [...song.votedBy, currentUser]
          }
        }
      }
      return song
    })
    
    const updatedJam = { ...jam, songs: updatedSongs }
    
    // Update localStorage
    const jams = JSON.parse(localStorage.getItem('jamvote-jams') || '{}')
    jams[jamId.toUpperCase()] = updatedJam
    localStorage.setItem('jamvote-jams', JSON.stringify(jams))
    
    setJam(updatedJam)
  }

  const addComment = (songId: string, text: string) => {
    if (!jam) return
    
    const newComment: Comment = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      author: currentUser,
      text,
      createdAt: new Date().toISOString()
    }
    
    const updatedSongs = jam.songs.map(song => {
      if (song.id === songId) {
        return {
          ...song,
          comments: [...song.comments, newComment]
        }
      }
      return song
    })
    
    const updatedJam = { ...jam, songs: updatedSongs }
    
    // Update localStorage
    const jams = JSON.parse(localStorage.getItem('jamvote-jams') || '{}')
    jams[jamId.toUpperCase()] = updatedJam
    localStorage.setItem('jamvote-jams', JSON.stringify(jams))
    
    setJam(updatedJam)
  }

  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : null
  }

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl)
    alert('링크가 복사되었습니다!')
  }

  if (!jam) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (showLoginForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2">{jam.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">Jam 코드: {jamId.toUpperCase()}</p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isNewUser ? '사용할 이름' : '이름'}
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="밴드에서 사용할 이름"
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  비밀번호
                </label>
                <input
                  type="password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  placeholder={isNewUser ? '새 비밀번호 설정' : '비밀번호 입력'}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition"
              >
                {isNewUser ? '참여하기' : '입장하기'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setIsNewUser(!isNewUser)}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
              >
                {isNewUser ? '이미 참여중이신가요?' : '처음 참여하시나요?'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto p-4">
        <header className="py-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold">{jam.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">Jam 코드: {jamId.toUpperCase()}</p>
            </div>
            <button
              onClick={copyShareLink}
              className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              📋 링크 복사
            </button>
          </div>
          <p className="text-sm text-gray-500">
            로그인: {currentUser} | 참여자: {jam.members.length}명
          </p>
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
          {jam.songs.sort((a, b) => b.votes - a.votes).map(song => (
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
                      song.votedBy.includes(currentUser)
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

        {jam.songs.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            아직 제안된 곡이 없습니다. 첫 번째로 곡을 제안해보세요!
          </div>
        )}
      </div>
    </div>
  )
}