import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { Game, GameName } from '../constants';

type GameEntryRadioButtonProps = {
  game: Game;
  gameName: GameName;
  image: string;
  selectedGame: string;
  onGameSelectChange: (event: RadioButtonChangeEvent) => void;
}

export const GameEntryRadioButton = ({
  game,
  gameName,
  image,
  selectedGame,
  onGameSelectChange
}: GameEntryRadioButtonProps) => {
  return (
    <div className='game-entry-radio-btn-container'>
      <RadioButton
        inputId={`game-entry-${game}`}
        className='game-entry-radio-btn'
        name='game'
        value={game}
        onChange={onGameSelectChange}
        checked={selectedGame === game} />
      <label htmlFor={`game-entry-${game}`} className='game-entry-radio-label'>
        <img src={image} className={`game-entry-radio-label-image ${
          selectedGame === game ? 'game-entry-radio-label-image-selected' : ''
        }`} />
        <span>{gameName}</span>
      </label>
    </div>
  );
}
