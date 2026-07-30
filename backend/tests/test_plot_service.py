import pytest
from app.services.plot_service import plot_service
from app.models.chart_spec import ChartSpec, ChartType, AggregationType, ColorPalette, StyleTheme

@pytest.mark.parametrize("chart_type", [
    ChartType.BAR,
    ChartType.LINE,
    ChartType.SCATTER,
    ChartType.HISTOGRAM,
    ChartType.BOX,
    ChartType.PIE,
    ChartType.HEATMAP,
])
def test_render_chart_types(sample_df, chart_type):
    spec = ChartSpec(
        chart_type=chart_type,
        title=f"Test {chart_type.value} Chart",
        x_column="category" if chart_type != ChartType.HEATMAP else "sales",
        y_column="sales" if chart_type not in [ChartType.HISTOGRAM, ChartType.PIE] else None,
        hue_column=None,
        aggregation=AggregationType.SUM if chart_type == ChartType.BAR else AggregationType.NONE,
        x_label="X Axis",
        y_label="Y Axis",
        palette=ColorPalette.VIRIDIS,
        style_theme=StyleTheme.DARKGRID
    )

    img_bytes = plot_service.render_chart(sample_df, spec, format="png")
    assert isinstance(img_bytes, bytes)
    assert len(img_bytes) > 0
    # PNG Magic Header check: 89 50 4E 47 0D 0A 1A 0A
    assert img_bytes[:4] == b'\x89PNG'

def test_render_svg_format(sample_df):
    spec = ChartSpec(
        chart_type=ChartType.LINE,
        title="SVG Test",
        x_column="date",
        y_column="sales",
        x_label="Date",
        y_label="Sales"
    )

    svg_bytes = plot_service.render_chart(sample_df, spec, format="svg")
    assert isinstance(svg_bytes, bytes)
    assert b"<svg" in svg_bytes or b"xml" in svg_bytes
