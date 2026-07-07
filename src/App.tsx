import { useEffect, useState, type FormEvent } from 'react'
import './App.css'

type Screen = 'home' | 'teams' | 'quiz' | 'admin'
type QuestionStatus = 'available' | 'completed' | 'passed'
type Category = 'Tech' | 'Sports' | 'Rajagiri' | 'Entertainment'

interface Team {
  id: number
  name: string
  members: string[]
  score: number
}

interface Question {
  id: string
  category: Category
  value: number
  status: QuestionStatus
  questionNumber: number
}

const QUESTION_CATEGORIES: Category[] = ['Tech', 'Sports', 'Rajagiri', 'Entertainment']
const QUESTION_VALUES = [20, 40, 60, 80]

const createQuestions = (): Question[] => {
  const questions: Question[] = []

  QUESTION_CATEGORIES.forEach((category) => {
    QUESTION_VALUES.forEach((value, index) => {
      questions.push({
        id: `${category.toLowerCase()}-${value}`,
        category,
        value,
        status: 'available',
        questionNumber: index + 1,
      })
    })
  })

  return questions
}

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [teams, setTeams] = useState<Team[]>([])
  const [questions, setQuestions] = useState<Question[]>(() => createQuestions())
  const [currentTurn, setCurrentTurn] = useState(0)
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null)
  const [teamName, setTeamName] = useState('')
  const [teamMembers, setTeamMembers] = useState(['', '', '', ''])
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null)
  const [adminSelectedTeamId, setAdminSelectedTeamId] = useState<number | null>(null)
  const [adminScoreDelta, setAdminScoreDelta] = useState(10)
  const [adminManualScore, setAdminManualScore] = useState('1000')
  const [adminQuestionId, setAdminQuestionId] = useState('')

  useEffect(() => {
    if (teams.length === 0) {
      setCurrentTurn(0)
      return
    }

    setCurrentTurn((value) => value % teams.length)
  }, [teams.length])

  useEffect(() => {
    if (!adminSelectedTeamId && teams.length > 0) {
      setAdminSelectedTeamId(teams[0].id)
    }
  }, [adminSelectedTeamId, teams])

  useEffect(() => {
    if (!adminQuestionId && questions.length > 0) {
      setAdminQuestionId(questions[0].id)
    }
  }, [adminQuestionId, questions])

  const currentTeam = teams[currentTurn] ?? null
  const nextTeam = teams[(currentTurn + 1) % teams.length] ?? null
  const leaderboardTeams = [...teams].sort((a, b) => a.score - b.score)
  const selectedAdminQuestion = questions.find((question) => question.id === adminQuestionId) ?? null

  const resetTeamForm = () => {
    setTeamName('')
    setTeamMembers(['', '', '', ''])
    setEditingTeamId(null)
  }

  const handleTeamInputChange = (index: number, value: string) => {
    setTeamMembers((current) => current.map((member, memberIndex) => (memberIndex === index ? value : member)))
  }

  const handleSaveTeam = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const cleanedName = teamName.trim()
    const cleanedMembers = teamMembers.map((member) => member.trim()).filter(Boolean)

    if (!cleanedName || cleanedMembers.length < 3 || cleanedMembers.length > 4) {
      return
    }

    if (editingTeamId) {
      setTeams((current) =>
        current.map((team) =>
          team.id === editingTeamId
            ? { ...team, name: cleanedName, members: cleanedMembers }
            : team,
        ),
      )
    } else {
      setTeams((current) => [
        ...current,
        {
          id: Date.now(),
          name: cleanedName,
          members: cleanedMembers,
          score: 1000,
        },
      ])
    }

    resetTeamForm()
  }

  const handleEditTeam = (team: Team) => {
    setEditingTeamId(team.id)
    setTeamName(team.name)
    setTeamMembers([...team.members, '', '', ''].slice(0, 4))
    setScreen('teams')
  }

  const handleDeleteTeam = (teamId: number) => {
    setTeams((current) => current.filter((team) => team.id !== teamId))
  }

  const handleQuestionSelect = (question: Question) => {
    if (question.status === 'completed' || teams.length === 0) {
      return
    }

    setSelectedQuestion(question)
  }

  const handleQuestionAction = (outcome: 'correct' | 'wrong' | 'pass') => {
    if (!selectedQuestion || !currentTeam || teams.length === 0) {
      return
    }

    const questionValue = selectedQuestion.value

    if (outcome === 'pass') {
      setQuestions((current) =>
        current.map((question) => (question.id === selectedQuestion.id ? { ...question, status: 'passed' } : question)),
      )
    } else {
      setQuestions((current) =>
        current.map((question) => (question.id === selectedQuestion.id ? { ...question, status: 'completed' } : question)),
      )

      setTeams((current) =>
        current.map((team) =>
          team.id === currentTeam.id
            ? {
                ...team,
                score: outcome === 'correct' ? team.score - questionValue : team.score + questionValue,
              }
            : team,
        ),
      )
    }

    setCurrentTurn((value) => (value + 1) % teams.length)
    setSelectedQuestion(null)
  }

  const handleResetBoard = () => {
    setQuestions((current) => current.map((question) => ({ ...question, status: 'available' })))
    setCurrentTurn(0)
  }

  const handleResetScores = () => {
    setTeams((current) => current.map((team) => ({ ...team, score: 1000 })))
  }

  const handleScoreAdjust = (delta: number) => {
    if (!adminSelectedTeamId) {
      return
    }

    setTeams((current) =>
      current.map((team) => (team.id === adminSelectedTeamId ? { ...team, score: team.score + delta } : team)),
    )
  }

  const handleManualScoreSave = () => {
    if (!adminSelectedTeamId) {
      return
    }

    const nextScore = Number(adminManualScore)

    if (Number.isNaN(nextScore)) {
      return
    }

    setTeams((current) =>
      current.map((team) => (team.id === adminSelectedTeamId ? { ...team, score: nextScore } : team)),
    )
  }

  const handleResetSingleTeamScore = () => {
    if (!adminSelectedTeamId) {
      return
    }

    setTeams((current) =>
      current.map((team) => (team.id === adminSelectedTeamId ? { ...team, score: 1000 } : team)),
    )
  }

  const handleQuestionAdminAction = (status: QuestionStatus) => {
    if (!adminQuestionId) {
      return
    }

    setQuestions((current) =>
      current.map((question) => (question.id === adminQuestionId ? { ...question, status } : question)),
    )
  }

  const handleResetQuestion = () => {
    if (!adminQuestionId) {
      return
    }

    setQuestions((current) =>
      current.map((question) => (question.id === adminQuestionId ? { ...question, status: 'available' } : question)),
    )
  }

  const handleExportScores = () => {
    const rows = ['Team,Score']
    teams.forEach((team) => rows.push(`${team.name},${team.score}`))
    const csv = rows.join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'quiz-scores.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app-shell">
      <nav className="top-nav">
        <div>
          <p className="eyebrow">0 Points Quiz</p>
          <h1>Quiz Management Console</h1>
        </div>
        <div className="nav-actions">
          <button type="button" className={screen === 'home' ? 'nav-pill active' : 'nav-pill'} onClick={() => setScreen('home')}>
            Home
          </button>
          <button type="button" className={screen === 'teams' ? 'nav-pill active' : 'nav-pill'} onClick={() => setScreen('teams')}>
            Manage Teams
          </button>
          <button type="button" className={screen === 'quiz' ? 'nav-pill active' : 'nav-pill'} onClick={() => setScreen('quiz')}>
            Start Quiz
          </button>
          <button type="button" className={screen === 'admin' ? 'nav-pill active' : 'nav-pill'} onClick={() => setScreen('admin')}>
            Admin Panel
          </button>
        </div>
      </nav>

      {screen === 'home' && (
        <section className="hero-card">
          <div className="hero-copy">
            <p className="eyebrow">Event-ready dashboard</p>
            <h2>Run the 0 Points Quiz with live scoring, automatic turns, and instant leaderboards.</h2>
            <p className="hero-text">
              Register teams, manage the board, and keep the event moving from one screen to the next without a backend.
            </p>
            <div className="hero-actions">
              <button type="button" className="primary-btn" onClick={() => setScreen('quiz')}>
                Start Quiz
              </button>
              <button type="button" className="secondary-btn" onClick={() => setScreen('teams')}>
                Manage Teams
              </button>
            </div>
          </div>
          <div className="hero-stats">
            <div className="stat-card">
              <span>{teams.length}</span>
              <p>Registered Teams</p>
            </div>
            <div className="stat-card">
              <span>{questions.filter((question) => question.status === 'completed').length}</span>
              <p>Completed Questions</p>
            </div>
            <div className="stat-card">
              <span>{questions.filter((question) => question.status === 'passed').length}</span>
              <p>Passed Questions</p>
            </div>
          </div>
        </section>
      )}

      {screen === 'teams' && (
        <section className="content-grid">
          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Team Management</p>
                <h3>Register and edit teams</h3>
              </div>
              <button type="button" className="secondary-btn" onClick={() => setScreen('quiz')}>
                Open Quiz
              </button>
            </div>

            <form className="team-form" onSubmit={handleSaveTeam}>
              <label>
                Team Name
                <input value={teamName} onChange={(event) => setTeamName(event.target.value)} placeholder="Enter team name" />
              </label>
              <div className="member-grid">
                {teamMembers.map((member, index) => (
                  <label key={index}>
                    Member {index + 1}{index < 3 ? '' : ' (optional)'}
                    <input
                      value={member}
                      onChange={(event) => handleTeamInputChange(index, event.target.value)}
                      placeholder={index < 3 ? `Member ${index + 1}` : 'Optional'}
                    />
                  </label>
                ))}
              </div>
              <div className="form-actions">
                <button type="submit" className="primary-btn">
                  {editingTeamId ? 'Save Team' : 'Add Team'}
                </button>
                {editingTeamId && (
                  <button type="button" className="secondary-btn" onClick={resetTeamForm}>
                    Cancel Edit
                  </button>
                )}
              </div>
              <p className="hint">Teams need at least 3 members and at most 4. Every team starts with 1000 points.</p>
            </form>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Registered Teams</p>
                <h3>Current roster</h3>
              </div>
            </div>
            {teams.length === 0 ? (
              <div className="empty-state">No teams yet. Add the first team to begin.</div>
            ) : (
              <div className="team-list">
                {teams.map((team) => (
                  <article key={team.id} className="team-card">
                    <div>
                      <h4>{team.name}</h4>
                      <p>{team.members.join(' • ')}</p>
                    </div>
                    <div className="team-card-meta">
                      <span className="score-pill">{team.score}</span>
                      <div className="team-card-actions">
                        <button type="button" onClick={() => handleEditTeam(team)}>
                          Edit
                        </button>
                        <button type="button" onClick={() => handleDeleteTeam(team.id)}>
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {screen === 'quiz' && (
        <section className="quiz-shell">
          <div className="quiz-board">
            <div className="quiz-topbar">
              <div className="topbar-card">
                <p className="eyebrow">Current turn</p>
                <h3>{currentTeam ? currentTeam.name : 'No team selected'}</h3>
              </div>
              <div className="topbar-card">
                <p className="eyebrow">Current score</p>
                <h3>{currentTeam ? `${currentTeam.score}` : '0'}</h3>
              </div>
              <div className="topbar-card">
                <p className="eyebrow">Next team</p>
                <h3>{nextTeam ? nextTeam.name : '—'}</h3>
              </div>
            </div>

            <div className="board-grid">
              {QUESTION_CATEGORIES.map((category) => (
                <div key={category} className="category-column">
                  <div className="category-header">{category}</div>
                  {QUESTION_VALUES.map((value) => {
                    const question = questions.find((item) => item.category === category && item.value === value)

                    if (!question) {
                      return null
                    }

                    const isCompleted = question.status === 'completed'
                    const isPassed = question.status === 'passed'

                    return (
                      <button
                        key={question.id}
                        type="button"
                        className={`question-cell ${isCompleted ? 'completed' : ''} ${isPassed ? 'passed' : ''}`}
                        onClick={() => handleQuestionSelect(question)}
                        disabled={isCompleted || teams.length === 0}
                      >
                        <span>{value}</span>
                        {isCompleted ? '✓' : isPassed ? 'Passed' : 'Open'}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          <aside className="leaderboard-panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Live leaderboard</p>
                <h3>Lowest score wins</h3>
              </div>
            </div>
            <div className="leaderboard-table">
              <div className="leaderboard-row leaderboard-head">
                <span>Rank</span>
                <span>Team</span>
                <span>Score</span>
              </div>
              {leaderboardTeams.map((team, index) => (
                <div key={team.id} className={`leaderboard-row ${team.id === currentTeam?.id ? 'active' : ''}`}>
                  <span>#{index + 1}</span>
                  <span>{team.name}</span>
                  <span>{team.score}</span>
                </div>
              ))}
            </div>
          </aside>
        </section>
      )}

      {selectedQuestion && currentTeam && (
        <div className="modal-backdrop" onClick={() => setSelectedQuestion(null)}>
          <div className="question-modal" onClick={(event) => event.stopPropagation()}>
            <p className="eyebrow">Question action</p>
            <h3>{selectedQuestion.category} • {selectedQuestion.value} points</h3>
            <p>Question {selectedQuestion.questionNumber}</p>
            <p className="modal-team">Current team: {currentTeam.name}</p>
            <div className="modal-actions">
              <button type="button" className="primary-btn" onClick={() => handleQuestionAction('correct')}>
                Correct
              </button>
              <button type="button" className="secondary-btn" onClick={() => handleQuestionAction('wrong')}>
                Wrong
              </button>
              <button type="button" className="warning-btn" onClick={() => handleQuestionAction('pass')}>
                Pass
              </button>
              <button type="button" className="ghost-btn" onClick={() => setSelectedQuestion(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {screen === 'admin' && (
        <section className="admin-grid">
          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Team management</p>
                <h3>Maintain the roster</h3>
              </div>
            </div>
            <div className="stack">
              <button type="button" className="secondary-btn" onClick={() => setScreen('teams')}>
                Add or Edit Teams
              </button>
              <button type="button" className="secondary-btn" onClick={handleResetScores}>
                Reset Scores
              </button>
              <button type="button" className="secondary-btn" onClick={() => setTeams([])}>
                Clear All Teams
              </button>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Score management</p>
                <h3>Adjust team totals</h3>
              </div>
            </div>
            <label>
              Team
              <select value={adminSelectedTeamId ?? ''} onChange={(event) => setAdminSelectedTeamId(Number(event.target.value))}>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="stack">
              <label>
                Adjust by
                <input type="number" value={adminScoreDelta} onChange={(event) => setAdminScoreDelta(Number(event.target.value))} />
              </label>
              <button type="button" className="secondary-btn" onClick={() => handleScoreAdjust(adminScoreDelta)}>
                Increase Score
              </button>
              <button type="button" className="secondary-btn" onClick={() => handleScoreAdjust(-adminScoreDelta)}>
                Decrease Score
              </button>
              <label>
                Manual Score
                <input value={adminManualScore} onChange={(event) => setAdminManualScore(event.target.value)} />
              </label>
              <button type="button" className="primary-btn" onClick={handleManualScoreSave}>
                Save Manual Score
              </button>
              <button type="button" className="secondary-btn" onClick={handleResetSingleTeamScore}>
                Reset to 1000
              </button>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Question management</p>
                <h3>Update board state</h3>
              </div>
            </div>
            <label>
              Question
              <select value={adminQuestionId} onChange={(event) => setAdminQuestionId(event.target.value)}>
                {questions.map((question) => (
                  <option key={question.id} value={question.id}>
                    {question.category} • {question.value} • Q{question.questionNumber}
                  </option>
                ))}
              </select>
            </label>
            {selectedAdminQuestion && <p className="hint">Current status: {selectedAdminQuestion.status}</p>}
            <div className="stack">
              <button type="button" className="secondary-btn" onClick={handleResetQuestion}>
                Reset Question
              </button>
              <button type="button" className="secondary-btn" onClick={() => handleQuestionAdminAction('completed')}>
                Mark Completed
              </button>
              <button type="button" className="secondary-btn" onClick={() => handleQuestionAdminAction('available')}>
                Mark Available
              </button>
              <button type="button" className="secondary-btn" onClick={handleResetBoard}>
                Reset Entire Board
              </button>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Game controls</p>
                <h3>Reset or export</h3>
              </div>
            </div>
            <div className="stack">
              <button type="button" className="secondary-btn" onClick={() => { handleResetBoard(); handleResetScores(); setCurrentTurn(0) }}>
                Restart Event
              </button>
              <button type="button" className="secondary-btn" onClick={() => { setTeams([]); setQuestions(createQuestions()); setCurrentTurn(0) }}>
                Clear All Teams
              </button>
              <button type="button" className="primary-btn" onClick={handleExportScores}>
                Export Scores
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default App
