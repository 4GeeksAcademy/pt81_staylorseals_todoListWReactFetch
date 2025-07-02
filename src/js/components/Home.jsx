import React, { useState, useEffect } from "react";
import { use } from "react";

const API_URL = "https://playground.4geeks.com/todo";

const Home = () => {

	const [todo, setTodo] = useState([]);
	const [inputValue, setInputValue] = useState("")
	const [loading, setLoading] = useState(true);


	useEffect(() => {
		fetch(API_URL + "/users/sierrenataylor-seals")
			.then(response => response.json())
			.then(data => {
				setTodo(data.todos || []);
				setLoading(false);
			})
			.catch(error => {
				console.error("Error fetching todos:", error);
				setLoading(false);
			});
	}, []);

	const addTodo = () => {
		if (inputValue.trim() === "") return;
		 
		const newTodo = { label: inputValue, done: false };
        fetch(API_URL + "/todos/sierrenataylor-seals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newTodo)
        })
            .then(res => res.json())
            .then(data => {
                setTodo(prev => [...prev, data]);
                setInputValue("");
            })
            .catch(err => console.error("Error adding todo:", err));
	};

	const deleteTodo = (id) => {
    fetch(`${API_URL}/todos/sierrenataylor-seals/${id}`, {
        method: "DELETE"
    })
        .then(res => {
            if (res.ok) {
                setTodo(prev => prev.filter(item => item.id !== id));
            }
        })
        .catch(err => console.error("Error deleting todo:", err));
	};

	const handleInputChange = (e) => {
		setInputValue(e.target.value);
	};

	const handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			addTodo();
		}
	};


	const deleteAllTodos = () => {
    fetch(API_URL, {
        method: "DELETE"
    })
        .then(response => {
            if (response.ok) {
                setTodo([]);
            } else {
                console.error("Failed to delete all todos");
            }
        })
        .catch(error => console.error("Error deleting all todos:", error));
};

		return (
			<div className="text-center">
				<div className="todo-container">
					<h1 className="text-center mt-5">To-Do List</h1>
					<div>
						<input 
							type="text" 
							placeholder="What else is on the agenda?"
							value={inputValue}
							onChange={handleInputChange}
							onKeyDown={handleKeyDown}
						/>
						<button type="button" onClick={addTodo}>
							Add
						</button>
						<button type="button" onClick={deleteAllTodos} style={{marginLeft: "10px"}}>
                    		Delete Everything
                		</button>
					</div>

					<ul>
						{loading ? (
        <li>Loading...</li>
    ) : todo.length === 0 ? (
        <li className="empty-list">
            No tasks; Maybe rest?
        </li>
    ) : (
        todo.map((item) => (
            <li key={item.id} className="todo-item">
                {item.label}
                <button
                    className="delete-button"
                    onClick={() => deleteTodo(item.id)}>
                    Delete
                </button>
            </li>
							))
						)}
					</ul>
				</div>
			</div>
		);
};

export default Home;