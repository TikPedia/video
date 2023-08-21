import { Composition, staticFile } from 'remotion';
import { AudioGramSchema, AudiogramComposition, fps } from './Composition';
import './style.css';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="Audiogram"
				component={AudiogramComposition}
				fps={fps}
				width={1080}
				height={1080}
				schema={AudioGramSchema}
				defaultProps={{
					// Audio settings
					audioOffsetInSeconds: 6.9,

					// Title settings
					audioFileName: staticFile('audio.mp3'),
					coverImgFileName: staticFile('cover.jpg'),
					titleColor: 'rgba(186, 186, 186, 0.93)',

					// Subtitles settings
					subtitlesFileName: staticFile('sub.srt'),
					onlyDisplayCurrentSentence: true,
					subtitlesTextColor: 'rgba(255, 255, 255, 0.93)',
					subtitlesLinePerPage: 1,
					subtitlesZoomMeasurerSize: 10,
					subtitlesLineHeight: 98,

					// Wave settings
					durationInSeconds: 30,
				}}
				// Determine the length of the video based on the duration of the audio file
				calculateMetadata={({ props }) => {
					return {
						durationInFrames: props.durationInSeconds * fps,
						props,
					};
				}}
			/>
		</>
	);
};
