use api::ApiClient;
use league::format_game_data;
use models::current_game::CurrentGameData;
use tauri::{async_runtime::Mutex, Manager, State};

mod api;
mod league;
mod models;

#[derive(Default)]
struct AppState {
    api_client: ApiClient,
}

#[tauri::command]
async fn initialize(state: State<'_, Mutex<AppState>>) -> Result<(), String> {
    let mut state = state.lock().await;
    match state.api_client.initialize().await {
        Ok(_) => Ok(()),
        Err(e) => Err(format!(
            "Initialize error. Status: {:?} {:?}",
            e.status(),
            e
        )),
    }
}

#[tauri::command]
async fn get_game_state(state: State<'_, Mutex<AppState>>) -> Result<CurrentGameData, String> {
    let state = state.lock().await;
    match state.api_client.get_current_game().await {
        Ok(r) => Ok(format_game_data(r)),
        Err(e) => Err(format!("Query error. Status: {:?} {:?}", e.status(), e)),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![initialize, get_game_state])
        .setup(|app| {
            app.manage(Mutex::new(AppState::default()));
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
