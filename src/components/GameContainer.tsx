type GameContainerProps = {
  children: JSX.Element;
}

export const GameContainer = ({children}: GameContainerProps) => {
  return (
    <div className='game-container'>
      {children}
    </div>
  );
}
