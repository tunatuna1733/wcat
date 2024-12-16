use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ChampionSummaryData {
    pub id: i32,
    pub alias: String,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct RawChampionData {
    pub id: i32,
    pub name: String,
    pub alias: String,
    pub square_portrait_path: String,
    pub passive: RawPassive,
    pub spells: Vec<RawSpell>,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct RawSpell {
    pub spell_key: String,
    pub name: String,
    pub ability_icon_path: String,
    pub ability_video_path: String,
    pub cost: String,
    pub cooldown: String, // parse needed
    pub description: String,
    pub dynamic_description: String,
    pub cost_coefficients: Vec<f32>,
    pub cooldown_coefficients: Vec<f32>,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct RawPassive {
    pub name: String,
    pub ability_icon_path: String,
    pub ability_video_path: String,
    pub description: String,
}
