use confy::{self, ConfyError};
use serde::{Deserialize, Serialize};

#[derive(Default, Debug, Serialize, Deserialize)]
pub struct Config {
    pub language: String,
}

pub fn get_config() -> Result<Config, ConfyError> {
    confy::load("wcat", "wcat")
}

pub fn set_language_to_config(lang: String) -> Result<(), ConfyError> {
    let mut existing = get_config()?;
    existing.language = lang;
    confy::store("wcat", "wcat", existing)
}
