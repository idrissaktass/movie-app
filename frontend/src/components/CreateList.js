import React, { useState, useEffect } from 'react';
import { createListService, addMovieToListService, getUserListsService } from '../services/AuthService'; // Import your service functions

const CreateList = ({ selectedMovie, onClose }) => {
    const [listName, setListName] = useState('');
    const [isPublic, setIsPublic] = useState(false);
    const [lists, setLists] = useState([]); // State to hold lists
    const [selectedList, setSelectedList] = useState(null); // State to hold selected list for adding movies

    // Fetch existing lists when the component mounts
    useEffect(() => {
        const fetchLists = async () => {
            const email = localStorage.getItem("email");
            try {
                const response = await getUserListsService(email);
                setLists(response.lists); // Assuming response has a `lists` array
            } catch (error) {
                console.error('Failed to fetch lists:', error);
            }
        };

        fetchLists();
    }, []);

    const handleCreateList = async (e) => {
        e.preventDefault();
        const email = localStorage.getItem("email");
        
        try {
            const response = await createListService(email, listName, isPublic);
            alert(response.message); // Show success message
            setLists((prevLists) => [...prevLists, { name: listName, isPublic }]); // Add new list
            setListName(''); // Reset the input field
        } catch (error) {
            alert(`Failed to create list: ${error.message}`);
        }
    };

    const handleAddMovie = async (listName) => {
        try {
            const email = localStorage.getItem("email");
            console.log("create",email, listName, selectedMovie.id)
            const response = await addMovieToListService(email, listName, selectedMovie.id); // Add selected movie to the selected list
            alert(response.message); // Show success message
        } catch (error) {
            alert(`Failed to add movie: ${error.message}`);
        }
    };

    return (
        <div>
            {/* Create List Form */}
            <form onSubmit={handleCreateList}>
                <input
                    type="text"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    placeholder="Enter list name"
                    required
                />
                <label>
                    <input
                        type="checkbox"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                    />
                    Public
                </label>
                <button type="submit">Create List</button>
            </form>

            {/* Existing Lists */}
            <div>
                <h2>Your Lists</h2>
                <ul>
                    {lists.map((list, index) => (
                        <li key={index} onClick={() => setSelectedList(list.name)}>
                            {list.name}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Add Selected Movie to Selected List */}
            {selectedList && selectedMovie && (
                <div>
                    <h3>Add Movie to {selectedList}</h3>
                    <p>Selected Movie: {selectedMovie.title}</p> {/* Display movie title */}
                    <button onClick={() => handleAddMovie(selectedList)}>Add Movie</button>
                </div>
            )}
        </div>
    );
};

export default CreateList;
