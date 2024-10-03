import PocketBase from 'pocketbase';

const pb = new PocketBase('https://pine-plus.pockethost.io');

export async function createSubject(title) {
  console.log("TITLE: " + title)
  try {
    const data = {
      title: title,
      ideas: JSON.stringify([])
    };
    const record = await pb.collection('subjects').create(data);
    console.log(`Created subject: ${record.id}`);
    return { id: record.id, title: record.title, ideas: [] };
  } catch (error) {
    console.error('Failed to create subject:', error);
    return null;
  }
}

export async function getSubject(id) {
  try {
    const record = await pb.collection('subjects').getOne(id);
    console.log(`Retrieved subject: ${id}`);
    return {
      id: record.id,
      title: record.title
    };
  } catch (error) {
    console.error(`Subject not found: ${id}`, error);
    return null;
  }
}

export async function getAllIdeas(subjectId) {
  try {
    const record = await pb.collection('subjects').getOne(subjectId);
    console.log(`Retrieved ideas for subject: ${subjectId}`);
    if (!record.ideas) {
      return [];
    }
    return record.ideas;
  } catch (error) {
    console.error(`Failed to retrieve ideas: ${subjectId}`, error);
    return null;
  }
}

export async function addIdea(subjectId, ideaContent, id) {
  try {
   
      const newIdea = {
        id: id,
        content: ideaContent,
        votes: 0
      };

      let ideas = await getAllIdeas(subjectId);
      ideas.push(newIdea);

      const data = {
        ideas: JSON.stringify(ideas)
      };
      await pb.collection('subjects').update(subjectId, data);
      console.log(`Added idea to subject: ${subjectId}`);
      return true;
  } catch (error) {
    console.error('Failed to add idea:', error);
    return null;
  }
}

export async function vote(subjectId, ideaId, voteType) {
  try {
    const subject = await getAllIdeas(subjectId);
    if (subject) {
      const ideaIndex = subject.findIndex(idea => idea.id === ideaId);
      if (ideaIndex !== -1) {
        subject[ideaIndex].votes += voteType === 'up' ? 1 : -1;
        const data = {
          ideas: JSON.stringify(subject)
        };
        await pb.collection('subjects').update(subjectId, data);
        console.log(`Updated votes for idea in subject: ${subjectId}`);
        return subjectId;
      }
      console.log(`Idea not found: ${ideaId}`);
    } else {
      console.log(`Subject not found: ${subjectId}`);
    }
    return null;
  } catch (error) {
    console.error('Failed to update vote:', error);
    return null;
  }
}



export async function cleanupAllSubjects() {
  try {
    const records = await pb.collection('subjects').getFullList();
    for (const record of records) {
      const subject = {
        id: record.id,
        title: record.title,
        ideas: JSON.parse(record.ideas)
      };
      const cleanedSubject = cleanupSubjectData(subject);
      await pb.collection('subjects').update(record.id, {
        ideas: JSON.stringify(cleanedSubject.ideas)
      });
      console.log(`Cleaned up subject: ${record.id}`);
    }
  } catch (error) {
    console.error('Failed to cleanup subjects:', error);
  }
}

function cleanupSubjectData(subject) {
  subject.ideas = subject.ideas.map(idea => {
    if (typeof idea.content === 'object' && idea.content.ideas) {
      // If the content is nested, flatten it
      return {
        id: idea.id || generateUniqueId(),
        content: idea.content.ideas[0]?.content || "Empty idea",
        votes: idea.votes || 0
      };
    }
    return {
      id: idea.id || generateUniqueId(),
      content: idea.content,
      votes: idea.votes || 0
    };
  });
  return subject;
}