from server.lib.bottle import Bottle, debug,request
import json
import random
# use the Jinja templating system
from view_helper import JINJA_ENV

from server.models.Board import Board

from google.appengine.ext import ndb

bottle = Bottle() # create another WSGI application for this controller and resource.
debug(True) #  uncomment for verbose error logging. Do not use in production

@bottle.get('/initialize')
def init():
  board = emptyBoard(7,7)
  #initialize ships
  ships = [5,4,3,3,2]
  playerPlot = plot(ships,board)
  botPlot = plot(ships,board)
  new_Bot_Board = Board(grid = botPlot)
  new_Bot_Board.put()
  result = json.dumps({"player":playerPlot,"bot":botPlot})
  return result

def emptyBoard(a,b):
  board = []
  for x in range(0,a):
    row = []
    for y in range(0,b):
      row.append('-')
    board.append(row)
  return board
  
def plot(ships,board):
  #if there are still ship enploted, randomly pick a left ship 
  while len(ships) > 0:
      shipIndex = random.randrange(len(ships))
      ship = ships[shipIndex]
      shipLen = ship
      del ships[shipIndex]
      
      #assign a random point
      rowIndex = random.randrange(len(board))
      row = board[rowIndex]
      cellIndex = random.randrange(len(row))
      cell = board[rowIndex][cellIndex]
      
      plot = False
      #not ploted yet
      while plot == False:
        #reset ship length
        ship = shipLen
        #verify if point is empty, otherwise repick
        while cell is "s":
          #re-pick a point if point is occupied
          rowIndex = random.randrange(len(board))
          row = board[rowIndex]
          cellIndex = random.randrange(len(row))
          cell = board[rowIndex][cellIndex]
        #randomly pick a direction. 0 up, 1 right, 2 down, 3 left
        directions = [0,1,2,3]
        d = random.choice(directions)
        if d == 0:
          h = str(rowIndex)
          while ship > 0:
            if rowIndex == 0:
              break
            rowIndex -= 1 
            if board[rowIndex][cellIndex] is 's':
              break
            ship -= 1
          if ship == 0:
            x = 0
            while x < shipLen:
              board[rowIndex][cellIndex] = 's'
              rowIndex += 1
              x += 1
            plot = True
        elif d == 1:
          while ship > 0:
            if ship == 2:
              if cellIndex == 6:
                break
            if cellIndex == 6:
              break
            cellIndex += 1
            if board[rowIndex][cellIndex] is 's':
              #break and replot
              break
            ship -= 1
          if ship == 0:
            x = 0
            while x < shipLen:
              board[rowIndex][cellIndex] = 's'
              cellIndex -= 1
              x += 1
            plot = True
        elif d == 2:
          while ship > 0:
            if ship == 2:
              if rowIndex == 6:
                break
            if rowIndex == 6:
              break
            rowIndex += 1
            if board[rowIndex][cellIndex] is 's':
              break
            ship -= 1
          if ship == 0:
            x = 0
            while x < shipLen:
              board[rowIndex][cellIndex] = 's'
              rowIndex -= 1
              x += 1
            plot = True
        elif d == 3:
          #move left
          while ship > 0:
            if cellIndex == 0:
              break
            cellIndex -= 1
            if row[cellIndex] is 's':
              break
            ship -= 1
          if ship == 0:
            x = 0
            while x < shipLen:
              row[cellIndex] = 's'
              cellIndex += 1
              x += 1
              plot = True
  return boardToStr(board)

def boardToStr(board): 
  grid = []
  for l in board:
    rowStr = "".join(l)
    grid.append(rowStr)
  return '|'.join(grid)

@bottle.get('/dev')
def strToBoard(boardStr="-------|sssss--|----s--|----s--|-s--ss-|-s--ss-|sss--s-"):
  grid = []
  for row in boardStr.split("|"):
    r = []
    for cell in row:
      r.append(cell)
    grid.append(r)
  return str(grid)
  
  
