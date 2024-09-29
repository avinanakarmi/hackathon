import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faDatabase } from '@fortawesome/free-solid-svg-icons';
import PlatformIcon from './Platform';
import WebFrameIcon from './Webframe';

interface RecDetailProps {
	title: string;
	content: any;
	linked: boolean;
	left: boolean;
}

const RecDetail = ({ title, content, linked, left }: RecDetailProps) => {
	const outerContainerStyle = {
		backgroundColor: '#5E4182',
		borderRadius: '25px',
		padding: '15px',
		width: '500px',
		alignSelf: left ? 'flex-start' : 'flex-end',
	};

	const getIcon = () => {
		switch (title) {
			case "Recommended languages":
				return <FontAwesomeIcon icon={faCode} size='2x' color='#FD6262' />;
			case "Recommended databases":
				return <FontAwesomeIcon icon={faDatabase} size='2x' color='#FD6262' />;
			case "Recommended webframes":
				return <WebFrameIcon />
			case "Recommended platforms":
				return <PlatformIcon />;
			default:
				return <></>;
		}
	}

	return (
		<div style={outerContainerStyle}>
			<div style={{ display: 'inline-flex', alignItems: 'center', }}>
				{getIcon()}
				<h3 style={{ color: "#CCA7F3", textAlign: 'left', marginLeft: '10px' }}>{title}</h3>
			</div>
			<div style={{marginTop: '-10px'}}>
				{
					<p style={{ textAlign: 'left', fontSize: '14px' }}>{
						linked
							? content.map((rec: Record<any, any>) => (<span><a style={{ color: 'white' }} href={rec.url}>{rec.lang}</a> </span>))
							: content.map((i: string) => (<span>{i} </span>))
					}</p>
				}
			</div>
		</div>
	);
}

export default RecDetail;