import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {withCookies} from 'react-cookie';
import v4 from 'uuid/v4';

import BoardActions from '../actions/BoardActions';
import BoardStore from '../actions/BoardStore';
import { EventTypes } from '../actions/BoardActionTypes';
import JoinSection from '../components/JoinSection';
import AddNewBoardButton from '../components/AddNewBoardButton';

class BoardOverview extends Component {
    constructor(props) {
        super(props);

         
        const { cookies } = props;
        let userId = cookies.get('uuid');
        if (!userId) {
            userId = v4();
            cookies.set('uuid', userId)
        }

        this.state = {
            boards : {
                owner: [],
                edited : []
            },
            userId : userId,
            isShowShareBoard:false
        };
        
        this.loadBoards = this.loadBoards.bind(this);
        this.showShareBoard = this.showShareBoard.bind(this);
        this.getBoards = this.getBoards.bind(this);
    }
    
    componentWillMount() {
        BoardStore.on(EventTypes.ADD_BOARD_COMPLETED, this.getBoards);
        BoardStore.on(EventTypes.LOAD_BOARDS_COMPLETED, this.loadBoards);
        BoardStore.on(EventTypes.DELETE_BOARD_COMPLETED, this.getBoards);
    }

    componentWillUnmount() {
        BoardStore.removeListener(EventTypes.ADD_BOARD_COMPLETED, this.getBoards);
        BoardStore.removeListener(EventTypes.LOAD_BOARDS_COMPLETED, this.loadBoards);
        BoardStore.removeListener(EventTypes.DELETE_BOARD_COMPLETED, this.getBoards);
    }

    componentDidMount() {
        this.getBoards();
    }
    
    getBoards() {
        BoardActions.loadBoards(this.state.userId)
    }

    loadBoards() {
        var boards = BoardStore.getBoards();
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
        this.setState({boards : boards});
    }
    
    showShareBoard(event) {
        this.setState({isShowShareBoard: true, sharedBoardId : event.target.name})
    }

    deleteBoard(event) {
        BoardActions.deleteBoard(event.target.name)
    }

    render() {
        return (
            <section id="BoardOverview" className="section">
                <div className="container">
                    <h1 className="title">Boards Overview</h1>
                    <div className="level">
                        <div className="level-left">
                            <div className="level-item has-text-centered">
                                <AddNewBoardButton isPrimary="true" userId={this.state.userId}></AddNewBoardButton>
                            </div>
                            <div className="level-item has-text-centered">
                                <JoinSection></JoinSection>
                            </div>
                        </div>
                    </div>
                    
                    <div className="container">
                        <div className="tile is-ancestor is-vertical">
                        {
                            this.state.boards.owned && this.state.boards.owned.map((board) => {
                                return (
                                    <div key={board.id} className="tile is-parent">
                                         <article className="tile is-child notification is-info">
                                         <div className="level">
                                                <div className="level-left">
                                                    <div className="level-item">
                                                        <Link to={"/boards/"+board.id}>
                                                            <span className="icon">
                                                                <i className="fas fa-user"></i>
                                                            </span>
                                                            {board.title}
                                                        </Link>
                                                        </div>
                                                </div>
                                                <div className="level-right">
                                                    <div className="level-item">
                                                        <button className="button is-outlined" name={board.id} onClick={this.showShareBoard}>
                                                            <span className="icon">
                                                                <i name={board.id} className="fas fa-share"></i>
                                                            </span>
                                                        </button>
                                                    </div>
                                                    <div className="level-item">
                                                        <button className="button is-outlined" name={board.id} onClick={this.deleteBoard}>
                                                            <span className="icon">
                                                                <i name={board.id} className="fas fa-trash"></i>
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    </div>
                                );
                            })
                        }
                        {
                            this.state.boards.edited && this.state.boards.edited.map((board) => {
                                return (
                                    <div key={board.id} className="tile is-parent">
                                         <article className="tile is-child notification is-success">
                                            <div className="level">
                                                <div className="level-left">
                                                    <div className="level-item">
                                                        <Link to={"/boards/"+board.id}>
                                                            <span class="icon">
                                                                <i class="fas fa-pen"></i>
                                                            </span>
                                                            {board.title}
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </article>
                                    </div>
                                );
                            })
                        }
                        </div>
                    </div>

                </div>
                
                {
                    this.state.isShowShareBoard && (
                        <div className="modal is-active">
                            <div className="modal-background"></div>
                            <div className="modal-content">
                                <div className="box">
                                    <article className="content">
                                        <p className="has-text-centered">Copy the URL below and send it to the members you wish to collaborate!</p>
                                        <div className="level">
                                            <div className="level-item">
                                                <span className="has-text-centered has-text-weight-bold">{window.location.href}board/{this.state.sharedBoardId}</span>
                                            </div>
                                            <a className="level-item" aria-label="reply" href={
`mailto:?subject=Join a retrospective!&body=Hi,%0D%0A%0D%0Aplease join the retrospective I've created on `+window.location.href+"board/"+this.state.sharedBoardId+` .%0D%0A%0D%0ASee you!`}>
                                                <span className="icon">
                                                    <i className="fas fa-envelope" aria-hidden="true"></i>
                                                </span>
                                            </a>
                                        </div>
                                    </article>
                                    
                                    <div className="level">
                                        <div className="level-item">
                                            <button className="button is-primary" onClick={()=>this.setState({isShowShareBoard: false})}>OK</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button className="modal-close is-large" aria-label="close" onClick={()=>this.setState({isShowShareBoard: false})}></button>
                        </div>
                    )
                }
            </section>
        );
    }
    
}

export default withCookies(BoardOverview);