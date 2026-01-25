USE PokerLeague;


-- Select top 10 performances per player for 2026
-- Showing as a list of 10 for each player
WITH RankedPerformances AS (
    SELECT
        p.Player_No,
        p.Player_Name,
        g.Game_Date,
        s.Game_ID,
        s.CashOut,
        ROW_NUMBER() OVER (
            PARTITION BY p.Player_No
            ORDER BY s.CashOut DESC
        ) AS PerformanceRank
    FROM 
        Player_Game_Stats s
    JOIN 
        Players p ON p.Player_No = s.Player_No
    JOIN 
        Game_Number g ON g.Game_ID = s.Game_ID
    WHERE 
        YEAR(g.Game_Date) IN (2026)
)
SELECT
    Player_No,
    Player_Name,
    Game_Date,
    Game_ID,
    CashOut
FROM RankedPerformances
WHERE PerformanceRank <= 10
ORDER BY Player_No, PerformanceRank;
