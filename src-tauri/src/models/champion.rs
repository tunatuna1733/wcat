use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ChampionSummaryData {
    pub id: i32,
    pub alias: String,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ChampionData {
    id: i32,
    name: String,
    square_portrait_path: String,
    passive: Passive,
    spells: Vec<Spell>,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Spell {
    spell_key: String,
    name: String,
    ability_icon_path: String,
    ability_video_path: String,
    cost: String,
    cooldown: String, // parse needed
    description: String,
    cost_coefficients: Vec<i32>,
    cooldown_coefficients: Vec<i32>,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Passive {
    name: String,
    ability_icon_path: String,
    ability_video_path: String,
    description: String,
}
