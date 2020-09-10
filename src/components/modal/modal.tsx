import * as React from 'react';
import Modal from './styles';
import CloseIcon from '../ui/icons/close';

interface Props {
    children?: React.ReactNode;
    onRequestClose?: (event?: React.MouseEvent | React.KeyboardEvent) => any;
    shouldReturnFocusAfterClose?: boolean;
    isOpen: boolean;
    clearBackground?: boolean;
}

export default class DefaultModal extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        const {
            children,
            clearBackground,
            onRequestClose,
            isOpen,
        } = this.props;

        return (
            <Modal
                contentLabel='modal'
                {...this.props}
                style={{
                    overlay: { background: clearBackground ? '' : 'rgba(0, 0, 0, 0.8)' },
                    content: {
                        padding: 0,
                        background: 'transparent',
                    },
                }}>
                <div className='inner'>
                    {onRequestClose && (
                        <button
                            type="button"
                            className="close"
                            onClick={onRequestClose as any}>
                            <CloseIcon height={15} width={15} />
                        </button>
                    )}
                    {children}
                </div>
            </Modal>
        )
    }
}