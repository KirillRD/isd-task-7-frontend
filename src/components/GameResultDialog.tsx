import { MouseEventHandler } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

type GameResultDialogProps = {
  header: string| undefined;
  visible: boolean | undefined;
  resultMessage: string| undefined;
  onRestart: MouseEventHandler<HTMLButtonElement> | undefined;
  onExit: MouseEventHandler<HTMLButtonElement> | undefined;
}

export const GameResultDialog = ({
  header,
  visible,
  resultMessage,
  onRestart,
  onExit
}: GameResultDialogProps) => {
  return (
    <Dialog
      header={header}
      visible={visible}
      className='xl:w-4 lg:col-6 md:col-8 sm:col-10'
      onHide={() => {}} closable={false}>
      <div className='flex flex-column align-items-center'>
        <p className='result-message'>{resultMessage}</p>
        <div className='flex gap-3'>
          <Button type='button' icon='pi pi-replay' onClick={onRestart} />
          <Button type='submit' icon='pi pi-sign-out' onClick={onExit} />
        </div>
      </div>
    </Dialog>
  );
}
