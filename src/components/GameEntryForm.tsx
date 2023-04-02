import { ChangeEvent, useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import {RadioButtonChangeEvent } from 'primereact/radiobutton';
import { ListBox, ListBoxChangeEvent } from 'primereact/listbox';
import { InputSwitch, InputSwitchChangeEvent } from 'primereact/inputswitch';
import { User } from '../types';
import { socket } from '../services/socket.service';
import { useUserContext } from '../context/UserContext';
import { CONNECT_TO_ROOM, FREE_USERS, Game, GameName, USER } from '../constants';
import ticTacToe from '/ticTacToe.jpg';
import fourInRow from '/fourInRow.jpg';
import { GameEntryRadioButton } from './GameEntryRadioButton';

type GameEntryFormProps = {
  className?: string;
}

type FreeUser = {
  code: string;
  name: string;
}

export const GameEntryForm = ({ className }: GameEntryFormProps) => {
  const { setUser } = useUserContext();
  const [freeUsers, setFreeUsers] = useState<FreeUser[]>([]);

  const [userName, setUsername] = useState<string>('');
  const [isNewRoom, setIsNewRoom] = useState<boolean>(true);
  const [selectedGame, setSelectedGame] = useState<string>('');
  const [selectedFreeUser, setSelectedFreeUser] = useState<FreeUser | null>(null);

  const convertToFreeUsers = (users: User[]): FreeUser[] => {
    return users.map(user => ({
      code: user.id,
      name: user.name
    }));
  }

  useEffect(() => {
    socket.on(FREE_USERS, (users: User[]) => {
      setFreeUsers(convertToFreeUsers(users));
    });

    socket.on(USER, (user: User) => {
      setUser(user);
    });

    return () => {
      socket.removeAllListeners();
    }
  }, [])

  const handleUserNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  }

  const handleGameSelectChange = (event: RadioButtonChangeEvent) => {
    const game = event.value;
    setSelectedGame(game);
    setSelectedFreeUser(null);
    socket.emit(FREE_USERS, game);
  }

  const handleIsNewRoomChange = (event: InputSwitchChangeEvent) => {
    setIsNewRoom(event.value!);
    setSelectedFreeUser(null);
  }

  const handleFreeUserSelectChange = (event: ListBoxChangeEvent) => {
    setSelectedFreeUser(event.value);
  }

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (isNewRoom) {
      socket.emit(CONNECT_TO_ROOM, userName, selectedGame);
    } else {
      socket.emit(CONNECT_TO_ROOM, userName, selectedGame, selectedFreeUser?.code);
    }
  }

  return (
    <form className={`flex flex-column p-fluid border-1 border-primary-100 border-round-md px-5 pb-5 surface-0 shadow-2 text-lg ${className}`} onSubmit={handleSubmit}>
      <h1 className='align-self-center text-primary text-4xl'>Game entry</h1>

      <label htmlFor='name' className='mb-1'>Name</label>
      <span className='p-input-icon-right'>
        <i className='pi pi-user' />
        <InputText id='name' placeholder='Username' onChange={handleUserNameChange} />
      </span>

      <div className='game-entry-radio-btn-group-container mt-3'>
        <GameEntryRadioButton
          game={Game.TIC_TAC_TOE}
          gameName={GameName.TIC_TAC_TOE}
          image={ticTacToe}
          selectedGame={selectedGame}
          onGameSelectChange={handleGameSelectChange}/>
        <GameEntryRadioButton
          game={Game.FOUR_IN_ROW}
          gameName={GameName.FOUR_IN_ROW}
          image={fourInRow}
          selectedGame={selectedGame}
          onGameSelectChange={handleGameSelectChange}/>
      </div>

      <div className='flex justify-content-center align-items-center gap-2 mt-3'>
        <InputSwitch inputId='is-new-room' checked={isNewRoom} onChange={handleIsNewRoomChange} disabled={!selectedGame} />
        <label htmlFor='is-new-room'>New game</label>
      </div>

      <label htmlFor='free-users' className={`mb-1 mt-3 ${!selectedGame || isNewRoom ? 'text-color-secondary' : ''}`}>Join the game</label>
      <ListBox
        id='free-users'
        value={selectedFreeUser}
        onChange={handleFreeUserSelectChange}
        options={freeUsers}
        optionLabel='name'
        disabled={!selectedGame || isNewRoom} />

      <Button
        type='submit'
        className='mt-3 text-3xl'
        label='Play!'
        disabled={!userName || !selectedGame || (!selectedFreeUser && !isNewRoom)} />
    </form>
  );
}
