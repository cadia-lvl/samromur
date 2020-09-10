import * as React from 'react';
import { WrapGridArguments } from 'animate-css-grid/dist/types';

// Contitional rendering for SSR builds
let wrapGrid: any = null;
if (typeof window !== "undefined") {
    wrapGrid = require("animate-css-grid").wrapGrid
}

interface Props {
    className?: string;
    wrapGridArguments: WrapGridArguments;
}

export default class Grid extends React.Component<Props> {
    ref: any;

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        wrapGrid(this.ref, this.props.wrapGridArguments);
    }

    render() {
        return (
            <div className={this.props.className} ref={element => this.ref = element}>
                {this.props.children}
            </div>
        );
    }
}