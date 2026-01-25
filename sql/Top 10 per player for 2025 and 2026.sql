USE PokerLeague;


-- show top 10 as a total figure per player for 2025 + 2026
-- configure this as 2026 only and Top 10
-- export this as csv to C:\Users\Ciaran Lynch\Desktop\Poker\Poker League 2026 called "Top 10 per player for 2025 and 2026"

-- 
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
        YEAR(g.Game_Date) IN (2025, 2026)
),
Top4 AS (
    SELECT
        Player_No,
        Player_Name,
        CashOut
    FROM RankedPerformances
    WHERE PerformanceRank <= 10
),
GamesPlayed AS (
    SELECT
        p.Player_No,
        COUNT(DISTINCT s.Game_ID) AS TotalGames
    FROM 
        Player_Game_Stats s
    JOIN 
        Game_Number g ON g.Game_ID = s.Game_ID
    JOIN 
        Players p ON p.Player_No = s.Player_No
    WHERE 
        YEAR(g.Game_Date) IN (2025, 2026)
    GROUP BY 
        p.Player_No
)
SELECT
    t.Player_No,
    t.Player_Name,
    SUM(t.CashOut) AS Top10Total,
    g.TotalGames
FROM Top4 t
JOIN GamesPlayed g ON g.Player_No = t.Player_No
GROUP BY
    t.Player_No,
    t.Player_Name,
    g.TotalGames
ORDER BY
    Top10Total DESC;