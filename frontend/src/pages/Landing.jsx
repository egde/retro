import React, { Component } from 'react';
import {withCookies} from 'react-cookie';
import v4 from 'uuid/v4';

import JoinSection from '../components/JoinSection';
import AddNewBoardButton from '../components/AddNewBoardButton';
import boardStore from '../actions/BoardStore';
import { EventTypes } from '../actions/BoardActionTypes';

class Landing extends Component {
    
    constructor(props) {
        super(props)

        const { cookies } = props;
        let userId = cookies.get('uuid');
        if (!userId) {
            userId = v4();
            cookies.set('uuid', userId)
        }
        this.state = {
            userId: userId
        }
        this.goToBoard = this.goToBoard.bind(this);
    }

    componentWillMount() {
        boardStore.on(EventTypes.ADD_BOARD_COMPLETED, this.goToBoard);
    }

    componentWillUnmount() {
        boardStore.removeListener(EventTypes.ADD_BOARD_COMPLETED, this.goToBoard);
    }

    goToBoard(boardId) {
        if (boardId) {
            this.props.history.push('/boards/'+boardId)
        }
    }

    render() {
        return (<section id="Landing" className="hero is-fullheight has-background is-dark">
            <img alt="Friendship" class="hero-background is-transparent" src="friendship-2366955_1920.jpg" />
            <div className="hero-body">
                <div className="container">
                    <h1 className="title">retro</h1>
                    <h2 className="subtitle">a nimble tool for your retrospectives</h2>
                    <div className="tile">
                        <div className="tile is-parent is-vertical">
                            <div className="tile is-child">
                                <JoinSection className="is-8"></JoinSection>
                                <AddNewBoardButton className="is-8" label="Create a retrospective" userId={this.state.userId}></AddNewBoardButton>
                            </div>
                        </div>
                    </div>
                    <div className="level">
                        <div className="level-item">
                            
                        </div>
                    </div>
                </div>
            </div>
        </section>)
    }
}

export default withCookies(Landing);