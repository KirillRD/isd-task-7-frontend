export type User = {
  id: string;
  name: string;
  game: string;
}

export type RoomUser = {
  user: User;
  wins: number;
}
