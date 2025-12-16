macro VERSION = "0.0.1"
macro DEBUG = false

settings {
    "main": {
        "modeName": "安娜快跑",
        "description": f"八位参赛选手，只有一位可以胜出\n Version: {VERSION}"
    },
    "gamemodes": {
        "general": {
            "heroLimit": "off",
            "respawnTime%": 0,
            "scoreToWin": 50,
            
        },
        "ffa":{
            "enabledMaps" : ["workshopExpanse","workshopExpanseNight"]
        }
    },
    "heroes": {
        "allTeams": {
            "enabledHeroes" : ["ana"],
            "ana" : {
                "damageDealt%" : 10
            }
        }
    }
}