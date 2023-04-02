import { ProgressSpinner } from 'primereact/progressspinner';
import { GameMessage } from '../constants';

export const WaitingOpponentScreen = () => {
  return (
    <div className='waiting-opponent-container'>
      <ProgressSpinner />
      <span>{GameMessage.WAITING_OPPONENT}</span>
    </div>
  );
}
