'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const [jamName, setJamName] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const router = useRouter()

  const createJam = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Generate unique Jam ID
    const jamId = Math.random().toString(36).substring(2, 8).toUpperCase()
    
    // Create new Jam session
    const newJam = {
      id: jamId,
      name: jamName,
      adminPassword: adminPassword,
      createdAt: new Date().toISOString(),
      songs: [],
      members: []
    }
    
    // Store in localStorage
    const existingJams = JSON.parse(localStorage.getItem('jamvote-jams') || '{}')
    existingJams[jamId] = newJam
    localStorage.setItem('jamvote-jams', JSON.stringify(existingJams))
    
    // Redirect to the new Jam
    router.push(`/jam/${jamId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-purple-900">
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
              JamVote
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              밴드 합주곡 선정을 위한 투표 플랫폼
            </p>
          </div>

          <form onSubmit={createJam} className="space-y-4">
            <div>
              <label htmlFor="jamName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Jam 이름
              </label>
              <input
                id="jamName"
                type="text"
                value={jamName}
                onChange={(e) => setJamName(e.target.value)}
                placeholder="예: 우리밴드 12월 공연"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>

            <div>
              <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                관리자 비밀번호
              </label>
              <input
                id="adminPassword"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Jam 관리용 비밀번호"
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-xs text-gray-500 mt-1">
                이 비밀번호로 Jam을 관리할 수 있습니다
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200 transform hover:scale-[1.02]"
            >
              Jam 생성하기
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-500">
              이미 생성된 Jam이 있나요?
            </p>
            <input
              type="text"
              placeholder="Jam 코드 입력 (예: ABC123)"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const code = e.currentTarget.value.toUpperCase()
                  if (code) {
                    router.push(`/jam/${code}`)
                  }
                }
              }}
              className="w-full mt-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center uppercase dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  )
}