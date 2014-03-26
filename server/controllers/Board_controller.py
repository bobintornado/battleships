from server.lib.bottle import Bottle, debug,request
import json
import random
# use the Jinja templating system
from view_helper import JINJA_ENV

bottle = Bottle() # create another WSGI application for this controller and resource.
debug(True) #  uncomment for verbose error logging. Do not use in production


@bottle.get('/initialize')
def init():
  board = []
  #initialize the grid
  for x in range(0,7):
    row = []
    for y in range(0,7):
      row.append('-')
    board.append(row)
  
  #initialize ships
  ships = [5,4,3,3,2]
  return plot(ships,board)

def boardStr(board): 
  grid = []
  for l in board:
    rowStr = " ".join(l)
    grid.append(rowStr)

  return '|'.join(grid)
  

def plot(ships,board):
  #if there are still ship enploted, randomly pick a left ship 
  while len(ships) > 0:
      shipIndex = random.randrange(len(ships))
      ship = ships[shipIndex]
      shipLen = ship
      del ships[shipIndex]
      
      #randomly pick a starting point in board
      rowIndex = random.randrange(len(board))
      row = board[rowIndex]
      cellIndex = random.randrange(len(row))
      cell = board[rowIndex][cellIndex]
      #assign a random point
      
      plot = False
      #not ploted yet
      while plot == False:
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
          while ship > 0:
            if ship == 2:
              if rowIndex == 0 or rowIndex == 6:
                break
            if rowIndex == 0 or rowIndex == 6:
              break
            rowIndex -= 1
            if board[rowIndex][cellIndex] is 's':
              #break and replot
              break
            ship -= 1
          if ship == 0:
            x = 0
            while x < shipLen:
              board[rowIndex][cellIndex] = 's'
              rowIndex += 1
              x += 1
            plot = True
            #return boardStr(board) + "  up"
        elif d == 1:
          while ship > 0:
            if ship == 2:
              if cellIndex == 0 or cellIndex == 6:
                break
            if cellIndex == 0 or cellIndex == 6:
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
            #return boardStr(board) + "  right"
        elif d == 2:
          while ship > 0:
            if ship == 2:
              if rowIndex == 6:
                break
            if rowIndex == 6:
              break
            rowIndex += 1
            if board[rowIndex][cellIndex] is 's':
              #break and replot
              break
            ship -= 1
          if ship == 0:
            x = 0
            while x < shipLen:
              board[rowIndex][cellIndex] = 's'
              rowIndex -= 1
              x += 1
            plot = True
            #return boardStr(board) + "  down"
        elif d == 3:
          while ship > 0:
            if ship == 2:
              if cellIndex == 0 or cellIndex == 6:
                break
            if cellIndex == 0 or cellIndex == 6:
                break
            cellIndex -= 1
            if board[rowIndex][cellIndex] is 's':
                #break and replot
                break
            ship -= 1
            if ship == 0:
              x = 0
              while x < shipLen:
                board[rowIndex][cellIndex] = 's'
                cellIndex += 1
                x += 1
              plot = True
              #return boardStr(board) + "  left"
  return boardStr(board)
      

