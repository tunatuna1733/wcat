use crate::models::current_game::{AllGameData, CurrentGameData, PlayerData, Team, Teams};

pub fn format_game_data(data: AllGameData) -> CurrentGameData {
    let my_riot_id = data.active_player.riot_id;
    let mut blue = Vec::<PlayerData>::new();
    let mut red = Vec::<PlayerData>::new();
    for player in data.all_players.iter() {
        let riot_id = player.riot_id.clone();
        let position = player.position.clone();
        let champion_id = if player.raw_champion_name == "Character_Seraphine_Name" {
            "Seraphine".to_string()
        } else {
            player
                .raw_champion_name
                .replace("game_character_displayname_", "")
        };
        let champion_name = player.champion_name.clone();

        let data = PlayerData {
            riot_id,
            position,
            champion_id,
            champion_name,
        };

        match player.team {
            Team::Order => blue.push(data),
            Team::Chaos => red.push(data),
        }
    }

    let formatted_data = CurrentGameData {
        my_riot_id,
        teams: Teams { blue, red },
    };

    formatted_data
}
