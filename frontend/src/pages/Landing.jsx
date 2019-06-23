import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
            userId: userId,
            isShowBoards : false
        }
        this.goToBoard = this.goToBoard.bind(this);
        this.loadBoards = this.loadBoards.bind(this);
        this.boardsLoaded = this.boardsLoaded.bind(this);
    }

    componentWillMount() {
        boardStore.on(EventTypes.ADD_BOARD_COMPLETED, this.goToBoard);
        boardStore.on(EventTypes.LOAD_BOARDS_COMPLETED, this.boardsLoaded);
    }

    componentDidMount() {
        this.loadBoards()
    }

    componentWillUnmount() {
        boardStore.removeListener(EventTypes.ADD_BOARD_COMPLETED, this.goToBoard);
        boardStore.removeListener(EventTypes.LOAD_BOARDS_COMPLETED, this.boardsLoaded);
    }

    boardsLoaded() {
        var boards = boardStore.getBoards();
        if (boards.edited) {
            boards.edited = boards.edited.filter(function(b1) {
                if (boards.owned) {
                    const found = boards.owned.find(function(b2) {
                        return b2.id === b1.id;
                    });
                    return  !found ? true : false;
                }
                return true;
            });
        }

        if (
            (boards.edited && boards.edited.length > 0)
            || (boards.owned && boards.owned.length > 0)
        ){
            this.setState( {
                isShowBoards : true
            });
        }
    }

    loadBoards() {
        boardStore.loadBoards(this.state.userId);
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
                            <div className="tile is-child is-4">
                                <JoinSection isFullwidth="true" isPrimary="true"></JoinSection>
                                <AddNewBoardButton isFullwidth="true" label="Create a retrospective" userId={this.state.userId}></AddNewBoardButton>
                                {
                                    this.state.isShowBoards && (
                                        <div className="field">
                                            <Link to="/boards" className="button is-fullwidth is-info">Show my boards</Link>
                                        </div>
                                    )
                                }
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