import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchGitHubData, fetchRecommendations, fetchRecommendationsByJobTitle } from './utils';
import { Helmet } from "react-helmet";

function App() {
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const { user, isAuthenticated, loginWithPopup, logout } = useAuth0();
  const [languages, setLanguages] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<Record<any, any>[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const getUserLanguageSkills = async () => {
      const languages: string[] | undefined = await fetchGitHubData();
      if (languages && languages.length > 0) setLanguages(languages)
    }

    if (isAuthenticated) getUserLanguageSkills()
  }, [isAuthenticated]);

  const getRecs = async () => {
    const rec = await fetchRecommendations(languages);
    setRecommendations(rec);
  }

  useEffect(() => {
    if (languages.length > 0) getRecs();
  }, [languages]);


  const handleLogin = () => {
    loginWithPopup();
  };

  // const handleLogout = () => {
  //   logout();
  // };

  const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = async () => {
    const res = await fetchRecommendationsByJobTitle(searchTerm, languages);
    setRecommendations(res);
  };

  const handleClearSearch = async () => {
    if (languages.length > 0) getRecs();
  };

  const handleScrollToContent = (index: number) => {
    setActiveIndex(index);
    contentRefs.current[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    const scrollTop = document.getElementById('content')?.scrollTop || 0;
    contentRefs.current.forEach((ref, index) => {
      if (ref && ref.offsetTop <= scrollTop + 400) {
        setActiveIndex(index);
      }
    });
  };

  return (
    <div className="App">
      <Helmet>
        <meta httpEquiv="Content-Security-Policy"
          content="script-src 'self' 'unsafe-eval'; style-src 'self' fonts.googleapis.com;" />
      </Helmet>
      <>
        {isAuthenticated ? (
          <>
            <input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
              placeholder="Search..."
              style={{ marginRight: '8px' }} // Simple styling
            />
            <button onClick={handleSearch}>Search</button>
            <button onClick={handleClearSearch}>Clear Search</button>
            <p>hello {user?.nickname}</p>
            <h6>Your skills</h6>
            {languages.map(language => (
              <span key={language}>{language}, </span>
            ))}
            <div className="app">
              <div className="index">
                {recommendations.map((rec, idx) => (
                  <div className="menu-item" onClick={() => handleScrollToContent(idx)}>
                    <button
                      key={idx}
                      className={`menu ${activeIndex === idx ? 'menu-active' : ''}`}
                    >
                      {idx + 1}
                    </button>
                    <span className='menu-title'>{rec.title}</span>
                  </div>
                ))}
              </div>
              <div
                id="content"
                className="content"
                onScroll={handleScroll}
              >
                {recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    ref={(el) => (contentRefs.current[idx] = el)}
                    className="content-item"
                  >
                    <table border={1} cellPadding={5} cellSpacing={0}>
                      <tr>
                        <th></th>
                        <th>Job Title</th>
                        <th>Recommended Languages</th>
                        <th>Recommended Platforms</th>
                        <th>Recommended Databases</th>
                        <th>Recommended Webframeworks</th>
                      </tr>
                      <tr>
                        <td style={{ wordWrap: 'break-word' }}>{idx + 1}</td>
                        <td style={{ wordWrap: 'break-word' }}>{rec.title}</td>
                        <td style={{ wordWrap: 'break-word' }}>{rec.recommendation.map((rec: Record<any, any>) => (<span><a href={rec.url}>{rec.lang}</a> </span>))}</td>
                        <td style={{ wordWrap: 'break-word' }}>{rec.suggestions.platforms.map((i: string) => (<span>{i} </span>))}</td>
                        <td style={{ wordWrap: 'break-word' }}>{rec.suggestions.databases.map((i: string) => (<span>{i} </span>))}</td>
                        <td style={{ wordWrap: 'break-word' }}>{rec.suggestions.webframes.map((i: string) => (<span>{i} </span>))}</td>
                      </tr>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            <button onClick={handleLogin}>Login</button>
          </>
        )}
      </>
    </div >
  );
}

export default App;
