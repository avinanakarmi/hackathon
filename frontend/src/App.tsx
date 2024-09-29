import React, { useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchGitHubData, fetchRecommendations, fetchRecommendationsByJobTitle } from './utils';
import JobRec from './JobRec';
import "@fontsource/dancing-script";

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

  const handleLogout = () => {
    logout();
  };

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
      <video autoPlay loop muted className="video-background">
        <source src="/file.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="app-content">
        {isAuthenticated ? (
          <>
            <div className="header">
              <div className="flex-container">
                <img
                  alt="Logo"
                  className="logo"
                  src="https://static.wixstatic.com/media/0b340f_de6cc65b79f24ea8bdb74935b222dfbf~mv2.png/v1/crop/x_0,y_1,w_766,h_766/fill/w_150,h_150,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/0b340f_de6cc65b79f24ea8bdb74935b222dfbf~mv2.png"
                />
                <div className="text-container">
                  <span style={{ fontWeight: 800, fontSize: '40px', fontFamily: "Dancing Script" }}>Disco-ver your role</span> <br />
                  <span>Keep on Dancing</span>
                </div>
              </div>
              <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'right', gap: '10px'}}>
                <div className="search-container">
                  <input type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    className="search-input"
                    placeholder="Search..."
                  />
                  <button className="search-button" onClick={handleSearch}>Search</button>
                  <button className="search-button" onClick={handleClearSearch}>Clear</button>
                  <FontAwesomeIcon onClick={handleLogout} icon={faClose} size='3x' color='#4c3571' style={{ marginLeft: '5px' }} />
                </div>
                <a style={{ color: '#1D191F', textAlign: 'right', marginRight: '32px' }} href={`https://github.com/${user?.nickname}`}>Hello {user?.nickname}!</a>
              </div>
            </div>
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
                    <JobRec idx={idx} rec={rec} />
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ height: '100vh', display: 'flex', justifyContent: 'center' }}>
            <button className="search-button" style={{ margin: 'auto' }} onClick={handleLogin}>Login</button>
          </div>
        )}
      </div>
    </div >
  );
}

export default App;
