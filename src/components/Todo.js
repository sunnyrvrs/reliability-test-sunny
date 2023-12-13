import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import filter from '../images/filter.png'
import companyLogo from '../images/reliability_logo.png';
import plusIcon from '../images/plus.png';
import deleteIcon from "../images/remove.png";
import editIcon from "../images/edit.png";
import prioritizeIcon from "../images/prioritize.png";

function Todo() {

    const [currentDate, setCurrentDate] = useState('');
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        const now = new Date();
        const formattedDate = format(now, "EEEE, MMMM do");
        setCurrentDate(formattedDate);
        // Fetch todos from the API
        fetchTodos();
    }, [todos]);

    function capitalize(str) {
        if (!str) return str;
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const openPriority = (event) => {
        event.target.parentNode.children[4].style.display = "flex";
    }

    const cancelPriority = (event) => {
        event.target.parentNode.parentNode.children[4].style.display = "none";
    }

    const openEdit = (event) => {
        event.target.parentNode.children[2].style.display = "block";
    }

    const cancelEdit = (event) => {
        event.target.parentNode.style.display = "none";
    }

    const createTodo = async (event) => {

        const data = {
            "description": event.target.parentNode.parentNode.children[0].value,
            "priority": "medium"
        };
        
        event.target.parentNode.parentNode.children[0].value = "";

        try {
            const response = await fetch('http://localhost:3000/todos/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log('New todo created:', result);
        } catch (error) {
            console.error('Error creating new todo:', error);
        }
    };
    
    const updateTodo = async (event) => {
        event.preventDefault(); // Prevent default action if needed
        
        let priority;
        let description;

        const id = event.target.parentNode.parentNode.children[0].value;
        const oldPriority = event.target.parentNode.parentNode.parentNode.children[1].textContent.toLowerCase();
        const newPriority = event.target.parentNode.parentNode.children[4].children[0].value;
        const oldDescription = event.target.parentNode.parentNode.parentNode.children[0].textContent;
        const newDescription = event.target.parentNode.parentNode.children[2].children[0].value;

        if (newDescription !== "") {
            description = newDescription;
        } else {
            description = oldDescription;
        }

        if (newPriority === "") {
            priority = oldPriority;
        } else {
            priority = newPriority;
        }

        const data = {
            "description": description,
            "priority": priority,
        };

        try {
            const response = await fetch(`http://localhost:3000/todos/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Result from the backend:', result);
            
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const fetchTodos = async () => {
        try {
            const response = await fetch('http://localhost:3000/todos/');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTodos(data); // Update the todos state with fetched data

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const deleteTodo = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/todos/${id}`, {
                method: 'DELETE'
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            // Assuming your API returns the deleted todo's id
            const deletedTodoId = await response.json(); 
    
            // Update the local state to remove the deleted todo
            setTodos(prevTodos => prevTodos.filter(todo => todo.id !== deletedTodoId));
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    return (
        <div className="todo__container">
            <div className="header__container">
                <div className="header__date">
                    <div className="header__date--title">
                        <img src={companyLogo} alt="reliability logo" className=""/>
                        <h1>Todo App</h1>
                    </div>
                    <p>{currentDate}</p>
                </div>
            </div>
            <div className="body__container">
                <div className="body__top">

                {todos.map((task) => (
                    <div className="task__container">
                        <p>{task["description"]}</p>
                        <p>{capitalize(task["priority"])}</p>
                        <input value={task["isActive"]} className="task__active"/>
                        <div className="task__right">
                            <input value={task["_id"]} className="task__id"/>
                            <img src={editIcon} onClick={openEdit} className="task__editIcon"/>
                            <div className="task__editWindow">
                                <input/>
                                <button onClick={updateTodo}>Save</button>
                                <button onClick={cancelEdit}>Cancel</button>
                            </div>
                            <img onClick={openPriority} className="task__prioritizeIcon" src={prioritizeIcon} alt="Prioritize icon"/>
                            <div className="priority-dropdown-container">
                                <select 
                                    className="task__select"
                                    name="priority-dropdown"
                                    id="priority-dropdown"
                                >
                                    <option className="task__select--option" value="">Select Priority</option>
                                    <option className="task__select--option" value="low">Low</option>
                                    <option className="task__select--option" value="medium">Medium</option>
                                    <option className="task__select--option" value="high">High</option>
                                    <option className="task__select--option" value="critical">Critical</option>
                                </select>
                                <button onClick={updateTodo}>Save</button>
                                <button onClick={cancelPriority}>Cancel</button>
                            </div>
                            <img onClick={() => deleteTodo(task["_id"])} className="task__deleteIcon" src={deleteIcon} alt="Delete icon"/>
                        </div>
                    </div>
                ))}
                    
                </div>
                <div className="body__bottom">
                    <div className="body__bottom--container">
                        <input className="body__bottom--input"/>
                        <div className="body__bottom--plusicon">
                            <img onClick={createTodo} src={plusIcon} alt="Add button"/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Todo