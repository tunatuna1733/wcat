use serde::{Deserialize, Serialize};

#[derive(Deserialize, Serialize, Debug)]
pub enum ApplicationError {
    Query(QueryError),
    Format(FormatError),
    Config(ConfigError),
}

impl std::error::Error for ApplicationError {}

impl std::fmt::Display for ApplicationError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            ApplicationError::Query(err) => write!(
                f,
                "[Query Error] Status: {:?}, Message: {:?}, URL: {:?}",
                err.status, err.message, err.url
            ),
            ApplicationError::Format(err) => {
                write!(f, "[Format Error] Message: {:?}", err.message)
            }
            ApplicationError::Config(err) => {
                write!(f, "[Config Error] Message: {}", err.message)
            }
        }
    }
}

#[derive(Deserialize, Serialize, Debug)]
pub struct QueryError {
    pub status: Option<u16>,
    pub message: Option<String>,
    pub url: Option<String>,
}

impl From<QueryError> for ApplicationError {
    fn from(error: QueryError) -> Self {
        ApplicationError::Query(error)
    }
}

#[derive(Deserialize, Serialize, Debug)]
pub struct FormatError {
    pub message: Option<String>,
}

impl From<FormatError> for ApplicationError {
    fn from(error: FormatError) -> Self {
        ApplicationError::Format(error)
    }
}

#[derive(Deserialize, Serialize, Debug)]
pub struct ConfigError {
    pub message: String,
}

impl From<ConfigError> for ApplicationError {
    fn from(error: ConfigError) -> Self {
        ApplicationError::Config(error)
    }
}

#[derive(Deserialize, Serialize, Debug)]
pub struct SetLangError {
    pub message: String,
}
