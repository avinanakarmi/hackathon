import './JobRec.css';
import RecDetail from './RecDetail';

interface JobRecProps {
	idx: number,
	rec: Record<any, any>;
};

const JobRec = ({ idx, rec }: JobRecProps) => {
	return (
		<>
			<div className="grid-container">
				<div className="left-column">
					<h2 style={{color: '#CCA7F3'}}>{rec.title}</h2>
					<p style={{color: '#CCA7F3'}} className='percent'>{(rec.matchPercent * 100).toFixed(1)}%</p>
				</div>
				<div className="right-column">
					<RecDetail left={true} linked={true} title='Recommended languages' content={rec.recommendation} />
					<RecDetail left={false} linked={false} title='Recommended platforms' content={rec.suggestions.platforms} />
					<RecDetail left={true} linked={false} title='Recommended databases' content={rec.suggestions.databases} />
					<RecDetail left={false} linked={false} title='Recommended webframes' content={rec.suggestions.webframes} />
				</div>
			</div>
		</>
	);
};

export default JobRec;