type GameHeaderProps = {
  firstPlayerName: string | undefined;
  secondPlayerName: string | undefined;
  firstPlayerIcon: string | undefined;
  secondPlayerIcon: string | undefined;
  firstPlayerScore: number | undefined;
  secondPlayerScore: number | undefined;
  turnMessage: string | undefined;
  turnMessageIcon: string | undefined;
}

export const GameHeader = ({
  firstPlayerName,
  secondPlayerName,
  firstPlayerIcon,
  secondPlayerIcon,
  firstPlayerScore,
  secondPlayerScore,
  turnMessage,
  turnMessageIcon
}: GameHeaderProps) => {
  return (
    <div className='game-header'>
      <div className='game-header-players'>
        <div className='game-header-player'>
          <span className='game-header-player-name-first'>{firstPlayerName}</span>
          <div className='game-header-player-icon-container'>
            <img src={firstPlayerIcon} className='game-header-player-icon' />
          </div>
        </div>
        <div className='game-header-player'>
          <div className='game-header-player-icon-container'>
            <img src={secondPlayerIcon} className='game-header-player-icon' />
          </div>
          <span className='game-header-player-name-second'>{secondPlayerName}</span>
        </div>
      </div>
      <div className='game-header-scores'>
        <span className='game-header-score-first'>{firstPlayerScore}</span>
        <span className='game-header-score-colon'>:</span>
        <span className='game-header-score-second'>{secondPlayerScore}</span>
      </div>
      <div className='game-header-turn'>
        <span className='game-header-turn-message'>{turnMessage}</span>
        <div className='game-header-turn-icon-container'>
          <img src={turnMessageIcon} className='game-header-turn-icon' />
        </div>
      </div>
    </div>
  );
}
