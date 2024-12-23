use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
pub struct CurrentGameData {
    pub my_riot_id: String,
    pub teams: Teams,
}
#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
pub enum Lane {
    #[serde(rename = "TOP")]
    Top,
    #[serde(rename = "JUNGLE")]
    Jungle,
    #[serde(rename = "MIDDLE")]
    Middle,
    #[serde(rename = "BOTTOM")]
    Bottom,
    #[serde(rename = "UTILITY")]
    Utility,
    #[serde(rename = "")]
    None,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ChampionData {
    pub id: String,
    pub key: i32,
    pub name: String,
    pub portrait_img: String,
    pub passive: Passive,
    pub spells: Vec<Spell>,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Passive {
    pub name: String,
    pub icon_img: String,
    pub video_url: String,
    pub description: String,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Spell {
    pub spell_key: String,
    pub name: String,
    pub icon_img: String,
    pub video_url: String,
    pub costs: Vec<f32>,
    pub cooldowns: Vec<f32>,
    pub description: String,
    pub dynamic_description: String,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct PlayerData {
    pub riot_id: String,
    pub position: Lane,
    pub champion_id: String,
    pub champion_name: String,
    pub champion_data: ChampionData,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
pub struct Teams {
    pub blue: Vec<PlayerData>,
    pub red: Vec<PlayerData>,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct AllGameData {
    pub active_player: ActivePlayer,
    pub all_players: Vec<Player>,
    pub game_data: GameData,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ActivePlayer {
    pub abilities: Abilities,
    pub champion_stats: ChampionStats,
    pub current_gold: f64,
    pub full_runes: FullRunes,
    pub level: usize,
    pub summoner_name: String,
    pub riot_id: String,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Player {
    pub champion_name: String,
    pub is_bot: bool,
    pub is_dead: bool,
    pub items: Vec<Item>,
    pub level: usize,
    pub position: Lane, // Enum ?
    pub raw_champion_name: String,
    pub respawn_timer: f64,
    pub runes: PartialRunes,
    pub scores: Scores,
    #[serde(rename = "skinID")]
    pub skin_id: usize,
    pub summoner_name: String,
    pub summoner_spells: SummonerSpells,
    pub team: Team,
    pub riot_id: String,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Item {}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Scores {
    pub assists: usize,
    pub creep_score: usize,
    pub deaths: usize,
    pub kills: usize,
    pub ward_score: f64,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct SummonerSpells {
    pub summoner_spell_one: SummonerSpell,
    pub summoner_spell_two: SummonerSpell,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct SummonerSpell {
    pub display_name: String,
    pub raw_description: String,
    pub raw_display_name: String,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
pub enum Team {
    #[serde(rename = "ORDER")]
    Order,
    #[serde(rename = "CHAOS")]
    Chaos,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Abilities {
    #[serde(rename = "E")]
    pub e: Ability,
    #[serde(rename = "Passive")]
    pub passive: Ability,
    #[serde(rename = "Q")]
    pub q: Ability,
    #[serde(rename = "R")]
    pub r: Ability,
    #[serde(rename = "W")]
    pub w: Ability,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Ability {
    pub ability_level: Option<u8>, // May not have a level (on passive for example)
    pub display_name: String,
    pub id: String,
    pub raw_description: String,
    pub raw_display_name: String,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct ChampionStats {
    pub ability_power: f64, // May not have a level (on passive for example)
    pub armor: f64,
    pub armor_penetration_flat: f64,
    pub attack_damage: f64,
    pub attack_range: f64,
    pub attack_speed: f64,
    pub bonus_armor_penetration_percent: f64,
    pub bonus_magic_penetration_percent: f64,
    pub crit_chance: f64,
    pub crit_damage: f64,
    pub current_health: f64,
    pub heal_shield_power: Option<f64>, // Optional because not in docs, but appears to be here anyway
    pub health_regen_rate: f64,
    pub life_steal: f64,
    pub magic_lethality: f64,
    pub magic_penetration_flat: f64,
    pub magic_penetration_percent: f64,
    pub magic_resist: f64,
    pub max_health: f64,
    pub move_speed: f64,
    pub omnivamp: Option<f64>, // Optional because not in docs, but appears to be here anyway
    pub physical_lethality: f64,
    pub physical_vamp: Option<f64>, // Optional because not in docs, but appears to be here anyway
    pub resource_max: f64,
    pub resource_regen_rate: f64,
    pub resource_type: String, // Could be an enum I guess
    pub resource_value: f64,
    pub spell_vamp: f64,
    pub tenacity: f64,
}

/// Runes for the active player
#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct FullRunes {
    pub general_runes: Vec<Rune>,
    pub keystone: Rune,
    pub primary_rune_tree: RuneTree,
    pub secondary_rune_tree: RuneTree,
    pub stat_runes: [StatRunes; 3],
}

/// Runes for all the other players
#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct PartialRunes {
    pub keystone: Rune,
    pub primary_rune_tree: RuneTree,
    pub secondary_rune_tree: RuneTree,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct Rune {
    pub display_name: String,
    pub id: u16,
    pub raw_description: String,
    pub raw_display_name: String,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct RuneTree {
    pub display_name: String,
    pub id: u16,
    pub raw_description: String,
    pub raw_display_name: String,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct StatRunes {
    pub id: u16,
    pub raw_description: String,
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
#[serde(rename_all = "camelCase")]
pub struct GameData {
    pub game_mode: GameMode,
    pub game_time: f64,
    pub map_name: String,
    pub map_number: usize,
    pub map_terrain: String, // enum ?
}

#[derive(Deserialize, Serialize, Debug, Clone, PartialEq)]
pub enum GameMode {
    #[serde(rename = "CLASSIC")]
    Classic,
    #[serde(rename = "ARAM")]
    Aram,
    #[serde(rename = "PRACTICETOOL")]
    Practicetool,
    #[serde(rename = "CHERRY")]
    Arena,
}
