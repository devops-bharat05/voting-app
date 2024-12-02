import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../store';
import { setPolls } from '../store/slices/pollSlice';
import { polls as pollsApi } from '../services/api';

export default function Home() {
  const dispatch = useDispatch();
  const { polls, isLoading } = useSelector((state: RootState) => state.polls);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const { data } = await pollsApi.getAll();
        dispatch(setPolls(data));
      } catch (error) {
        console.error('Error fetching polls:', error);
      }
    };

    fetchPolls();
  }, [dispatch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Active Polls</h1>
      <div className="grid gap-6">
        {polls.map((poll) => (
          <Link
            key={poll.id}
            to={`/poll/${poll.id}`}
            className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{poll.title}</h2>
            <div className="flex justify-between text-gray-600">
              <span>Options: {poll.options.length}</span>
              <span>Total Votes: {poll.options.reduce((acc, opt) => acc + opt.votes, 0)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}