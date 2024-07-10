import React, { useState } from 'react';

const AddCandidate = ({ addCandidate }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addCandidate(name);
        setName('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Candidate Name</label>
                <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter candidate name"
                />
            </div>
            <button type="submit" className="btn btn-primary">Add Candidate</button>
        </form>
    );
};

export default AddCandidate;
