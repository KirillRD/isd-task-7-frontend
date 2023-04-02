export enum ApiRoute {
  DEFAULT = '/',
  GAME_ENTRY = '/game-entry',
  TIC_TAC_TOE = '/tic-tac-toe',
  FOUR_IN_ROW = '/four-in-row',
  NOT_FOUND = '/not-found'
}

export const CONNECTION = 'connection';
export const FREE_USERS = 'free-users';
export const CONNECT_TO_ROOM = 'connect-to-room';
export const USER = 'user';
export const DISCONNECT_FROM_ROOM = 'disconnect-from-room';

export enum Game {
  TIC_TAC_TOE = 'tic-tac-toe',
  FOUR_IN_ROW = 'four-in-row',
}

export enum GameName {
  TIC_TAC_TOE = 'Tic Tac Toe',
  FOUR_IN_ROW = 'Four In Row',
}

export enum TTT {
  MOVE = 'tic-tac-toe-move',
  STATE = 'tic-tac-toe-state',
  WIN = 'tic-tac-toe-win',
  DRAW = 'tic-tac-toe-draw',
  RESTART = 'tic-tac-toe-restart',
}

export enum FIR {
  MOVE = 'four-in-row-move',
  STATE = 'four-in-row-state',
  WIN = 'four-in-row-win',
  DRAW = 'four-in-row-draw',
  RESTART = 'four-in-row-restart',
}

export enum GameMessage {
  WIN = 'You win!',
  DRAW = `Draw :|`,
  LOSE = 'You lose :(',
  YOUR_TURN = 'Your turn',
  OPPONENT_TURN = 'Opponent turn',
  WAITING_OPPONENT = 'Waiting opponent...',
}