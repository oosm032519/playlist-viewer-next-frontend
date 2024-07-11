// app/utils/prepareChartData.ts

/**
 * ジャンルごとのデータを表すインターフェース
 */
interface GenreChartData {
    name: string;
    value: number;
    total: number;
}

/**
 * ジャンルごとのカウントデータを受け取り、チャート表示用のデータを準備する関数
 *
 * @param {Object} genreCounts - ジャンルごとのカウントデータ
 * @param {number} total - 全体の合計数
 * @returns {GenreChartData[]} - チャート表示用のデータ配列
 */
const prepareChartData = (
    genreCounts: { [genre: string]: number },
    total: number
): GenreChartData[] => {
    // ジャンルごとのカウントデータを降順にソート
    const sortedGenres = Object.entries(genreCounts).sort(
        (a, b) => b[1] - a[1]
    );
    
    // ジャンルが10個以上の場合、上位9個とその他をまとめる
    if (sortedGenres.length > 9) {
        const topGenres = sortedGenres.slice(0, 9); // 上位9個のジャンル
        const otherGenres = sortedGenres.slice(9); // それ以外のジャンル
        const otherCount = otherGenres.reduce((sum, genre) => sum + genre[1], 0); // その他のジャンルの合計
        
        // 上位9個のジャンルとその他をまとめたデータを返す
        return [
            ...topGenres.map(([name, value]) => ({name, value, total})),
            {name: 'その他', value: otherCount, total},
        ];
    } else {
        // ジャンルが10個未満の場合、そのままデータを返す
        return sortedGenres.map(([name, value]) => ({name, value, total}));
    }
};

export default prepareChartData;
