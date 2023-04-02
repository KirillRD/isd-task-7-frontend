import { GameEntryForm } from '../components/GameEntryForm';

export const GameEntry = () => {
  return (
    <div className='flex justify-content-center align-items-center flex-grow-1'>
      <GameEntryForm className='xl:col-4 lg:col-6 md:col-8 sm:col-10' />
    </div>
  );
}
