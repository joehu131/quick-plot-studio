import io
from typing import Tuple
import matplotlib
matplotlib.use('Agg')  # Headless backend for web server safety

import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd

from app.models.chart_spec import ChartSpec, ChartType, AggregationType

class PlotService:
    def render_chart(self, df: pd.DataFrame, spec: ChartSpec, format: str = "png") -> bytes:
        """Renders a chart based on ChartSpec and DataFrame, returning image bytes."""
        # Pre-process aggregations if requested
        plot_df = self._prepare_data(df, spec)

        # Set Seaborn aesthetic style theme
        sns.set_theme(style=spec.style_theme.value)

        # Create figure and axis safely
        fig, ax = plt.subplots(figsize=(spec.fig_width, spec.fig_height))

        try:
            palette = spec.palette.value

            if spec.chart_type == ChartType.BAR:
                sns.barplot(
                    data=plot_df,
                    x=spec.x_column,
                    y=spec.y_column,
                    hue=spec.hue_column,
                    palette=palette,
                    ax=ax
                )
            elif spec.chart_type == ChartType.LINE:
                sns.lineplot(
                    data=plot_df,
                    x=spec.x_column,
                    y=spec.y_column,
                    hue=spec.hue_column,
                    palette=palette,
                    marker="o",
                    ax=ax
                )
            elif spec.chart_type == ChartType.SCATTER:
                sns.scatterplot(
                    data=plot_df,
                    x=spec.x_column,
                    y=spec.y_column,
                    hue=spec.hue_column,
                    palette=palette,
                    ax=ax
                )
            elif spec.chart_type == ChartType.HISTOGRAM:
                sns.histplot(
                    data=plot_df,
                    x=spec.x_column,
                    hue=spec.hue_column,
                    palette=palette,
                    kde=True,
                    ax=ax
                )
            elif spec.chart_type == ChartType.BOX:
                sns.boxplot(
                    data=plot_df,
                    x=spec.x_column,
                    y=spec.y_column,
                    hue=spec.hue_column,
                    palette=palette,
                    ax=ax
                )
            elif spec.chart_type == ChartType.PIE:
                self._render_pie(plot_df, spec, ax)
            elif spec.chart_type == ChartType.HEATMAP:
                self._render_heatmap(plot_df, spec, ax)
            else:
                # Default fallback: scatter plot
                sns.scatterplot(data=plot_df, x=spec.x_column, y=spec.y_column, ax=ax)

            # Titles, labels, and gridlines customization
            ax.set_title(spec.title, fontsize=14, fontweight="bold", pad=15)
            ax.set_xlabel(spec.x_label, fontsize=11, fontweight="semibold")
            if spec.chart_type != ChartType.PIE:
                ax.set_ylabel(spec.y_label, fontsize=11, fontweight="semibold")

            ax.grid(spec.show_grid)

            # Rotate X ticks if there are many categorical labels
            if spec.x_column in plot_df and plot_df[spec.x_column].nunique() > 6:
                plt.xticks(rotation=45, ha='right')

            plt.tight_layout()

            # Save to buffer
            buf = io.BytesIO()
            file_format = "svg" if format.lower() == "svg" else "png"
            fig.savefig(buf, format=file_format, dpi=150, bbox_inches='tight')
            buf.seek(0)
            return buf.getvalue()

        finally:
            # Crucial: Always close figure to prevent server memory leaks
            plt.close(fig)
            plt.close('all')

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
            # If aggregation fails (e.g. non-numeric y), return raw df
            return df

    def _render_pie(self, df: pd.DataFrame, spec: ChartSpec, ax: plt.Axes):
        """Helper to render a pie chart."""
        if spec.y_column and spec.y_column in df.columns:
            data_series = df.groupby(spec.x_column)[spec.y_column].sum()
        else:
            data_series = df[spec.x_column].value_counts().head(8)

        colors = sns.color_palette(spec.palette.value, len(data_series))
        ax.pie(
            data_series,
            labels=data_series.index,
            autopct='%1.1f%%',
            startangle=140,
            colors=colors
        )

    def _render_heatmap(self, df: pd.DataFrame, spec: ChartSpec, ax: plt.Axes):
        """Helper to render a correlation or pivot heatmap."""
        numeric_df = df.select_dtypes(include=['number'])
        if not numeric_df.empty and len(numeric_df.columns) > 1:
            sns.heatmap(
                numeric_df.corr(),
                annot=True,
                cmap=spec.palette.value,
                fmt=".2f",
                ax=ax
            )
        else:
            # Fallback if no numeric correlation possible
            sns.heatmap(df.head(10).select_dtypes(include=['number']), annot=True, cmap=spec.palette.value, ax=ax)

# Global singleton instance
plot_service = PlotService()
