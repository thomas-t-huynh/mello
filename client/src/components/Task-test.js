import React from "react";

export default class Task extends React.Component {
    state = {
        isDragging: false,
    
        originalX: 0,
        originalY: 0,
    
        translateX: 0,
        translateY: 0,
    
        lastTranslateX: 0,
        lastTranslateY: 0
    };
    
    componentWillUnmount() {
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);
    }

    handleMouseDown = ({ clientX, clientY }) => {
        window.addEventListener('mousemove', this.handleMouseMove);
        window.addEventListener('mouseup', this.handleMouseUp);

        this.setState({
            originalX: clientX,
            originalY: clientY,
            isDragging: true
        });
    };

    onDragStart = (e, id) => {
      e.dataTransfer.setData("id", id);
    };
    
    handleMouseMove = ({ clientX, clientY }) => {
        const { isDragging } = this.state;
        const { onDrag } = this.props;

        if (!isDragging) {
            return;
        }

        this.setState(prevState => ({
            translateX: clientX - prevState.originalX + prevState.lastTranslateX,
            translateY: clientY - prevState.originalY + prevState.lastTranslateY
        }))
        // console.log(this.state.originalX, this.state.originalY)
        // console.log(this.state.translateX, this.state.translateY)
        
    };

    handleMouseUp = () => {
        window.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('mouseup', this.handleMouseUp);

        this.setState(
            {
            originalX: 0,
            originalY: 0,
            lastTranslateX: this.state.translateX,
            lastTranslateY: this.state.translateY,

            isDragging: false
            }
        );
    };

    render() {
        const { description, id, onTaskDrop } = this.props;
        return (
          <div
            className="task-div"
            onDragEnd={e => onTaskDrop()}
            onMouseDown={this.handleMouseDown}
            style={{
              transform: `translate(${this.state.translateX}px, ${this.state.translateY}px)`
            }}
          >
            <p>{description}</p>
          </div>
        );
    }
}