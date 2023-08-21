import { useAudioData, visualizeAudio } from '@remotion/media-utils';
import React, { useEffect, useRef, useState } from 'react';
import {
	AbsoluteFill,
	Audio,
	OffthreadVideo,
	continueRender,
	delayRender,
	Img,
	Video,
	Sequence,
	useCurrentFrame,
	useVideoConfig,
	staticFile,
} from 'remotion';

export const fps = 30;

import { PaginatedSubtitles } from './Subtitles';
import { z } from 'zod';
import { zColor } from '@remotion/zod-types';

export const AudioGramSchema = z.object({
	durationInSeconds: z.number().positive(),
	audioOffsetInSeconds: z.number().min(0),
	subtitlesFileName: z.string().refine((s) => s.endsWith('.srt'), {
		message: 'Subtitles file must be a .srt file',
	}),
	audioFileName: z.string().refine((s) => s.endsWith('.mp3'), {
		message: 'Subtitles file must be a .mp3 file',
	}),
	coverImgFileName: z
		.string()
		.refine(
			(s) =>
				s.endsWith('.jpg') ||
				s.endsWith('.jpeg') ||
				s.endsWith('.png') ||
				s.endsWith('.bmp'),
			{
				message: 'Subtitles file must be a .jpg / .jpeg / .png / .bmp file',
			}
		),
	titleText: z.string(),
	titleColor: zColor(),
	waveColor: zColor(),
	subtitlesTextColor: zColor(),
	subtitlesLinePerPage: z.number().int().min(0),
	subtitlesLineHeight: z.number().int().min(0),
	subtitlesZoomMeasurerSize: z.number().int().min(0),
	onlyDisplayCurrentSentence: z.boolean(),
	mirrorWave: z.boolean(),
	waveLinesToDisplay: z.number().int().min(0),
	waveFreqRangeStartIndex: z.number().int().min(0),
	waveNumberOfSamples: z.enum(['32', '64', '128', '256', '512']),
});

type AudiogramCompositionSchemaType = z.infer<typeof AudioGramSchema>;

export const AudiogramComposition: React.FC<AudiogramCompositionSchemaType> = ({
	subtitlesFileName,
	audioFileName,
	coverImgFileName,
	titleText,
	titleColor,
	subtitlesTextColor,
	subtitlesLinePerPage,
	waveColor,
	waveNumberOfSamples,
	waveFreqRangeStartIndex,
	waveLinesToDisplay,
	subtitlesZoomMeasurerSize,
	subtitlesLineHeight,
	onlyDisplayCurrentSentence,
	mirrorWave,
	audioOffsetInSeconds,
}) => {
	const { durationInFrames } = useVideoConfig();

	const [handle] = useState(() => delayRender());
	const [subtitles, setSubtitles] = useState<string | null>(null);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		fetch(subtitlesFileName)
			.then((res) => res.text())
			.then((text) => {
				setSubtitles(text);
				continueRender(handle);
			})
			.catch((err) => {
				console.log('Error fetching subtitles', err);
			});
	}, [handle, subtitlesFileName]);

	if (!subtitles) {
		return null;
	}

	const audioOffsetInFrames = Math.round(audioOffsetInSeconds * fps);

	return (
		<AbsoluteFill>
			<div className='row'>
				<OffthreadVideo src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
				style={{ height: 1080, width: 1920 }}/>
			</div>
			<AbsoluteFill>
				<Sequence from={-audioOffsetInFrames}>
					<div className="container"
						style={{
							fontFamily: 'IBM Plex Sans',
						}}
					>
						<div
							style={{ lineHeight: `${subtitlesLineHeight}px` }}
							className="captions"
						>
							<PaginatedSubtitles
								subtitles={subtitles}
								startFrame={audioOffsetInFrames}
								endFrame={audioOffsetInFrames + durationInFrames}
								linesPerPage={subtitlesLinePerPage}
								subtitlesTextColor={subtitlesTextColor}
								subtitlesZoomMeasurerSize={subtitlesZoomMeasurerSize}
								subtitlesLineHeight={subtitlesLineHeight}
								onlyDisplayCurrentSentence={onlyDisplayCurrentSentence}
							/>
						</div>
					</div>
				</Sequence>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
