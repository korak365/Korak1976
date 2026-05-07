import { Actor } from 'apify';
import axios from 'axios';

// Initialize the Actor process
await Actor.init();

const {
    repositories = [],
    token = '',
    topContributors = 10,
} = (await Actor.getInput()) ?? {};

if (!token) {
    throw new Error('A valid GitHub token is required to access the API.');
}

const results = [];

for (const repoUrl of repositories) {
    console.log(`Processing repository: ${repoUrl}`);
    const repoMatch = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
    if (!repoMatch) {
        console.error(`Invalid repository URL: ${repoUrl}`);
        continue;
    }
    const [_, owner, repo] = repoMatch;

    try {
        // Fetch contributors
        const contributorsUrl = `https://api.github.com/repos/${owner}/${repo}/contributors`;
        const { data: contributors } = await axios.get(contributorsUrl, {
            headers: { Authorization: `token ${token}` },
        });

        console.log(`Found ${contributors.length} contributors for ${repoUrl}`);

        // Filter top contributors
        const top = contributors.slice(0, topContributors).map(async (contributor) => {
            const { login, contributions, html_url, id } = contributor;

            // Scrape detailed profile page (if needed)
            let profileInfo = {};
            try {
                const { data: user } = await axios.get(contributor.url, {
                    headers: { Authorization: `token ${token}` },
                });
                profileInfo = {
                    name: user.name,
                    company: user.company,
                    location: user.location,
                    bio: user.bio,
                    public_repos: user.public_repos,
                    followers: user.followers,
                };
            } catch (err) {
                console.error(`Failed to fetch profile for ${login}`);
            }

            // Add contributor to results
            return {
                login,
                id,
                contributions,
                profile: profileInfo,
                html_url,
            };
        });

        results.push({
            repository: `${owner}/${repo}`,
            contributors: await Promise.all(top),
        });
    } catch (err) {
        console.error(`Failed to process repository: ${repoUrl}`, err.message);
    }
}

// Save results to the default dataset
console.log(`Saving ${results.length} repositories to dataset.`);
await Actor.pushData(results);

await Actor.exit();