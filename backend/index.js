import express from "express";
import cors from "cors";
import connect from './db_conn.js';
import { resources } from "./learnRes.js";

const PORT = 8080;
const app = express();

// const fetchUserSkills = async () => {
//   const url = 'https://linkedin-api8.p.rapidapi.com/?username=adamselipsky';
//     const options = {
//         method: 'GET',
//         headers: {
//             'x-rapidapi-key': '94179f1475msh1fcc4d780bb4c8ep136cf7jsndc95c13531cb',
//             'x-rapidapi-host': 'linkedin-api8.p.rapidapi.com'
//         }
//     };

//     try {
//         const response = await fetch(url, options)
//         const record = await response.json()
//         const userSkills = record.skills.map(skill => skill.name);
//         return userSkills;
//    } catch (error) {return []}
// };

// const fetchOnDemandSkills = async () => {
//   const url = 'https://jsearch.p.rapidapi.com/job-details?job_id=7oKm_SkxjLxpFtVuAAAAAA%3D%3D&extended_publisher_details=false';
//     const options = {
//         method: 'GET',
//         headers: {
//             'x-rapidapi-key': '04c6038535msh2be44d05f71f09cp16c8a9jsnf6a497ac79e9',
//             'x-rapidapi-host': 'jsearch.p.rapidapi.com'
//         }
//     };

//     try {
//         const response = await fetch(url, options)
//         const record = await response.json()
//         console.log('record', record)
//    } catch (error) {console.error(error)}
// };

let db;
connect()
  .then((database) => {
    db = database;
    console.log("Database connection established.");
  })
  .catch((err) => {
    console.error("Failed to connect to the database.", err);
    process.exit(1); // Exit if connection fails
  });

app.use(cors());
app.use(express.json());

app.get('/', async (req, res) => {
  // const userSkills = await fetchUserSkills();
  // const userSkills = [
  //   'Entrepreneurship',       'Product Marketing',
  //   'Business Strategy',      'Mergers & Acquisitions',
  //   'Management',             'Marketing Strategy',
  //   'SaaS',                   'Business Development',
  //   'Product Management',     'Management Consulting',
  //   'Program Management',     'Marketing',
  //   'Cloud Computing',        'Go-to-market Strategy',
  //   'Sales',                  'Leadership',
  //   'Start-ups',              'Strategy',
  //   'Strategic Partnerships'
  // ];
  
  // fetchOnDemandSkills();





  const languages = req.query.userLangs ? req.query.userLangs.split(',') : [];
  const title = req.query.title;
  try {
    if (!db) throw new Error("Database not initialized");

    const collection = db.collection("job");
    let query = {};
    if(title) {
      query = { "Languages": { $in: languages },  "_id": { $regex: title, $options: 'i' }}
    } else {
      query = { "Languages": { $in: languages } }
    }
    const results = await collection.find(query).toArray();
    const matchMag = [];
    
    for (const result of results) {
      const commonLanguages = result.Languages.filter(language => languages.includes(language));
      const recommendedLanguages = result.Languages.filter(language => !languages.includes(language));
      const recommendation = recommendedLanguages.map(language => {
        return { lang: language, url: resources[language] };
      });
      matchMag.push({
        title: result._id,
        matchPercent: commonLanguages.length/result.Languages.length,
        recommendation: recommendation,
        matchedSkills: commonLanguages,
        suggestions: {
          platforms: result.Platforms,
          webframes: result.Webframes,
          databases: result.Databases
        }
      })
    }
    matchMag.sort((a, b) => b.matchPercent - a.matchPercent);
    const top10 = [];
    const topN = Math.min(matchMag.length, 10)
    for (let i = 0; i < topN; i++) {
      top10.push(matchMag[i]);
    }
    res.json(top10);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).send("Error fetching data");
  }


});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
