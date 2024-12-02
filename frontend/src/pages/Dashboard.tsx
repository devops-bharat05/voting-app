import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { polls as pollsApi } from '../services/api';

interface Poll {
  _id: string;
  title: string;
  description: string;
  options: Array<{
    text: string;
    votes: number;
  }>;
  endDate: string;
  isActive: boolean;
}

export default function Dashboard() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserPolls = async () => {
      try {
        const { data } = await pollsApi.getUserPolls();
        setPolls(data);
      } catch (err) {
        setError('Failed to load your polls');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPolls();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Polls</h1>
        <Link
          to="/create-poll"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Create New Poll
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        {polls.map((poll) => (
          <div
            key={poll._id}
            className="bg-white p-6 rounded-lg shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-semibold mb-2">
                  <Link to={`/poll/${poll._id}`} className="hover:text-blue-600">
                    {poll.title}
                  </Link>
                </h2>
                <p className="text-gray-600">{poll.description}</p>
              </div>
              <span
                className={`px-2 py-1 rounded text-sm ${
                  poll.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {poll.isActive ? 'Active' : 'Ended'}
              </span>
            </div>

            <div className="space-y-2">
              {poll.options.map((option, index) => (
                <div key={index} className="flex justify-between text-sm text-gray-600">
                  <span>{option.text}</span>
                  <span>{option.votes} votes</span>
                </div>
              ))}
            </div>

            <div className="mt-4 text-sm text-gray-600">
              <p>
                Ends: {new Date(poll.endDate).toLocaleDateString()} at{' '}
                {new Date(poll.endDate).toLocaleTimeString()}
              </p>
              <p>
                Total votes:{' '}
                {poll.options.reduce((sum, option) => sum + option.votes, 0)}
              </p>
            </div>
          </div>
        ))}

        {polls.length === 0 && (
          <div className="text-center text-gray-600">
            <p>You haven't created any polls yet.</p>
            <Link to="/create-poll" className="text-blue-500 hover:text-blue-600">
              Create your first poll
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}