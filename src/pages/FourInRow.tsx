import { useEffect, useState } from 'react';
import { DISCONNECT_FROM_ROOM, FIR, GameMessage, GameName } from '../constants';
import { useUserContext } from '../context/UserContext';
import { socket } from '../services/socket.service';
import { RoomUser } from '../types';
import red from '/red.svg';
import blue from '/blue.svg';
import { GameHeader } from '../components/GameHeader';
import { ExitButton } from '../components/ExitButton';
import { WaitingOpponentScreen } from '../components/WaitingOpponentScreen';
import { GameResultDialog } from '../components/GameResultDialog';
import { GameContainer } from '../components/GameContainer';
import { useBeforeunload } from 'react-beforeunload';

const RED = 'r';
const BLUE = 'b';
const COLUMN_COUNT = 7;
const ROW_COUNT = 6;

export const FourInRow = () => {
  const { user, logout } = useUserContext();
  const [opponent, setOpponent] = useState<boolean>(false);
  const [resultMessage, setResultMessage] = useState<string>('');
  const [resultMessageModal, setResultMessageModal] = useState<boolean>(false);
  const [owner, setOwner] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [grid, setGrid] = useState<string[][]>([]);
  const [roomUsers, setRoomUsers] = useState<RoomUser[]>([]);
  const [winCombo, setWinCombo] = useState<number[][]>([]);

  const onDisconnectFromRoom = () => {
    setResultMessageModal(false);
    setOpponent(false);
    setResultMessage('');
    setWinCombo([]);
  }

  const onState = (owner: string, color: string, grid: string[][], roomUsers: RoomUser[]) => {
    setOpponent(true);
    setOwner(owner);
    setColor(owner == user!.id ? color : color == RED ? BLUE : RED);
    setGrid(grid);
    if (roomUsers) {
      setRoomUsers(roomUsers);
    }
  }

  const onWin = (grid: string[][], userId: string, winCombo: number[][], roomUsers: RoomUser[]) => {
    setWinCombo(winCombo);
    setRoomUsers(roomUsers);
    setGrid(grid);
    setResultMessage(user!.id == userId ? GameMessage.WIN : GameMessage.LOSE);
    setTimeout(() => setResultMessageModal(true), 3000);
  }

  const onDraw = (grid: string[][]) => {
    setGrid(grid);
    setResultMessage(GameMessage.DRAW);
    setTimeout(() => setResultMessageModal(true), 3000);
  }

  useEffect(() => {
    const load = () => {
      socket.on(DISCONNECT_FROM_ROOM, onDisconnectFromRoom);
      socket.on(FIR.STATE, onState);
      socket.on(FIR.WIN, onWin);
      socket.on(FIR.DRAW, onDraw);
      socket.emit(FIR.STATE, user!.id);
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
    socket.emit(FIR.RESTART, user!.id);
  }

  const handleMove = (column: number) => {
    socket.emit(FIR.MOVE, user!.id, column, color);
  }

  const getColor = (roomUserIndex: number) => {
    if (!roomUsers.length) return undefined;
    if (roomUsers[roomUserIndex].user.id == user!.id) {
      return color == RED ? red : blue;
    } else {
      return color != RED ? red : blue;
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

  const getTurnMessageColor = () => {
    return !resultMessage ? user!.id == owner ? color == RED ? red : blue : color != RED ? red : blue : undefined;
  }

  return (
    <div className={`flex flex-column h-screen w-screen ${opponent ? 'justify-content-end' : 'justify-content-center'}`}>
      {opponent ?
        <>
          <GameHeader
            firstPlayerName={getUserName(0)}
            secondPlayerName={getUserName(1)}
            firstPlayerIcon={getColor(0)}
            secondPlayerIcon={getColor(1)}
            firstPlayerScore={getUserWins(0)}
            secondPlayerScore={getUserWins(1)}
            turnMessage={getTurnMessage()}
            turnMessageIcon={getTurnMessageColor()} />
          <GameContainer>
            <div className='four-in-row-container'>
              <div className='four-in-row-control'>
                {Array.from(Array(COLUMN_COUNT)).map((_, i) => {
                  return (
                    <div
                      key={`control-row-${i}`}
                      className={`four-in-row-control-block ${user!.id == owner && !resultMessage && !grid[ROW_COUNT-1][i] ?
                      color == RED ? 'four-in-row-red-control-block' : 'four-in-row-blue-control-block' : ''}`}
                      onClick={user!.id == owner && !resultMessage && !grid[ROW_COUNT-1][i] ? () => handleMove(i) : undefined}>
                    </div>
                  );
                })}
              </div>
              <div className='four-in-row'>
                {[...grid].reverse().map((row, i) => row.map((c, j) => {
                  return (
                    <div
                      key={`${i}-${j}`}
                      className={`four-in-row-block ${
                        c ? c == RED ? 'four-in-row-red-block' : 'four-in-row-blue-block' : ''
                      } ${
                        winCombo.length && winCombo
                          .some(combo => combo[0]==ROW_COUNT-i-1 && combo[1]==j) ? 'four-in-row-block-animation' : ''
                      }`}>
                    </div>
                  );
                }))}
              </div>
            </div>
          </GameContainer>
          <GameResultDialog
            header={GameName.FOUR_IN_ROW}
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
