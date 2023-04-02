import { useEffect, useState } from 'react';
import { DISCONNECT_FROM_ROOM, GameMessage, GameName, TTT } from '../constants';
import { useUserContext } from '../context/UserContext';
import { RoomUser } from '../types';
import { socket } from './../services/socket.service';
import circle from '/circle.svg';
import cross from '/cross.svg';
import { GameHeader } from '../components/GameHeader';
import { GameContainer } from '../components/GameContainer';
import { WaitingOpponentScreen } from '../components/WaitingOpponentScreen';
import { ExitButton } from '../components/ExitButton';
import { GameResultDialog } from '../components/GameResultDialog';
import { useBeforeunload } from 'react-beforeunload';

const CROSS = 'x';
const CIRCLE = 'o';

export const TicTacToe = () => {
  const { user, logout } = useUserContext();
  const [opponent, setOpponent] = useState<boolean>(false);
  const [resultMessage, setResultMessage] = useState<string>('');
  const [resultMessageModal, setResultMessageModal] = useState<boolean>(false);
  const [owner, setOwner] = useState<string>('');
  const [mark, setMark] = useState<string>('');
  const [grid, setGrid] = useState<string[]>([]);
  const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);
  const [winCombo, setWinCombo] = useState<number[]>([]);

  const onDisconnectFromRoom = () => {
    setResultMessageModal(false);
    setOpponent(false);
    setResultMessage('');
    setWinCombo([]);
  }

  const onState = (owner: string, mark: string, grid: string[], roomUsers: RoomUser[]) => {
    setOpponent(true);
    setOwner(owner);
    setMark(owner == user!.id ? mark : mark == CROSS ? CIRCLE : CROSS);
    setGrid(grid);
    if (roomUsers) {
      setRoomUsers(roomUsers);
    }
  }

  const onWin = (grid: string[], userId: string, winCombo: number[], roomUsers: RoomUser[]) => {
    setWinCombo(winCombo);
    setRoomUsers(roomUsers);
    setGrid(grid);
    setResultMessage(user!.id == userId ? GameMessage.WIN : GameMessage.LOSE);
    setTimeout(() => setResultMessageModal(true), 3000);
  }

  const onDraw = (grid: string[]) => {
    setGrid(grid);
    setResultMessage(GameMessage.DRAW);
    setTimeout(() => setResultMessageModal(true), 3000);
  }

  useEffect(() => {
    const load = () => {
      socket.on(DISCONNECT_FROM_ROOM, onDisconnectFromRoom);
      socket.on(TTT.STATE, onState);
      socket.on(TTT.WIN, onWin);
      socket.on(TTT.DRAW, onDraw);
      socket.emit(TTT.STATE, user!.id);
    }

    load();
    return () => {
      socket.removeAllListeners();
    }
  }, [])

  const handleExit = () => {
    logout();
    socket.emit(DISCONNECT_FROM_ROOM, user!.id);
  }

  useBeforeunload(handleExit);

  const handleRestart = () => {
    setResultMessageModal(false);
    setOpponent(false);
    setResultMessage('');
    setWinCombo([]);
    socket.emit(TTT.RESTART, user!.id);
  }

  const handleMove = (cell: number) => {
    socket.emit(TTT.MOVE, user!.id, cell, mark);
  }

  const getMark = (roomUserIndex: number) => {
    if (!roomUsers.length) return undefined;
    if (roomUsers[roomUserIndex].user.id == user!.id) {
      return mark == CROSS ? cross : circle;
    } else {
      return mark != CROSS ? cross : circle;
    }
  }

  const getUserName = (roomUserIndex: number) => {
    if (!roomUsers.length) return undefined;
    return roomUsers[roomUserIndex].user.name;
  }

  const getUserWins = (roomUserIndex: number) => {
    if (!roomUsers.length) return undefined;
    return roomUsers[roomUserIndex].wins;
  }

  const getTurnMessage = () => {
    return !resultMessage ? user!.id==owner ? GameMessage.YOUR_TURN : GameMessage.OPPONENT_TURN : undefined;
  }

  const getTurnMessageMark = () => {
    return !resultMessage ? user!.id == owner ? mark == CROSS ? cross : circle : mark != CROSS ? cross : circle : undefined;
  }

  return (
    <div className={`flex flex-column h-screen w-screen ${opponent ? 'justify-content-end' : 'justify-content-center'}`}>
      {opponent ?
        <>
          <GameHeader
            firstPlayerName={getUserName(0)}
            secondPlayerName={getUserName(1)}
            firstPlayerIcon={getMark(0)}
            secondPlayerIcon={getMark(1)}
            firstPlayerScore={getUserWins(0)}
            secondPlayerScore={getUserWins(1)}
            turnMessage={getTurnMessage()}
            turnMessageIcon={getTurnMessageMark()} />
          <GameContainer>
            <div className='game-container'>
              <div className='tic-tac-toe-container'>
                {grid.map((cell, i) => {
                  return (
                    <div
                      key={i}
                      className={`tic-tac-toe-cell ${cell || user!.id != owner || resultMessage ? '' : 'tic-tac-toe-cell-hover'}`}
                      onClick={cell || user!.id != owner || resultMessage ? undefined : () => handleMove(i)}>
                      {cell && <img src={cell == CROSS ? cross : circle}
                        className={`tic-tac-toe-mark ${winCombo.length && winCombo.includes(i) ? 'tic-tac-toe-mark-animation' : ''}`}></img>}
                    </div>
                  );
                })}
              </div>
            </div>
          </GameContainer>
          <GameResultDialog
            header={GameName.TIC_TAC_TOE}
            visible={resultMessageModal}
            resultMessage={resultMessage}
            onRestart={handleRestart}
            onExit={handleExit} />
        </> :
        <WaitingOpponentScreen />
      }
      <ExitButton onClick={handleExit} />
    </div>
  );
}
