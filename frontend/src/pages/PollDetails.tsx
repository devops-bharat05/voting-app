import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { polls as pollsApi } from '../services/api';
import { io } from 'socket.io-client';

interface PollOption {
  _id: string;
  text: string;
  votes: number;
}

interface Poll {
  _id: string;
  title: string;
  description: string;
  options: PollOption[];
  createdBy: {
    name: string;
  };
  endDate: string;
  isActive: boolean;
}

export default function PollDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [error, setError] = useState('');
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    const socket = io('http://localhost:3002');
    
    const fetchPoll = async () => {
      try {
        const { data } = await pollsApi.getById(id!);
        setPoll(data);
      } catch (err) {
        setError('Failed to load poll');
      }
    };

    fetchPoll();

    socket.on('pollUpdate', (updatedPoll) => {
      if (updatedPoll._id === id) {
        setPoll(updatedPoll);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const handleVote = async () => {
    if (!selectedOption || !user) return;

    try {
      const { data } = await pollsApi.vote(id!, selectedOption);
      setPoll(data);
      setHasVoted(true);
    } catch (err) {
      setError('Failed to submit vote');
    }
  };

  if (!poll) return <div>Loading...</div>;

  const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{poll.title}</h1>
      <p className="text-gray-600 mb-6">{poll.description}</p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="space-y-4">
          {poll.options.map((option) => (
            <div key={option._id} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-3">
                  {!hasVoted && user && (
                    <input
                      type="radio"
                      name="poll-option"
                      value={option._id}
                      checked={selectedOption === option._id}
                      onChange={(e) => setSelectedOption(e.target.value)}
                      className="h-4 w-4 text-blue-600"
                    />
                  )}
                  <span>{option.text}</span>
                </label>
                <span className="text-gray-600">
                  {totalVotes > 0
                    ? `${Math.round((option.votes / totalVotes) * 100)}%`
                    : '0%'}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 rounded-full h-2"
                  style={{
                    width: `${totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {user && !hasVoted && (
          <button
            onClick={handleVote}
            disabled={!selectedOption}
            className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
          >
            Submit Vote
          </button>
        )}

        {!user && (
          <p className="mt-6 text-center text-gray-600">
            Please log in to vote in this poll.
          </p>
        )}

        <div className="mt-6 text-sm text-gray-600">
          <p>Created by: {poll.createdBy.name}</p>
          <p>
            Ends: {new Date(poll.endDate).toLocaleDateString()} at{' '}
            {new Date(poll.endDate).toLocaleTimeString()}
          </p>
          <p>Total votes: {totalVotes}</p>
        </div>
      </div>
    </div>
  );
}