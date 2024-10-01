export async function loadFunds() {
    const likedFunds = JSON.parse(localStorage.getItem('likedFunds')) || [];
    console.log("likedFunds : " + likedFunds);

    const fetchPromises = likedFunds.map(prdNo => 
        fetch(`http://localhost:9000/finance/fund/get?prdNo=${prdNo}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch fund data for prdNo: ${prdNo}`);
                }
                return response.json();
            })
    );

    try {
        const funds = await Promise.all(fetchPromises);
        return funds;
    } catch (error) {
        console.error('Error fetching fund data:', error);
        return [];
    }
}
