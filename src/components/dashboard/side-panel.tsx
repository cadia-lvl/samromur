import * as React from 'react';
import { withRouter } from 'next/router';
import { WithRouterProps } from "next/dist/client/with-router";

interface SidePanelProps {

}

interface State {

}

type Props = SidePanelProps & WithRouterProps;

class SidePanel extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return (
            <></>
        );
    }
}

export default withRouter(SidePanel);