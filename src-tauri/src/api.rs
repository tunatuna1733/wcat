// ref: https://github.com/Djazouli/LoLGameClientAPI/blob/master/src/api.rs

use tauri_plugin_http::reqwest::{Certificate, Client, ClientBuilder};

use crate::{
    error::{ApplicationError, FormatError, QueryError},
    models::{
        champion::{ChampionSummaryData, RawChampionData},
        current_game::{
            AllGameData, ChampionData, CurrentGameData, Passive, PlayerData, Spell, Team, Teams,
        },
    },
};

#[cold]
pub fn get_riot_root_certificate() -> Certificate {
    Certificate::from_pem(include_bytes!("riotgames.pem")).unwrap()
}

pub struct ApiClient {
    client: Client,
    champions: Option<Vec<ChampionSummaryData>>,
    pub languages: Option<Vec<String>>,
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
            languages: None,
        };
    }

    pub async fn initialize(&mut self) -> Result<(), QueryError> {
        let champion_data = match self.client.get("https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json").send().await {
            Ok(res) => match res.json::<Vec<ChampionSummaryData>>().await {
                Ok(r) => r,
                Err(err) => return Err(QueryError {
                    status: err.status().map(|s| s.as_u16()),
                    message: Some("Failed to parse champion summary data into json.".to_string()),
                    url: err.url().map(|u| u.to_string())
                })
            },
            Err(err) => return Err(QueryError {
                status: err.status().map(|s| s.as_u16()),
                message: Some("Failed to fetch champion summary data.".to_string()),
                url: err.url().map(|u| u.to_string())
            })
        };
        self.champions = Some(champion_data);
        let language_data = match self
            .client
            .get("https://ddragon.leagueoflegends.com/cdn/languages.json")
            .send()
            .await
        {
            Ok(res) => match res.json::<Vec<String>>().await {
                Ok(r) => r,
                Err(err) => {
                    return Err(QueryError {
                        status: err.status().map(|s| s.as_u16()),
                        message: Some("Failed to parse language data into json.".to_string()),
                        url: err.url().map(|u| u.to_string()),
                    })
                }
            },
            Err(err) => {
                return Err(QueryError {
                    status: err.status().map(|s| s.as_u16()),
                    message: Some("Failed to fetch language data.".to_string()),
                    url: err.url().map(|u| u.to_string()),
                })
            }
        };
        self.languages = Some(language_data);
        Ok(())
    }

    pub async fn get_current_game(&self, lang: &str) -> Result<CurrentGameData, ApplicationError> {
        let data = match self
            .client
            .get("https://127.0.0.1:2999/liveclientdata/allgamedata")
            .send()
            .await
        {
            Ok(res) => match res.json::<AllGameData>().await {
                Ok(r) => r,
                Err(err) => {
                    return Err(QueryError {
                        status: err.status().map(|s| s.as_u16()),
                        message: Some("Failed to parse current game data into json.".to_string()),
                        url: err.url().map(|u| u.to_string()),
                    }
                    .into())
                }
            },
            Err(err) => {
                return Err(QueryError {
                    status: err.status().map(|s| s.as_u16()),
                    message: Some("Failed to fetch current game data.".to_string()),
                    url: err.url().map(|u| u.to_string()),
                }
                .into())
            }
        };
        let formatted_data = self.format_game_data(data, lang).await?;
        Ok(formatted_data)
    }

    pub async fn get_champion_info(
        &self,
        champion_key: &i32,
        lang: &str,
    ) -> Result<RawChampionData, QueryError> {
        let language = if lang == "" || lang == "en_US" {
            "default"
        } else {
            &lang.to_lowercase()
        };
        let data = match self.client.get(format!("https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/{}/v1/champions/{}.json", language, champion_key)).send().await {
            Ok(res) => match res.json::<RawChampionData>().await {
                Ok(r) => r,
                Err(err) => {
                    println!("{:?}", err);
                    return Err(QueryError {
                    status: err.status().map(|s| s.as_u16()),
                    message: Some("Failed to parse champion data into json.".to_string()),
                    url: err.url().map(|u| u.to_string())
                })}
            },
            Err(err) => return Err(QueryError {
                status: err.status().map(|s| s.as_u16()),
                message: Some("Failed to fetch champion data.".to_string()),
                url: err.url().map(|u| u.to_string())
            })
        };
        Ok(data)
    }

    pub fn format_champion_data(data: &RawChampionData) -> ChampionData {
        let spells: Vec<Spell> = data
            .spells
            .iter()
            .map(|s| Spell {
                name: s.name.clone(),
                spell_key: s.spell_key.clone(),
                icon_img: format!(
                    "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default{}",
                    s.ability_icon_path.replace("/lol-game-data/assets", "").to_lowercase()
                ),
                video_url: format!(
                    "https://d28xe8vt774jo5.cloudfront.net/{}",
                    s.ability_video_path
                ),
                description: s.description.clone(),
                dynamic_description: s.dynamic_description.clone(),
                costs: s.cost_coefficients.clone(),
                cooldowns: s.cooldown_coefficients.clone(),
            })
            .collect();
        let passive = Passive {
            name: data.passive.name.clone(),
            icon_img: format!(
                "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default{}",
                data.passive.ability_icon_path.replace("/lol-game-data/assets", "").to_lowercase()
            ),
            video_url: format!(
                "https://d28xe8vt774jo5.cloudfront.net/{}",
                data.passive.ability_video_path
            ),
            description: data.passive.description.clone(),
        };
        let champion_data = ChampionData {
            id: data.alias.clone(),
            key: data.id.clone(),
            name: data.name.clone(),
            portrait_img: format!(
                "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default{}",
                data.square_portrait_path.replace("/lol-game-data/assets", "").to_lowercase()
            ),
            passive,
            spells,
        };
        champion_data
    }

    pub async fn format_game_data(
        &self,
        data: AllGameData,
        lang: &str,
    ) -> Result<CurrentGameData, ApplicationError> {
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
                    let raw_champion_data = match self.get_champion_info(&champion_key, lang).await
                    {
                        Ok(r) => r,
                        Err(err) => return Err(err.into()),
                    };
                    let champion_data = ApiClient::format_champion_data(&raw_champion_data);
                    let data = PlayerData {
                        riot_id,
                        position,
                        champion_id,
                        champion_name,
                        champion_data,
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
            Err(FormatError {
                message: Some("Champion summary data are not fetched.".to_string()),
            }
            .into())
        }
    }
}
