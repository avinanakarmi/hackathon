export const fetchGitHubData = async () => {
	const response = await fetch("https://api.github.com/user/repos", {
		headers: {
			Authorization: `token ${process.env.REACT_APP_GH_TOKEN}`
		}
	});

	const projects = await response.json();
	if (projects.length > 0) {
		const l: string[] = [];
		for (const project of projects) {
			const response = await fetch(project.languages_url, {
				headers: {
					Authorization: `token ${process.env.REACT_APP_GH_TOKEN}`
				}
			});
			const languages = await response.json();
			l.push(...Object.keys(languages))
		}
		const s = Array.from(new Set(l))
		return s;
	}
};

const fetchCall = async (url: string) => {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	const data = await response.json();
	return data;
};

export const fetchRecommendations = async (langSkills: string[]) => {
	const userLangs = langSkills.join(",");
	const url = `http://localhost:8080/?userLangs=${encodeURIComponent(userLangs)}`;
	const data = await fetchCall(url);
	return data;
};

export const fetchRecommendationsByJobTitle = async (title: string, langSkills: string[]) => {
	const userLangs = langSkills.join(",");
	const url = `http://localhost:8080/?title=${title}&userLangs=${encodeURIComponent(userLangs)}`;
	const data = await fetchCall(url);
	return data;
};