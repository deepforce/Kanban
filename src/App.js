import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import FileUpload from "./components/FileUpload";


// const itemsFromBackend = [
//   { id: uuid(), name: "Zack" },
//   { id: uuid(), name: "Bob" },
// ];




const onDragEnd = (result, columns, setColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });

    // Update status
    const destStatus = destColumn.name;
    const removedId = removed.id;
    const statusUpdateData = new FormData();
    statusUpdateData.append('status', destStatus);
    const url = "http://127.0.0.1:8000/candidates/" + removedId + "/";
    fetch(url, {
      method: 'PATCH',
      body: statusUpdateData
    })
  } else {
    const column = columns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setColumns({
      ...columns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const columnsFromBackend = {
    [uuid()]: {
      name: "Applied",
      items: [],
    },
    [uuid()]: {
      name: "Phone Screen",
      items: [],
    },
    [uuid()]: {
      name: "On site",
      items: [],
    },
    [uuid()]: {
      name: "Offered",
      items: [],
    },
    [uuid()]: {
      name: "Accepted",
      items: [],
    },
    [uuid()]: {
      name: "Rejected",
      items: [],
    },
  };
  const [columns, setColumns] = useState(columnsFromBackend);

  function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key].name === value);
  }
  
  function updateColumnByStatus(res) {
    const updateId = getKeyByValue(columns, res.status)
    const column = columns[updateId];
    column['items'].push(res);
    setColumns({
      ...columns,
      [updateId]: {
        ...column,
        items: column['items'],
      }
    });
  }

  useEffect(() => {
    fetch("http://localhost:8000/candidates/")
      .then(res => res.json())
      .then(
        async (result) => {
          setIsLoaded(true);
          for (const res of result) {
            await updateColumnByStatus(res);
          }
          
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      )
  }, [])


  return (
    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
      >
        {
        Object.entries(columns).map(([columnId, column]) => {
          return (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              key={columnId}
            >
              <h2>{column.name}</h2>
              <div style={{ margin: 8 }}>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "lightblue"
                            : "lightgrey",
                          padding: 4,
                          width: 300,
                          minHeight: 800,
                        }}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                let resume;
                                if (item.resume === null) {
                                  resume = <FileUpload itemId={item.id}/>
                                } else {
                                  resume = <a href={item.resume}>Resume</a>
                                }

                                return (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={{
                                      userSelect: "none",
                                      padding: 16,
                                      margin: "0 0 8px 0",
                                      minHeight: "50px",
                                      backgroundColor: snapshot.isDragging
                                        ? "#263B4A"
                                        : "#456C86",
                                      color: "white",
                                      ...provided.draggableProps.style,
                                    }}
                                  >
                                    <p>Name: {item.name}</p>
                                    <p>Education: {item.education}</p>
                                    <p>Contact: {item.contact}</p>
                                    {resume}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default App;
