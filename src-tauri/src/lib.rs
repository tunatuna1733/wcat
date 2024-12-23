use api::ApiClient;
use config::{get_config, set_language_to_config};
use error::{ApplicationError, ConfigError, QueryError, SetLangError};
use models::current_game::{ChampionData, CurrentGameData};
use tauri::{async_runtime::Mutex, Manager, State};

mod api;
mod config;
mod error;
mod models;

#[derive(Default)]
struct AppState {
    api_client: ApiClient,
}

#[tauri::command]
async fn initialize(state: State<'_, Mutex<AppState>>) -> Result<(), QueryError> {
    let mut state = state.lock().await;
    state.api_client.initialize().await
}

#[tauri::command]
async fn get_game_state(
    state: State<'_, Mutex<AppState>>,
) -> Result<CurrentGameData, ApplicationError> {
    let state = state.lock().await;
    let lang = match get_config() {
        Ok(l) => l.language,
        Err(_) => {
            return Err(ApplicationError::Config(ConfigError {
                message: "Failed to get language from config file.".to_string(),
            }))
        }
    };
    state.api_client.get_current_game(&lang).await
}

#[tauri::command]
async fn get_champion(
    state: State<'_, Mutex<AppState>>,
    champion_key: i32,
) -> Result<ChampionData, QueryError> {
    let state = state.lock().await;
    let lang = match get_config() {
        Ok(c) => c.language,
        Err(_) => {
            return Err(QueryError {
                message: Some("Failed to get language.".to_string()),
                status: None,
                url: None,
            })
        }
    };
    let champion_data = state
        .api_client
        .get_champion_info(&champion_key, &lang)
        .await?;
    let formatted_champion_data = ApiClient::format_champion_data(&champion_data);
    Ok(formatted_champion_data)
}

#[tauri::command]
async fn set_language(state: State<'_, Mutex<AppState>>, lang: String) -> Result<(), SetLangError> {
    let state = state.lock().await;
    if let Some(ref languages) = state.api_client.languages {
        if !languages.contains(&lang) {
            return Err(SetLangError {
                message: "Language not found.".to_string(),
            });
        }
        match set_language_to_config(lang) {
            Ok(_) => Ok(()),
            Err(_) => Err(SetLangError {
                message: "Failed to set language to config.".to_string(),
            }),
        }
    } else {
        Err(SetLangError {
            message: "Languages definition not found.".to_string(),
        })
    }
}

#[tauri::command]
async fn get_language() -> Result<String, ()> {
    match get_config() {
        Ok(c) => Ok(c.language),
        Err(_) => Err(()),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            initialize,
            get_game_state,
            get_champion,
            set_language,
            get_language
        ])
        .setup(|app| {
            app.manage(Mutex::new(AppState::default()));
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
