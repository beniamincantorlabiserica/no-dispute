
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pine-plus.pockethost.io');


export async function vote(subjectId, ideaId, userKey, vote) {
    try {
      console.log(`Voting on idea: ${ideaId} with vote ${vote}`);
  
      // Prepare the vote data
      
  
      let existingVote;
      try {
        existingVote = await pb.collection('votes').getFirstListItem(`ideaId="${ideaId}" && userKey="${userKey}"`);
      } catch (error) {
        if (error.status === 404) {
          // No existing vote found, which is fine
          existingVote = null;
        } else {
          // If it's not a 404 error, rethrow it
          throw error;
        }
      }
  
      if (existingVote) {
        const voteData = {
            ideaId: ideaId,
            userKey: userKey,
            vote: vote + existingVote.vote
          };
        // Update existing vote
        await pb.collection('votes').update(existingVote.id, voteData);
        console.log(`Updated vote for idea: ${ideaId}`);
      } else {
        const voteData = {
            ideaId: ideaId,
            userKey: userKey,
            vote: vote
          };
        // Create new vote
        await pb.collection('votes').create(voteData);
        console.log(`Created new vote for idea: ${ideaId}`);
      }
  
      // Update the total votes on the idea
        try {
            const record = await pb.collection('subjects').getOne(subjectId);
            console.log(`Voting on idea: ${ideaId}`);
            let ideas = record.ideas;
            let idea = ideas.find(idea => idea.id === ideaId);
            
            idea.votes += vote;

            const data = {
                ideas: JSON.stringify(ideas)
            };
            await pb.collection('subjects').update(subjectId, data);
            console.log(`Voted on idea: ${ideaId}`);
        } catch (error) {
            console.error('Failed to vote on idea:', error);
            return null;
        }
  
      return true;
    } catch (error) {
      console.error('Failed to vote on idea:', error);
      return null;
    }
  }