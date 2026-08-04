import pytest
import warnings
import matplotlib.colors as mcolors
import pandas as pd
from app.services.plot_service import plot_service
from app.models.chart_spec import ChartSpec, ChartType, AggregationType, Theme, GridStyle

@pytest.mark.parametrize("chart_type", [
    ChartType.BAR,
    ChartType.LINE,
    ChartType.SCATTER,
    ChartType.HISTOGRAM,
    ChartType.BOX,
    ChartType.PIE,
    ChartType.HEATMAP,
])
@pytest.mark.parametrize("theme", [
    Theme.ORANGES,
    Theme.VIRIDIS,
    Theme.MAGMA,
    Theme.COOLWARM,
    Theme.DEEP,
    Theme.MUTED,
    Theme.PASTEL,
    Theme.CREST,
    Theme.FLARE,
])
def test_render_chart_types_and_themes(sample_df, chart_type, theme):
    spec = ChartSpec(
        chart_type=chart_type,
        title=f"Test {chart_type.value} Chart with {theme.value}",
        x_column="category" if chart_type != ChartType.HEATMAP else "sales",
        y_column="sales" if chart_type not in [ChartType.HISTOGRAM, ChartType.PIE] else None,
        hue_column=None,
        aggregation=AggregationType.SUM if chart_type == ChartType.BAR else AggregationType.NONE,
        x_label="X Axis",
        y_label="Y Axis",
        theme=theme,
        grid_style=GridStyle.DARKGRID
    )

    # Catch any UserWarning to ensure no Seaborn 'Ignoring palette' warnings are emitted
    with warnings.catch_warnings():
        warnings.simplefilter("error", UserWarning)
        img_bytes = plot_service.render_chart(sample_df, spec, format="png")
    
    assert isinstance(img_bytes, bytes)
    assert len(img_bytes) > 0
    assert img_bytes[:4] == b'\x89PNG'

def test_single_series_warm_oranges_theme_color(sample_df):
    """Verifies that selecting Line plot with Warm Oranges theme produces orange primary color."""
    spec = ChartSpec(
        chart_type=ChartType.LINE,
        title="Warm Oranges Line Test",
        x_column="date",
        y_column="sales",
        hue_column=None,
        theme=Theme.ORANGES,
        grid_style=GridStyle.WHITEGRID,
        x_label="Date",
        y_label="Sales"
    )

    colors = plot_service._get_palette_colors(spec.theme, sample_df, spec, n_cats=1)
    assert len(colors) == 1
    rgb = colors[0]
    # Verify RGB components for orange: Red > Blue and Red > Green
    r, g, b = rgb[0], rgb[1], rgb[2]
    assert r > b
    assert r > 0.5  # Vivid warm color

    # Verify rendering completes without warnings
    with warnings.catch_warnings():
        warnings.simplefilter("error", UserWarning)
        img_bytes = plot_service.render_chart(sample_df, spec, format="png")
    assert img_bytes[:4] == b'\x89PNG'

def test_grid_styles(sample_df):
    """Verifies all GridStyle variants render without errors."""
    for style in GridStyle:
        spec = ChartSpec(
            chart_type=ChartType.LINE,
            title=f"Grid Style {style.value}",
            x_column="date",
            y_column="sales",
            theme=Theme.ORANGES,
            grid_style=style,
            x_label="Date",
            y_label="Sales"
        )
        img_bytes = plot_service.render_chart(sample_df, spec, format="png")
        assert img_bytes[:4] == b'\x89PNG'

def test_render_svg_format(sample_df):
    spec = ChartSpec(
        chart_type=ChartType.LINE,
        title="SVG Test",
        x_column="date",
        y_column="sales",
        x_label="Date",
        y_label="Sales",
        theme=Theme.VIRIDIS,
        grid_style=GridStyle.WHITEGRID
    )

    svg_bytes = plot_service.render_chart(sample_df, spec, format="svg")
    assert isinstance(svg_bytes, bytes)
    assert b"<svg" in svg_bytes or b"xml" in svg_bytes
