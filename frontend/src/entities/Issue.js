import v4 from 'uuid/v4'

class IssueEntity {
    constructor(){
        this.id = v4();
        this.dbId = null;
        this.text = "";
        this.state = "";
        this.boardId = "";
    }
}


export default IssueEntity;
