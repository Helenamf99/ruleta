@startuml

class Game {
  - scene
  - camera
  - renderer
  - board
  - players
  - currentTurn
  + init()
  + update()
  + nextTurn()
}

class Board {
  - tiles
  + generateBoard()
  + getTile()
}

class Tile {
  - id
  - position
  - category
  - mesh
  + triggerEvent()
}

class Player {
  - name
  - lives
  - position
  - mesh
  + move()
  + loseLife()
}

class Dice {
  + roll()
}

class QuestionManager {
  - questions
  + getQuestionByCategory()
}

class Question {
  - text
  - options
  - correctAnswer
  - category
}

class Timer {
  - duration
  - currentTime
  + start()
  + stop()
}

class HUD {
  + updateLives()
  + updateTimer()
  + showQuestion()
}

Game --> Board
Game --> Player
Game --> Dice
Game --> QuestionManager
Game --> Timer
Game --> HUD

Board --> Tile

Tile --> Question

QuestionManager --> Question

@enduml