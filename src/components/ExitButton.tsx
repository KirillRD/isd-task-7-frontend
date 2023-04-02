import { MouseEventHandler } from 'react';
import { Button } from 'primereact/button';

type ExitButtonProps = {
  onClick: MouseEventHandler<HTMLButtonElement> | undefined;
}

export const ExitButton = ({onClick}: ExitButtonProps) => {
  return (
    <Button type='button' className='exit-button' icon='pi pi-sign-out' onClick={onClick} />
  );
}
