import React from "react"

export function Cell(props) {
    const cellStyle = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: props.isInitial ? "#FF0015" : "#007bff",
        fontWeight: '800',
        fontSize: "22px",
        width: "40px",
        height: "40px",
        backgroundColor: props.isSelected ? "#AAA" : "#DDD",
        margin: "2px",
        userSelect: "none"
    };

    return (
        <div 
            style={cellStyle} 
            onClick={() => props.handleSelection(props.row_index, props.column_index)}
        >
            {props.value}
        </div>
    );
}