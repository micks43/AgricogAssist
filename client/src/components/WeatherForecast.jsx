import React from "react";

// Helper to group entries by ISO date (YYYY-MM-DD)
function groupByDate(entries) {
  const days = {};
  entries.forEach(entry => {
    // dt_txt comes as "2025-07-19 12:00:00"
    const dateKey = entry.dt_txt.split(" ")[0]; // "YYYY-MM-DD"
    if (!days[dateKey]) days[dateKey] = [];
    days[dateKey].push(entry);
  });
  return days;
}

export default function WeatherForecast({ forecast }) {
  // Defensive defaults
  const daily = forecast && Array.isArray(forecast.daily) ? forecast.daily : [];

  const grouped = groupByDate(daily);
  const dateKeys = Object.keys(grouped).slice(0, 5);

  return (
    <div className="forecast-container">
      {dateKeys.length === 0 ? (
        <div>No forecast available.</div>
      ) : (
        dateKeys.map(dateKey => (
          <div key={dateKey}>
            <h3 style={{ marginTop: "1.5em", marginBottom: "0.5em" }}>
              {new Date(dateKey).toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long"
              })} forecast
            </h3>
            <div className="forecast-list">
              {grouped[dateKey].map((entry, i) => (
                <div
                  key={i}
                  className="forecast-entry"
                  style={{
                    borderBottom: "1px solid #eee",
                    marginBottom: 8,
                    paddingBottom: 8
                  }}
                >
                  <strong>
                    {entry.dt_txt
                      ? new Date(entry.dt_txt).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })
                      : "N/A"}
                  </strong>{" "}
                  {entry.weather && entry.weather[0] && (
                    <>
                      <img
                        src={`https://openweathermap.org/img/wn/${entry.weather[0].icon}@2x.png`}
                        alt={entry.weather[0].description}
                        style={{ verticalAlign: "middle" }}
                      />
                      <span style={{ marginLeft: 4 }}>{entry.weather[0].description}</span>
                    </>
                  )}
                  <div>
                    Temperature:{" "}
                    {entry.main && entry.main.temp !== undefined
                      ? Math.round(entry.main.temp)
                      : "N/A"}°C
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}



