// ref: https://github.com/Djazouli/LoLGameClientAPI/blob/master/src/api.rs

use tauri_plugin_http::reqwest::{Certificate, Client, ClientBuilder, Error};

use crate::models::{
    champion::{ChampionData, ChampionSummaryData},
    current_game::{AllGameData, CurrentGameData, PlayerData, Team, Teams},
};

#[cold]
pub fn get_riot_root_certificate() -> Certificate {
    Certificate::from_pem(include_bytes!("riotgames.pem")).unwrap()
}

pub struct ApiClient {
    client: Client,
    champions: Option<Vec<ChampionSummaryData>>,
}

impl Default for ApiClient {
    fn default() -> Self {
        Self::new()
    }
}

impl ApiClient {
    pub fn new() -> Self {
        return ApiClient {
            client: ClientBuilder::new()
                .add_root_certificate(get_riot_root_certificate())
                .build()
                .unwrap(),
            champions: None,
        };
    }

    pub async fn initialize(&mut self) -> Result<(), Error> {
        let data = self.client.get("https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json").send().await?.json::<Vec<ChampionSummaryData>>().await?;
        self.champions = Some(data);
        Ok(())
    }

    pub async fn get_current_game(&self) -> Result<AllGameData, Error> {
        let data = self
            .client
            .get("https://127.0.0.1:2999/liveclientdata/allgamedata")
            .send()
            .await?
            .json::<AllGameData>()
            .await?;
        Ok(data)
    }

    pub async fn get_champion_info(
        &self,
        champion_key: &i32,
        lang: &str,
    ) -> Result<ChampionData, Error> {
        let data = self
            .client
            .get(format!("https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/{}/v1/champions/{}.json", lang, champion_key))
            .send()
            .await?
            .json::<ChampionData>()
            .await?;
        Ok(data)
    }

    pub async fn format_game_data(&self, data: AllGameData) -> Result<CurrentGameData, String> {
        if let Some(ref champions) = self.champions {
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

                let champion_key_result = champions.iter().find(|&c| c.alias == champion_id);

                if let Some(champion_key_obj) = champion_key_result {
                    let champion_key = champion_key_obj.id;
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
                } else {
                    println!("Champion not found.");
                    continue;
                }
            }

            let formatted_data = CurrentGameData {
                my_riot_id,
                teams: Teams { blue, red },
            };

            Ok(formatted_data)
        } else {
            Err(format!("Champions data not found"))
        }
    }
}
