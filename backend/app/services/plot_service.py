import io
from typing import Tuple
import matplotlib
matplotlib.use('Agg')  # Headless backend for web server safety

import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import matplotlib.colors as mcolors

from app.models.chart_spec import ChartSpec, ChartType, AggregationType, ColorPalette, StyleTheme

class PlotService:
    def render_chart(self, df: pd.DataFrame, spec: ChartSpec, format: str = "png") -> bytes:
        """Renders a chart based on ChartSpec and DataFrame with dynamic theme, reliable gridlines, and 300 DPI."""
        plot_df = self._prepare_data(df, spec)

        # Resolve Theme Colors based on spec.style_theme
        is_dark_theme = spec.style_theme in [StyleTheme.DARKGRID, StyleTheme.DARK]

        if is_dark_theme:
            BG_COLOR = "#09090B" if spec.style_theme == StyleTheme.DARK else "#18181B"
            TEXT_COLOR = "#F4F4F5"
            MUTED_TEXT = "#A1A1AA"
            GRID_COLOR = "#27272A"
            BORDER_COLOR = "#3F3F46"
        else:
            BG_COLOR = "#FFFFFF" if spec.style_theme in [StyleTheme.WHITE, StyleTheme.TICKS] else "#F8F9FA"
            TEXT_COLOR = "#27272A"
            MUTED_TEXT = "#71717A"
            GRID_COLOR = "#E4E4E7"
            BORDER_COLOR = "#D4D4D8"

        # Apply Seaborn aesthetic dynamic theme
        seaborn_style = spec.style_theme.value  # 'whitegrid', 'ticks', 'white', 'darkgrid', 'dark'
        sns.set_theme(style=seaborn_style, rc={
            "axes.facecolor": BG_COLOR,
            "figure.facecolor": BG_COLOR,
            "grid.color": GRID_COLOR,
            "axes.edgecolor": BORDER_COLOR,
            "text.color": TEXT_COLOR,
            "axes.labelcolor": MUTED_TEXT,
            "xtick.color": MUTED_TEXT,
            "ytick.color": MUTED_TEXT,
            "grid.linestyle": "--",
            "grid.alpha": 0.7,
            "axes.grid": spec.show_grid,
        })

        # Create figure and axis safely
        fig, ax = plt.subplots(figsize=(spec.fig_width, spec.fig_height), facecolor=BG_COLOR)
        ax.set_facecolor(BG_COLOR)
        ax.set_axisbelow(True)

        try:
            palette_colors = self._get_palette_colors(spec.palette, plot_df, spec)

            if spec.chart_type == ChartType.BAR:
                if spec.palette == ColorPalette.BURNT_ORANGE and not spec.hue_column:
                    n_bars = len(plot_df)
                    cmap = mcolors.LinearSegmentedColormap.from_list("burnt_orange_grad", ["#F4B393", "#E27C52", "#C85E34"])
                    bar_colors = [cmap(i / max(1, n_bars - 1)) for i in range(n_bars)]
                    sns.barplot(
                        data=plot_df,
                        x=spec.x_column,
                        y=spec.y_column,
                        palette=bar_colors,
                        ax=ax
                    )
                else:
                    sns.barplot(
                        data=plot_df,
                        x=spec.x_column,
                        y=spec.y_column,
                        hue=spec.hue_column,
                        palette=palette_colors,
                        ax=ax
                    )
            elif spec.chart_type == ChartType.LINE:
                sns.lineplot(
                    data=plot_df,
                    x=spec.x_column,
                    y=spec.y_column,
                    hue=spec.hue_column,
                    palette=palette_colors,
                    marker="o",
                    linewidth=2.5,
                    ax=ax
                )
            elif spec.chart_type == ChartType.SCATTER:
                sns.scatterplot(
                    data=plot_df,
                    x=spec.x_column,
                    y=spec.y_column,
                    hue=spec.hue_column,
                    palette=palette_colors,
                    s=60,
                    ax=ax
                )
            elif spec.chart_type == ChartType.HISTOGRAM:
                sns.histplot(
                    data=plot_df,
                    x=spec.x_column,
                    hue=spec.hue_column,
                    palette=palette_colors,
                    kde=True,
                    ax=ax
                )
            elif spec.chart_type == ChartType.BOX:
                sns.boxplot(
                    data=plot_df,
                    x=spec.x_column,
                    y=spec.y_column,
                    hue=spec.hue_column,
                    palette=palette_colors,
                    ax=ax
                )
            elif spec.chart_type == ChartType.PIE:
                self._render_pie(plot_df, spec, ax, palette_colors, BG_COLOR, TEXT_COLOR)
            elif spec.chart_type == ChartType.HEATMAP:
                self._render_heatmap(plot_df, spec, ax)
            else:
                sns.scatterplot(data=plot_df, x=spec.x_column, y=spec.y_column, ax=ax)

            # Titles, labels, and gridlines customization
            ax.set_title(spec.title, fontsize=14, fontweight="bold", pad=15, color=TEXT_COLOR)
            ax.set_xlabel(spec.x_label, fontsize=11, fontweight="semibold", color=MUTED_TEXT)
            if spec.chart_type != ChartType.PIE:
                ax.set_ylabel(spec.y_label, fontsize=11, fontweight="semibold", color=MUTED_TEXT)

            # Explicitly enforce show_grid state on axis
            if spec.chart_type != ChartType.PIE and spec.chart_type != ChartType.HEATMAP:
                ax.grid(visible=spec.show_grid, which='major', color=GRID_COLOR, linestyle="--", alpha=0.7 if spec.show_grid else 0.0)

            # Style tick labels cleanly
            ax.tick_params(colors=MUTED_TEXT, labelsize=10)
            for spine in ax.spines.values():
                spine.set_color(BORDER_COLOR)

            # Rotate X ticks if there are many categorical labels
            if spec.x_column in plot_df and plot_df[spec.x_column].nunique() > 6:
                plt.xticks(rotation=45, ha='right')

            # Style legend if present
            legend = ax.get_legend()
            if legend:
                legend.get_frame().set_facecolor(BG_COLOR)
                legend.get_frame().set_edgecolor(BORDER_COLOR)
                for text in legend.get_texts():
                    text.set_color(TEXT_COLOR)

            plt.tight_layout()

            # Save to buffer at High DPI 300
            buf = io.BytesIO()
            file_format = "svg" if format.lower() == "svg" else "png"
            fig.savefig(buf, format=file_format, dpi=300, bbox_inches='tight', facecolor=BG_COLOR)
            buf.seek(0)
            return buf.getvalue()

        finally:
            plt.close(fig)
            plt.close('all')

    def _get_palette_colors(self, palette: ColorPalette, df: pd.DataFrame, spec: ChartSpec):
        """Resolves custom burnt orange or Seaborn color palettes."""
        if palette == ColorPalette.BURNT_ORANGE:
            return ["#E27C52", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6", "#EC4899"]
        return palette.value

    def _prepare_data(self, df: pd.DataFrame, spec: ChartSpec) -> pd.DataFrame:
        """Applies grouping & aggregations if specified in ChartSpec."""
        if spec.aggregation == AggregationType.NONE or not spec.y_column:
            return df

        if spec.x_column not in df.columns or spec.y_column not in df.columns:
            return df

        agg_func = spec.aggregation.value
        try:
            group_cols = [spec.x_column]
            if spec.hue_column and spec.hue_column in df.columns:
                group_cols.append(spec.hue_column)

            aggregated_df = df.groupby(group_cols, as_index=False)[spec.y_column].agg(agg_func)
            return aggregated_df
        except Exception:
            return df

    def _render_pie(self, df: pd.DataFrame, spec: ChartSpec, ax: plt.Axes, palette_colors, bg_color: str, text_color: str):
        """Helper to render a pie chart on light/dark canvas."""
        if spec.y_column and spec.y_column in df.columns:
            data_series = df.groupby(spec.x_column)[spec.y_column].sum()
        else:
            data_series = df[spec.x_column].value_counts().head(8)

        if isinstance(palette_colors, str):
            colors = sns.color_palette(palette_colors, len(data_series))
        else:
            colors = palette_colors[:len(data_series)]

        wedges, texts, autotexts = ax.pie(
            data_series,
            labels=data_series.index,
            autopct='%1.1f%%',
            startangle=140,
            colors=colors
        )
        for t in texts:
            t.set_color(text_color)
            t.set_fontsize(10)
        for at in autotexts:
            at.set_color("#FFFFFF")
            at.set_weight('bold')

    def _render_heatmap(self, df: pd.DataFrame, spec: ChartSpec, ax: plt.Axes):
        """Helper to render a correlation or pivot heatmap."""
        numeric_df = df.select_dtypes(include=['number'])
        cmap = "Oranges" if spec.palette == ColorPalette.BURNT_ORANGE else spec.palette.value
        if not numeric_df.empty and len(numeric_df.columns) > 1:
            sns.heatmap(
                numeric_df.corr(),
                annot=True,
                cmap=cmap,
                fmt=".2f",
                ax=ax,
                cbar_kws={"drawedges": False}
            )
        else:
            sns.heatmap(df.head(10).select_dtypes(include=['number']), annot=True, cmap=cmap, ax=ax)

# Global singleton instance
plot_service = PlotService()
