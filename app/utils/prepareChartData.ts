// app/utils/prepareChartData.ts
interface GenreChartData {
    name: string;
    value: number;
    total: number;
}

const prepareChartData = (
    genreCounts: { [genre: string]: number },
    total: number
): GenreChartData[] => {
    const sortedGenres = Object.entries(genreCounts).sort(
        (a, b) => b[1] - a[1]
    );
    
    if (sortedGenres.length > 9) {
        const topGenres = sortedGenres.slice(0, 9);
        const otherGenres = sortedGenres.slice(9);
        const otherCount = otherGenres.reduce((sum, genre) => sum + genre[1], 0);
        
        return [
            ...topGenres.map(([name, value]) => ({name, value, total})),
            {name: 'その他', value: otherCount, total},
        ];
    } else {
        return sortedGenres.map(([name, value]) => ({name, value, total}));
    }
};

export default prepareChartData;
