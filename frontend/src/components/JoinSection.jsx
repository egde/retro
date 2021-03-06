import React, { Component } from 'react';
import {
    withRouter
  } from 'react-router-dom';

class JoinSection extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            boardId : null
        }

        this.handleChange = this.handleChange.bind(this);
        this.joinBoard = this.joinBoard.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        var state= this.state;
        state[name] = value;
        this.setState(state);
    }

    joinBoard() {
        if (this.state.boardId) {
            this.props.history.push('/boards/'+this.state.boardId)
        }
    }

    render() {
        let classNameC = "control";
        if (this.props.isFullwidth) {
            classNameC += " is-expanded"
        }
        let classNameBtn = "button"
        if (this.props.isPrimary) {
            classNameBtn += " is-primary"
        } else {
            classNameBtn += " is-info"
        }
        return(
            <div id="JoinSection" className="field has-addons">
                <div className={classNameC}>
                    <input className="input" type="text" placeholder="Join a retro" value={this.state.boardId} name="boardId" onChange={this.handleChange}/>
                </div>
                <div className="control">
                    <button className={classNameBtn} onClick={this.joinBoard}>
                    Join
                    </button>
                </div>
            </div>
        )
    }
}

export default withRouter(JoinSection);