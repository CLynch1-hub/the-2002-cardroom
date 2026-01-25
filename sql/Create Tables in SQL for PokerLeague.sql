USE PokerLeague;
GO

------------------------------------------------------------
-- DROP TABLES IN CORRECT ORDER (child → parent)
------------------------------------------------------------
DROP TABLE IF EXISTS Player_Game_Stats;
DROP TABLE IF EXISTS Game_Number;
DROP TABLE IF EXISTS Players;
DROP TABLE IF EXISTS Structure;
GO



------------------------------------------------------------
-- PLAYERS TABLE
------------------------------------------------------------
CREATE TABLE Players (
    Player_No       INT IDENTITY(1,1) PRIMARY KEY,
    Player_Name     VARCHAR(50) NOT NULL
);
GO

------------------------------------------------------------
-- GAME NUMBER TABLE
------------------------------------------------------------
CREATE TABLE Game_Number (
    Game_ID          INT IDENTITY(1,1) PRIMARY KEY,
    Game_Date        DATE NOT NULL,
    Player_No_Host   INT  NOT NULL,
    
   

    CONSTRAINT FK_Players_Player_No
        FOREIGN KEY (Player_No_Host)
        REFERENCES Players( Player_No)
);
GO

------------------------------------------------------------
-- PLAYER GAME STATS TABLE
------------------------------------------------------------
CREATE TABLE Player_Game_Stats (
    Game_ID         INT NOT NULL,
    Player_No       INT NOT NULL,
    BuyIn           DECIMAL(10,2),
    Rebuy           DECIMAL(10,2),
    CashOut         DECIMAL(10,2),

    CONSTRAINT FK_Stats_Game
        FOREIGN KEY (Game_ID)
        REFERENCES Game_Number(Game_ID),

    CONSTRAINT FK_Stats_Player
        FOREIGN KEY (Player_No)
        REFERENCES Players(Player_No)
);
GO


-- create Stats_ID as a new PK, allowing flow with Access table
USE PokerLeague;
ALTER TABLE Player_Game_Stats
ADD Stats_ID INT IDENTITY(1,1);
ALTER TABLE Player_Game_Stats
ADD CONSTRAINT PK_PlayerGameStats PRIMARY KEY (Stats_ID);




USE PokerLeague;
EXEC sp_helpindex 'Player_Game_Stats';





