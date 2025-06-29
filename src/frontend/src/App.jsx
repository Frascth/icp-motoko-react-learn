import { useEffect, useState } from 'react';
import { backend } from 'declarations/backend';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [voteLoading, setVoteLoading] = useState(null);
  const [votes, setVotes] = useState({});

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const response = await backend.resetVotes();

        setVotes(response);
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    };

    fetchVotes();
  }, []);

  async function handleVote(category) {
    setVoteLoading(category);

    const response = await backend.vote(category);

    setVotes(response);

    setVoteLoading(null);
  }

  if (isLoading) {
    return (
      <div>Loading...</div>
    );
  }

  const voteDiv = votes.map(vote => {
    const category = vote[0];

    const count = vote[1].toString();

    const voteButton = category === voteLoading ? (
      <button className='px-4 py-2 rounded border border-black' disabled>
        Voting...
      </button>
    ) : (
      <button className='px-4 py-2 rounded border border-black' onClick={() => handleVote(category)}>
        Vote
      </button>
    );

    return (
      <div className='flex justify-between gap-4' key={category}>
        <p>{category}: {count}</p>
        {voteButton}
      </div>
    );
  });

  return (
    <main>
      <div className='w-1/4 border border-black rounded px-4 py-2'>
        {voteDiv}
      </div>
    </main>
  );
}

export default App;
