import 'normalize.css';
import 'primereact/resources/themes/soho-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';
import './assets/styles/index.css';
import { useUserContext } from './context/UserContext';
import { Navigate, Route, Routes } from 'react-router-dom';
import { NotFound } from './pages/NotFound';
import { ApiRoute, Game } from './constants';
import { GameEntry } from './pages/GameEntry';
import { TicTacToe } from './pages/TicTacToe';
import { FourInRow } from './pages/FourInRow';

function App() {
  const { user } = useUserContext();

  return (
    <>
      <div className='p-component surface-ground text-color flex flex-column min-h-screen'>
        <main className='flex flex-column flex-grow-1'>
          <Routes>
            <Route path={ApiRoute.DEFAULT} element={!user ? <Navigate to={ApiRoute.GAME_ENTRY} /> :
            user.game == Game.TIC_TAC_TOE ? <Navigate to={ApiRoute.TIC_TAC_TOE} /> :
            user.game == Game.FOUR_IN_ROW ? <Navigate to={ApiRoute.FOUR_IN_ROW} /> :
            <Navigate to={ApiRoute.NOT_FOUND} />} />
            <Route path={ApiRoute.GAME_ENTRY} element={!user ? <GameEntry /> : <Navigate to={ApiRoute.DEFAULT} />} />
            <Route path={ApiRoute.TIC_TAC_TOE} element={user ? <TicTacToe /> : <Navigate to={ApiRoute.DEFAULT} />} />
            <Route path={ApiRoute.FOUR_IN_ROW} element={user ? <FourInRow/> : <Navigate to={ApiRoute.DEFAULT} />} />
            <Route path={ApiRoute.NOT_FOUND} element={<NotFound />}/>
            <Route path='*' element={<Navigate to={ApiRoute.NOT_FOUND} />} />
          </Routes>
        </main>
      </div>
    </>
  )
}

export default App;
