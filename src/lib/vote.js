
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pine-plus.pockethost.io');


export async function vote(subjectId, ideaId, voteType) {

    // updated the database to reflect the vote
    try {
        const record = await pb.collection('subjects').getOne(subjectId);
        console.log(`Voting on idea: ${ideaId}`);
        let ideas = record.ideas;
        let idea = ideas.find(idea => idea.id === ideaId);
        
        if (voteType === 'up') {
            idea.votes++;
        } else if (voteType === 'down') {
            idea.votes--;
        }

        const data = {
            ideas: JSON.stringify(ideas)
        };
        await pb.collection('subjects').update(subjectId, data);
        console.log(`Voted on idea: ${ideaId}`);
    } catch (error) {
        console.error('Failed to vote on idea:', error);
        return null;
    }
}