# Repository Rules & Customizations for QuickPlot Studio

## Documentation & Notes Rule

- Keep all documentation, rule notes, and agent guidelines short, concise, and generalistic.

## Terminal Debug Logging (`DEBUG`)

- The backend provides a global `DEBUG` toggle in `backend/app/config.py` (`DEBUG: bool = True`).
- **Rule for Future Development**: All diagnostic logs, pipeline traces, timing outputs, and debug print statements MUST be gated behind `if settings.DEBUG:`.
- When `settings.DEBUG` is `True`, stdout prints real-time `[AI Pipeline]` diagnostic lines for data upload, model selection/latency, and chart rendering.
- Setting `DEBUG = False` silences all terminal debug output for quiet/production execution.
