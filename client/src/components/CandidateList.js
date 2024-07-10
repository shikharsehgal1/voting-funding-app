import React from 'react';

const CandidateList = ({ candidates, vote, fundCandidate }) => {
    return (
        <ul className="list-group">
            {candidates.map((candidate, index) => (
                <li key={index} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                        <span>{candidate.name} - {candidate.votes} votes - {candidate.funds} INR</span>
                        <div>
                            <button onClick={() => vote(index)} className="btn btn-success btn-sm">Vote</button>
                            <button onClick={() => fundCandidate(index, '0.01')} className="btn btn-primary btn-sm ml-2">Fund</button>
                        </div>
                    </div>
                </li>
            ))}
        </ul>
    );
};

export default CandidateList;
