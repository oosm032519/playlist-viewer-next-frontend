import {Track} from '../types/track';

export const prepareAudioFeaturesData = (
    audioFeatures: Track['audioFeatures'] | undefined
) => {
    if (!audioFeatures) {
        return [];
    }
    return [
        {feature: 'Danceability', value: audioFeatures.danceability},
        {feature: 'Energy', value: audioFeatures.energy},
        {feature: 'Speechiness', value: audioFeatures.speechiness},
        {feature: 'Acousticness', value: audioFeatures.acousticness},
        {feature: 'Liveness', value: audioFeatures.liveness},
        {feature: 'Valence', value: audioFeatures.valence},
    ];
};
